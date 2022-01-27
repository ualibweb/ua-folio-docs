import parser from "@apidevtools/json-schema-ref-parser";
import ajv from "ajv";
import chalk from "chalk";
import debugFactory from "debug";
import { readFileSync } from "fs";
import createProxyAgent from "https-proxy-agent";
import { load as parseYaml } from "js-yaml";
import memoizee from "memoizee";
import mergeOptions from "merge-options";
import fetch, { RequestInit, Response } from "node-fetch";
import prompt from "prompt";
import { URLSearchParams } from "url";
import yargs from "yargs";
import { AnyBenchmark, Endpoint, MainConfiguration, Settings } from "./types";

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

function createRequestGenerators(
  config: Settings
): ((endpoint: Endpoint) => Promise<Response>)[] {
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
        fetch(
          url.base + endpoint.path + queryString,
          mergeOptions(options, {
            method: endpoint.method,
            body: getBody(endpoint.requestBody),
          })
        )
          .then((response) => {
            if (
              !checkResponseCode(endpoint.requiredResponseCode, response.status)
            ) {
              reject(`Status ${response.statusText} is not valid`);
            }

            resolve(response);
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

function runBenchmark(benchmark: AnyBenchmark, root: boolean = true): void {}

async function run(): Promise<void> {
  const debug = debugFactory("api-benchmark:main");

  debug("Loading config");
  const config = await loadConfig();

  debug("Creating request generators");
  const requestGenerators = createRequestGenerators(config.configuration);

  debug("Making map of benchmarks");
  const [benchmarks, benchmarksToRun] = parseBenchmarks(config.benchmarks);

  debug("Got: %O, %O", benchmarks, benchmarksToRun);
}

run();
