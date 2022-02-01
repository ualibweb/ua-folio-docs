import parser from "@apidevtools/json-schema-ref-parser";
import ajv from "ajv";
import chalk from "chalk";
import { MultiBar, SingleBar } from "cli-progress";
import { createArrayCsvWriter } from "csv-writer";
import debugFactory from "debug";
import { Stats } from "fast-stats";
import { readFileSync } from "fs";
import createProxyAgent from "https-proxy-agent";
import { load as parseYaml } from "js-yaml";
import memoizee from "memoizee";
import mergeOptions from "merge-options";
import fetch, { RequestInit } from "node-fetch";
import prompt from "prompt";
import { URLSearchParams } from "url";
import yargs from "yargs";
import {
  AnyBenchmark,
  BenchmarkPrimary,
  BenchmarkResult,
  Endpoint,
  MainConfiguration,
  Settings,
  TimedResponse,
} from "./types";

prompt.start();

async function loadConfig(): Promise<MainConfiguration> {
  const debug = debugFactory("api-benchmark:load-config");

  const argv = await yargs
    .scriptName("npm run start")
    .command(
      "yaml filename",
      "Run benchmarks from a configuration file written in YAML"
    )
    .command(
      "json filename",
      "Run benchmarks from a configuration file written in JSON"
    )
    .demandCommand(1, 1)
    .help().argv;

  debug("Read command line args: %O", argv);

  const schema = await parser.bundle(__dirname + "/schema/base.json");
  debug("Dereferenced schema: %o", schema);

  const validator = new ajv({ allErrors: true }).compile(schema);

  debug("Reading the contents of file %s", argv.filename);

  const fileContents = readFileSync(argv.filename as string).toString();

  debug("Attempting to parse the file as %s", argv._[0]);

  let data;
  if (argv._[0] === "json") {
    data = JSON.parse(fileContents);
  } else {
    data = parseYaml(fileContents);
  }

  debug("Attempting to validate");

  const valid = validator(data);
  if (!valid) {
    chalk.red("Configuration file is invalid:");
    console.error(validator.errors);
    throw new Error("Bad configuration");
  }

  debug("Validation successful: %o", data);

  return data as MainConfiguration;
}

const checkResponseCode = memoizee(
  (expected: Endpoint["requiredResponseCode"], status: number): boolean => {
    switch (expected) {
      case 100:
      case "100":
        return status >= 100 && status < 200;
      case 200:
      case "200":
        return status >= 200 && status < 300;
      case 300:
      case "300":
        return status >= 300 && status < 400;
      case 400:
      case "400":
        return status >= 400 && status < 500;
      case 500:
      case "500":
        return status >= 500 && status < 600;
      default:
        return true;
    }
  }
);

const getBody = memoizee(
  (filename: string | null | undefined): string | undefined => {
    if (filename === null || filename === undefined) {
      return undefined;
    }
    return readFileSync(__dirname + "/bodies/" + filename).toString();
  }
);

const progressBarFactory = new MultiBar({
  forceRedraw: true,
  format:
    " [{bar}] {benchmark} | Elapsed: {duration_formatted} | ETA: {eta_formatted} | {value}/{total}",
});
const progressBars: Record<string, SingleBar> = {};

function updateProgressBar(
  prefix: string,
  benchmark: AnyBenchmark,
  i: number,
  progress: number
) {
  if (prefix !== "") {
    return; // no progress bars for non-root
  }
  const key = `${benchmark.id}[${i}]`;
  if (!Object.hasOwnProperty.call(progressBars, key)) {
    progressBars[key] = progressBarFactory.create(
      (benchmark as BenchmarkPrimary).runs,
      progress,
      {
        benchmark: key,
      }
    );
  }

  progressBars[key].update(progress);
}

function stopProgressBar(
  prefix: string,
  benchmark: AnyBenchmark,
  i: number
): void {
  if (prefix !== "") {
    return; // no progress bars for non-root
  }
  const key = `${benchmark.id}[${i}]`;
  if (Object.hasOwnProperty.call(progressBars, key)) {
    progressBars[key].stop();
  }
}

