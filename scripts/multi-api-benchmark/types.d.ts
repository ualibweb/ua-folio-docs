import { Stats } from "fast-stats";
import { Response } from "node-fetch";

/**
 * The main schema for api-benchmark configuration
 */
export interface MainConfiguration {
  configuration: Settings;
  benchmarks: AnyBenchmark[];
}

export type AnyBenchmark = BenchmarkPrimary | BenchmarkInternal;

/**
 * Configuration for an entire api-benchmark run
 */
export interface Settings {
  /**
   * The list of URLs to test against with any special properties
   */
  urls: [TestURL, ...TestURL[]];
  /**
   * Where results should be saved
   */
  outputFilename: string;
  proxy?: string | null;
}
/**
 * Configuration for a single URL to test against to run
 */
export interface TestURL {
  name: string;
  base: string;
  headers?: Record<string, string>;
}
/**
 * Configuration for a benchmark to be ran
 */
export interface BenchmarkPrimary {
  id: string;
  name?: string;
  description?: string;
  init?: (string | Endpoint)[];
  endpoints: (string | Endpoint)[];
  teardown?: (string | Endpoint)[];
  runs: number;
}
/**
 * Configuration for an endpoint to send a request to
 */
export interface Endpoint {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  query?: string | Record<string, string>;
  requestBody?: null | string;
  /**
   * The allowed response code range, rounded to the nearest hundred
   */
  requiredResponseCode?: "100" | "200" | "300" | "400" | "500" | 100 | 200 | 300 | 400 | 500;
}
/**
 * Configuration for a benchmark to be used only (not itself ran)
 */
export interface BenchmarkInternal {
  id: string;
  name?: string;
  description?: string;
  init?: (string | Endpoint)[];
  teardown?: (string | Endpoint)[];
  internal: true;
}

export interface BenchmarkResult {
  id: string;
  name: string;
  description: string;
  runs: number;
  results: Stats;
}

export interface TimedResponse {
  response: Response;
  timeMs: number;
}
