import chalk from "chalk";
import createProxyAgent from "https-proxy-agent";
import fetch from "node-fetch";
import prompt from "prompt";

const log = console.log;

const CORRECT_PATH = "http://localhost:9198";
const CORRECT_TENANT = "test";
const TEST_PATH = "http://localhost:9198";
const TEST_TENANT = "diku";

prompt.start();

const proxy = createProxyAgent("http://localhost:8888");

async function run(): Promise<void> {}

run();