function stopAllProgressBars(): void {
  progressBarFactory.stop();
}

function createRequestGenerators(
  config: Settings
): ((endpoint: Endpoint) => Promise<TimedResponse>)[] {
  return config.urls.map((url) => {
    const options: RequestInit = {};
    options.headers = url.headers;

    if (typeof config.proxy === "string") {
      options.agent = createProxyAgent(config.proxy);
    }

    return (endpoint: Endpoint) => {
      let queryString = "?";
      if (typeof endpoint.queryString === "string") {
        queryString = endpoint.queryString;
      } else if (typeof endpoint.queryString === "object") {
        queryString = new URLSearchParams(endpoint.queryString).toString();
      }

      return new Promise((resolve, reject) => {
        const startTime = process.hrtime();

        fetch(
          url.base + endpoint.path + queryString,
          mergeOptions(options, {
            method: endpoint.method,
            body: getBody(endpoint.requestBody),
            headers: {
              "Content-Type":
                endpoint.requestBody === undefined
                  ? "text/plain"
                  : "application/json",
            },
          })
        )
          .then((response) => {
            if (
              !checkResponseCode(endpoint.requiredResponseCode, response.status)
            ) {
              reject(
                `Status ${response.status} ${response.statusText} is not valid`
              );
            }

            const result = process.hrtime(startTime);

            resolve({ response, timeMs: result[0] * 1e3 + result[1] / 1e6 });
          })
          .catch(reject);
      });
    };
  });
}

function parseBenchmarks(
  benchmarks: AnyBenchmark[]
): [Record<string, AnyBenchmark>, string[]] {
  const map: Record<string, AnyBenchmark> = {};
  const toRun: string[] = [];

  benchmarks.forEach((benchmark) => {
    map[benchmark.id] = benchmark;
    if (Object.hasOwnProperty.call(benchmark, "runs")) {
      toRun.push(benchmark.id);
    }
  });

  return [map, toRun];
}

function resolveBenchmark(
  benchmark: string | AnyBenchmark,
  benchmarks: Record<string, AnyBenchmark>
): AnyBenchmark {
  if (typeof benchmark === "string") {
    return benchmarks[benchmark];
  }
  return benchmark;
}

async function runEndpointSetForRequestGenerator(
  debug: debugFactory.Debugger,
  i: number,
  name: string,
  requestGenerator: (endpoint: Endpoint) => Promise<TimedResponse>,
  endpoints: (string | Endpoint)[],
  benchmarks: Record<string, AnyBenchmark>,
  prefix: string
) {
  const results: BenchmarkResult[] = [];
  for (const endpoint of endpoints) {
    if (typeof endpoint === "string") {
      debug(`Recursing to run ${prefix}${endpoint}`);
      results.push(
        ...(await runBenchmarkForRequestGenerator(
          i,
          requestGenerator,
          benchmarks,
          resolveBenchmark(endpoint, benchmarks),
          prefix
        ))
      );
    } else {
      debug(`Running endpoint ${endpoint.method} ${endpoint.path}`);
      const response = await requestGenerator(endpoint);
      results.push({
        id: `${prefix}untitled`,
        name: `${endpoint.method} ${endpoint.path}`,
        description: `${endpoint.method} ${endpoint.path}`,
        runs: 1,
        results: new Stats({ sampling: true }).push(response.timeMs),
      });
    }
  }
  const overallResult: BenchmarkResult = {
    id: `${prefix.replace(/-+$/g, "")}`,
    name,
    description: `Aggregate of ${name}`,
    runs: 1,
    results: new Stats({ sampling: true }).push(
      results.map((result) => result.results.sum)
    ),
  };

  return [overallResult, ...results];
}

