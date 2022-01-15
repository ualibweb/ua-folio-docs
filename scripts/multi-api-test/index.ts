import chalk from "chalk";
import deepEqual from "deep-equal";
import { detailedDiff } from "deep-object-diff";
import createProxyAgent from "https-proxy-agent";
import fetch from "node-fetch";
import { Client } from "pg";
import prompt from "prompt";
import { promisify } from "util";
import capture from "./capture.json";

const client = new Client({
  user: "okapi",
  host: "localhost",
  database: "okapi_modules",
  password: "okapi25",
});
client.connect();

const log = console.log;

const CORRECT_PATH = "http://localhost:8084";
const CORRECT_TENANT = "test";
const TEST_PATH = "http://localhost:8080";
const TEST_TENANT = "diku";

prompt.start();

const proxy = createProxyAgent("http://localhost:8888");

async function truncate(): Promise<void> {
  log(chalk.bold.blue("Truncating databases:"));

  log(chalk.blue("Truncating diku_mod_calendar (new):"));
  try {
    await client.query("TRUNCATE TABLE diku_mod_calendar.calendars CASCADE");
  } catch (e) {
    log(chalk.red("Could not truncate database: " + e));
  }

  log(chalk.blue("Truncating test_mod_calendar (legacy):"));
  try {
    await client.query(
      "TRUNCATE TABLE test_mod_calendar.actual_opening_hours CASCADE"
    );
    await client.query(
      "TRUNCATE TABLE test_mod_calendar.audit_actual_opening_hours CASCADE"
    );
    await client.query(
      "TRUNCATE TABLE test_mod_calendar.audit_exceptional_hours CASCADE"
    );
    await client.query(
      "TRUNCATE TABLE test_mod_calendar.audit_exceptions CASCADE"
    );
    await client.query(
      "TRUNCATE TABLE test_mod_calendar.audit_openings CASCADE"
    );
    await client.query(
      "TRUNCATE TABLE test_mod_calendar.audit_regular_hours CASCADE"
    );
    await client.query(
      "TRUNCATE TABLE test_mod_calendar.exceptional_hours CASCADE"
    );
    await client.query("TRUNCATE TABLE test_mod_calendar.exceptions CASCADE");
    await client.query("TRUNCATE TABLE test_mod_calendar.openings CASCADE");
    await client.query(
      "TRUNCATE TABLE test_mod_calendar.regular_hours CASCADE"
    );
    await client.query("TRUNCATE TABLE test_mod_calendar.rmb_internal CASCADE");
    await client.query(
      "TRUNCATE TABLE test_mod_calendar.rmb_internal_analyze CASCADE"
    );
    await client.query(
      "TRUNCATE TABLE test_mod_calendar.rmb_internal_index CASCADE"
    );
    await client.query("TRUNCATE TABLE test_mod_calendar.rmb_job CASCADE");
  } catch (e) {
    log(chalk.red("Could not truncate database: " + e));
  }
}

async function run(): Promise<void> {
  const failures = new Set();
  const concern = new Set();

  let currentTest = "none";
  let success = true;

  await truncate();

  for (const call of capture) {
    if (call.path === "/_/tests/_/database-truncate") {
      await truncate();
    } else if (call.path === "/_/tests/_/finish") {
      if (success) {
        log(chalk.bold.green(`Test ${currentTest} finished`));
      } else {
        log(chalk.bold.bgRed.white(`Test ${currentTest} failed`));
      }
    } else if (call.path.startsWith("/_/tests/")) {
      currentTest = call.path.substring(9);
      success = true;

      log(chalk.bold.whiteBright(`Starting test ${currentTest}`));
    } else {
      const fullPath =
        call.path + (call.query === null ? "" : `?${call.query}`);

      const headers: Record<string, string> = {};
      headers["Accept"] = "*/*";

      if (Object.hasOwnProperty.call(call.request, "body")) {
        headers["Content-Type"] = "application/json";
      }

      const correctResponse = await fetch(`${CORRECT_PATH}${fullPath}`, {
        agent: proxy,
        method: call.method,
        body: call.request?.body?.text,
        headers: Object.assign(
          {
            "x-okapi-url": CORRECT_PATH,
            "x-okapi-tenant": CORRECT_TENANT,
          },
          headers
        ),
      });

      let correctData: string | Record<string, any> =
        await correctResponse.text();
      try {
        correctData = JSON.parse(correctData);
      } catch (e) {}

      const correctResponseCode = correctResponse.status;

      const testResponse = await fetch(`${TEST_PATH}${fullPath}`, {
        agent: proxy,
        method: call.method,
        body: call.request?.body?.text,
        headers: Object.assign(
          {
            "x-okapi-url": TEST_PATH,
            "x-okapi-tenant": TEST_TENANT,
          },
          headers
        ),
      });

      let testData: string | Record<string, any> = await testResponse.text();
      try {
        testData = JSON.parse(testData);
      } catch (e) {}

      const testResponseCode = testResponse.status;

      const equalCode = testResponseCode === correctResponseCode;
      let equalResponse: boolean;
      let diff: Record<string, any> = {};

      if (typeof correctData === "string" && typeof testData === "string") {
        equalResponse = correctData === testData;
        if (!equalResponse) {
          diff.correctLegacy = correctData;
          diff.testNew = testData;
        }
      } else if (
        typeof correctData !== "string" &&
        typeof testData !== "string"
      ) {
        equalResponse = deepEqual(correctData, testData);
        if (!equalResponse) {
          diff = detailedDiff(correctData, testData);
        }
      } else {
        equalResponse = false;
        diff.correctLegacy = correctData;
        diff.testNew = testData;
      }

      if (equalCode && equalResponse) {
        log(chalk.green(`${call.method} ${call.path}`));
      } else {
        log(chalk.bold.red(`${call.method} ${call.path} FAILURE`));
        if (!equalResponse) {
          log(chalk.bold.red("Different response bodies:"));
          log(chalk.red(JSON.stringify(diff, null, 2)));
        }
        if (!equalCode) {
          log(
            chalk.bold.red(
              `Expected (legacy) response code: ${correctResponseCode}`
            )
          );
          log(chalk.bold.red(`Actual response code: ${testResponseCode}`));
        }
        const answer = (
          await prompt.get({
            properties: {
              result: {
                description:
                  "Please classify this result as fail, warn, or pass",
                pattern: /f(ail)?|w(arn)?|p(ass)?/,
                default: "fail",
                message: "Please enter fail, warn, or pass",
                required: true,
              },
            },
          })
        ).result as string;

        if (answer.startsWith("f")) {
          success = false;
          failures.add(currentTest);
        } else if (answer.startsWith("w")) {
          concern.add(currentTest);
        }
      }
    }
  }

  if (concern.size) {
    log(chalk.bgYellow.black.bold("Test warnings:"));
  }
  for (const test of concern) {
    log(chalk.yellow("  " + test));
  }

  if (failures.size) {
    log(chalk.bgRed.white.bold("Test failures:"));
  }
  for (const test of failures) {
    log(chalk.red("  " + test));
  }
}

run();