async function runBenchmarkForRequestGenerator(
  i: number,
  requestGenerator: (endpoint: Endpoint) => Promise<TimedResponse>,
  benchmarks: Record<string, AnyBenchmark>,
  benchmark: AnyBenchmark,
  prefix = ""
): Promise<BenchmarkResult[]> {
  const debug = debugFactory(`api-benchmark:${prefix}${benchmark.id}[${i}]`);

  const result: BenchmarkResult[] = [];

  updateProgressBar(prefix, benchmark, i, 0);

  debug("Running init(s): %o", benchmark.init);
  if (Array.isArray(benchmark.init)) {
    result.push(
      ...(await runEndpointSetForRequestGenerator(
        debug,
        i,
        "Initialization",
        requestGenerator,
        benchmark.init,
        benchmarks,
        `${prefix}${benchmark.id}-init-`
      ))
    );
  }

  if (Object.hasOwnProperty.call(benchmark, "endpoints")) {
    benchmark = benchmark as BenchmarkPrimary;
    debug("Running main endpoint(s): %o", benchmark.endpoints);
    result.push(
      ...(await runMainEndpointSetForRequestGenerator(
        debug,
        benchmarks,
        requestGenerator,
        i,
        benchmark,
        prefix
      ))
    );
  }

  debug("Running teardown(s): %o", benchmark.teardown);
  if (Array.isArray(benchmark.teardown)) {
    result.push(
      ...(await runEndpointSetForRequestGenerator(
        debug,
        i,
        "Teardown",
        requestGenerator,
        benchmark.teardown,
        benchmarks,
        `${prefix}${benchmark.id}-teardown-`
      ))
    );
  }

  stopProgressBar(prefix, benchmark, i);

  return result;
}

async function runMainEndpointSetForRequestGenerator(
  debug: debugFactory.Debugger,
  benchmarks: Record<string, AnyBenchmark>,
  requestGenerator: (endpoint: Endpoint) => Promise<TimedResponse>,
  i: number,
  benchmark: BenchmarkPrimary,
  prefix: string
) {
  const mainResults: BenchmarkResult[] = [];

  for (const endpoint of benchmark.endpoints) {
    if (typeof endpoint === "string") {
      mainResults.push({
        id: `${prefix}${benchmark.id}-${endpoint}`,
        name: `${endpoint}`,
        description: `${endpoint}`,
        runs: benchmark.runs,
        results: new Stats({ sampling: true }),
      });
    } else {
      mainResults.push({
        id: `${prefix}${benchmark.id}-untitled`,
        name: `${endpoint.method} ${endpoint.path}`,
        description: `${endpoint.method} ${endpoint.path}`,
        runs: benchmark.runs,
        results: new Stats({ sampling: true }),
      });
    }
  }

  for (let run = 1; run <= benchmark.runs; run++) {
    for (
      let endpointIndex = 0;
      endpointIndex < benchmark.endpoints.length;
      endpointIndex++
    ) {
      const endpoint = benchmark.endpoints[endpointIndex];

      if (typeof endpoint === "string") {
        debug(`Recursing to run ${prefix}${endpoint}`);
        mainResults[endpointIndex].results.push(
          (
            await runBenchmarkForRequestGenerator(
              i,
              requestGenerator,
              benchmarks,
              resolveBenchmark(endpoint, benchmarks),
              `${prefix}${benchmark.id}-`
            )
          )
            .map((result) => result.results.amean())
            .reduce((p, c) => p + c, 0)
        );
      } else {
        debug(`Running endpoint ${endpoint.method} ${endpoint.path}`);
        const response = await requestGenerator(endpoint);
        mainResults[endpointIndex].results.push(response.timeMs);
      }
    }
    updateProgressBar(prefix, benchmark, i, run);
  }

  return [
    {
      id: `${prefix}${benchmark.id}`,
      name: benchmark.name ?? "Untitled",
      description: benchmark.description ?? "",
      runs: benchmark.runs,
      results: aggregate2DStats(mainResults),
    },
    ...mainResults,
  ];
}

function aggregate2DStats(mainResults: BenchmarkResult[]) {
  return new Stats({ sampling: true }).push(
    // sum up each series of endpoints from each run
    // Stats typings incorrectly do not specify raw .data access
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (() => {
      if (mainResults.length === 0) return [];
      const copy = [...mainResults] as [BenchmarkResult, ...BenchmarkResult[]];
      const first = (copy.shift().results as any).data;
      return copy.reduce((prev: number[], curr: BenchmarkResult) => {
        return prev.map((a, j) => a + (curr.results as any).data[j]);
      }, first);
    })()
    /* eslint-enable @typescript-eslint/no-explicit-any */
  );
}

async function runBenchmark(
  requestGenerators: ((endpoint: Endpoint) => Promise<TimedResponse>)[],
  benchmarks: Record<string, AnyBenchmark>,
  benchmark: AnyBenchmark
): Promise<BenchmarkResult[][]> {
  const debug = debugFactory(`api-benchmark:${benchmark.id}`);

  const promises: Promise<BenchmarkResult[]>[] = [];

  // multiple promises can execute concurrently to different request generators
  for (let i = 0; i < requestGenerators.length; i++) {
    debug("Running for request generator %d", i);

    promises.push(
      runBenchmarkForRequestGenerator(
        i,
        requestGenerators[i],
        benchmarks,
        benchmark,
        ""
      )
    );
  }

  const awaited: BenchmarkResult[][] = [];

  for (const promise of promises) {
    awaited.push(await promise);
  }

  return awaited;
}

async function writeResults(
  results: BenchmarkResult[][],
  config: Settings
): Promise<void> {
  const debug = debugFactory("api-benchmark:writer");

  const header1 = ["", "", "", ""];
  const header2 = ["ID", "Name", "Description", "Runs"];

  config.urls.forEach((url) => {
    header1.push(url.base);
    header1.push("", "", "", "", "", "");

    header2.push(
      "Mean (ms)",
      "Median (ms)",
      "Min (ms)",
      "Max (ms)",
      "Standard Deviation (ms)",
      "95% CI Lower (ms)",
      "95% CI Upper (ms)"
    );
  });

  debug("Creating writer");
  const writer = createArrayCsvWriter({
    header: header1,
    path: config.outputFilename,
  });

  debug("Writing headers");
  await writer.writeRecords([header2]);

  if (results.length === 0) {
    return;
  }

  for (let i = 0; i < results[0].length; i++) {
    debug("Writing result %d (%s)", i, results[0][i].id);

    const row = [
      results[0][i].id,
      results[0][i].name,
      results[0][i].description,
      results[0][i].runs,
    ];

    results.forEach((resultSet) => {
      const stats = resultSet[i].results;
      row.push(
        stats.amean().toFixed(1),
        stats.median().toFixed(1),
        stats.min.toFixed(1),
        stats.max.toFixed(1),
        stats.stddev().toFixed(1),
        (stats.amean() - stats.moe()).toFixed(1),
        (stats.amean() + stats.moe()).toFixed(1)
      );
    });

    await writer.writeRecords([row]);
  }
}

async function run(): Promise<void> {
  const debug = debugFactory("api-benchmark:main");

  debug("Loading config");
  const config = await loadConfig();

  debug("Creating request generators");
  const requestGenerators = createRequestGenerators(config.configuration);

  debug("Making map of benchmarks");
  const [benchmarks, benchmarksToRun] = parseBenchmarks(config.benchmarks);

  debug("Got: %O, %O", benchmarks, benchmarksToRun);

  const results: BenchmarkResult[][] = [];
  for (const benchmarkId of benchmarksToRun) {
    debug("Running %s", benchmarkId);
    const result = await runBenchmark(
      requestGenerators,
      benchmarks,
      resolveBenchmark(benchmarkId, benchmarks)
    );
    for (let i = 0; i < result.length; i++) {
      while (i >= results.length) {
        results.push([]);
      }
      results[i].push(...result[i]);
    }
  }

  debug("Result: %o", results);

  stopAllProgressBars();

  debug("Writing results");
  await writeResults(results, config.configuration);

  debug("Done!");
}

run();
