# multi-api-benchmark

This tool is a simple utility to benchmark API routes across multiple servers
(although it would work just as well for one). All of its parameters are passed
in through a configuration file, written either in JSON or YAML.

Please note that all examples here are written in YAML, however, the equivalent
JSON will work the same.

- [multi-api-benchmark](#multi-api-benchmark)
  - [Basic Usage](#basic-usage)
  - [Basic Example](#basic-example)
  - [Full Schema](#full-schema)
    - [`configuration`](#configuration)
    - [`benchmarks`](#benchmarks)
    - [`endpoints`](#endpoints)
  - [Interpreting Results](#interpreting-results)
  - [Advanced Example](#advanced-example)
  - [Development Install](#development-install)
  - [Debugging](#debugging)

## Basic Usage

Once you install [`npm`](https://npmjs.com/), you can do the following to run
with a YAML or JSON configuration file:

```sh
npx multi-api-benchmark yaml configuration.yaml # for YAML
npx multi-api-benchmark json configuration.json # for JSON
```

## Basic Example

The simplest configuration is something like this:

```yaml
configuration:
  urls:
    - name: Server
      base: http://localhost:8080
  outputFilename: results.csv
benchmarks:
  - id: getTest
    endpoints:
      - method: GET
        path: /my/route
    runs: 25
```

This defines a single server/URL to run endpoints against. With multiple of
these, `multi-api-test` will test each and benchmark them, making comparison
easy. These can be different ports on one machine, remote servers, different
paths on the same port, or anything that makes sense for your application.
Please note that it is recommended to run all server(s) on your local machine
with as similar an environment as possible to reduce any additional variables --
similarly, testing a production environment is almost guaranteed to give bad
data with the number of extra variables.

`result.csv` is where the resulting data will be stored; see
[Interpreting Results](#interpreting-results) for more information.

For `benchmarks`, a series of objects configure what benchmarks should be run.
At it's simplest, this just needs an `id`, list of `endpoints` (which can just
be a `method` and `path`) and the number of times to run the benchmark.

## Full Schema

The schema, written as JSON Schema, may be found in `schema/base.json`. To
dereference it, you may use `npm run dump-schema` which will print out a fully
dereferenced schema.

If you are experiencing issues with your configuration not validating, try
running it through a
[validator](https://www.jsonschemavalidator.net/s/gAG5axIw).

The configuration file consists of two main parts, the `configuration` object
and `benchmarks` list.

### `configuration`

The `configuration` object, as defined in `schema/configuration.json`, has the
following properties:

- `outputFilename` is where the resulting CSV will be saved (will be treated
  relative to the CWD)
- `proxy` (optional) is a proxy to route all requests through, such as
  `http://localhost:8888`. This can be useful for debugging requests/failures
  that seem to occur from API calls

### `benchmarks`

There are two types of benchmarks: regular (sometimes called primary) benchmarks
and internal benchmarks, defined in `schema/benchmark.json` and
`schema/benchmark-internal.json` respectively. The `benchmarks` property takes
any number of either of these, in any order.

The main difference between these is that primary benchmarks are intended to run
multiple `endpoints` multiple times whereas internal ones are only for code
reuse, allowing common operations (such as creation/deletion of objects) to only
be coded once.

Here are the properties of each benchmark:

- `id` is a unique ID for each benchmark. It is recommended to use camel case
  with no hyphens or spaces
- `name` (optional) is a name displayed in the output to better describe what a
  given endpoint does
- `description` (optional) is the same purpose as the above
- `init` (optional) is a list of either internal benchmark's IDs or an
  endpoints, as defined [here](#endpoints). These will be ran before the
  benchmark begins
- `endpoints` (required, primary benchmarks only) is a list of either internal
  benchmark's IDs or endpoints, as defined [here](#endpoints). These will be ran
  in order the specified number of `runs`.
- `teardown` (optional) is a list of either internal benchmark's IDs or an
  endpoints, as defined [here](#endpoints). These will be ran after the
  benchmark finishes
- `internal` must be `true` for internal benchmarks and omitted for primary
  ones.
- `runs` is for primary benchmarks only and specifies the number of times the
  benchmark will be ran. Higher values take longer but provide better results.

### `endpoints`

These are defined in `schema/endpoint.json` and define a single endpoint to
test. Here are all the options:

- `method` is the HTTP verb, one of `GET` `POST` `PUT` `DELETE`
- `path` is a string defining the API route (when appended to the URLs provided
  in `configuration`)
- `query` is optionally the query string. It can either be a string (such as
  `foo=bar&baz=test`) with no question mark or an object with key-value pairs
  (that will be made into a query string). Note that the latter does not support
  parameter repetition (such as `foo=param1&foo=param2`).
- `requestBody` is optionally the filename of a JSON body to attach. This will
  be loaded from a folder named `bodies` in the current directory (it is not
  possible to specify the body directly in the configuration). Also, this will
  send a content type of `application/json`.
- `requiredResponseCode` will optionally validate the response code returned, to
  the nearest hundred. This accepts strings and integers 100, 200, 300, 400,
  and 500.

## Interpreting Results

The resulting CSV contains a _lot_ of information -- this script operates on the
philosophy that more is better and that you, the user, should be the one to
distill it to what you need.

Each endpoint benchmarked (or otherwise used) will have a dedicated row. If one
benchmark refers to another, the dependent ID will be prefixed to the
dependency's within the results, allowing isolation each call of common
endpoints. Prefixes are also added for `init` and `teardown` endpoints.

For example, if a `testGet` benchmark has `init: [createEnv]` and
`endpoints: [doGet]`, IDs `testGet`, `testGet-init`, `testGet-init-createEnv`,
and `testGet-doGet` will appear (with the ones not referring to a specific
endpoint being aggregates).

This row will contain the ID (as calculated above), name, description, and
number of times this endpoint was ran (per URL/server). Endpoints used for
`init` and `teardown` will always have `Runs` of 1.

For each base URL/server provided and each endpoint benchmarked/used, the
following is generated (all in milliseconds):

- `Mean`, the arithmetic mean (average) of all runs
- `Median`, the middle element of all runs, which may be a better result with
  outliers
- `Min` and `Max`, the quickest and slowest responses measured
- `Standard Deviation` (when runs > 1), the sample standard deviation, showing
  how far each measurement was from the mean
- `95% CI Lower` and `95% CI Upper`, the bounds of a 95%
  [confidence interval](https://en.wikipedia.org/wiki/Confidence_interval) for
  the true mean, typically used for error bars. **These, with the mean, are the
  recommended data points to use for any analysis**.

In most cases, the majority of rows will not be interesting/significant,
however, are left in for the sake of increased information.

## Advanced Example

An in-depth example with many endpoints, self-referencing endpoints, internal
endpoints, proxy, and much more, can be found
[here](https://github.com/ualibweb/ua-folio-docs/blob/68f7a7e0abff7d8ea0cf3f29c1de55678396ec4f/docs/mod-calendar-2.0-changes/benchmarks/calendar.yaml).

## Development Install

If you want to run/work on the code locally, use these instructions.

After cloning or downloading the code, be sure to run the following to install
all dependencies:

```sh
npm install
```

Then, with this, you can use one of the following to run with a YAML or JSON
configuration file:

```sh
npm run start yaml configuration.yaml # for YAML
npm run start json configuration.json # for JSON
```

Note that these files are relative to your current directory. If the code is in
a different directory from your configuration, `cd` to the configuration and use
`--prefix` to point to the root of this project. For example:

```sh
npm --prefix ../multi-api-test run start yaml configuration.json
```

## Debugging

If something is not working right, you can enable debug logging through the
`DEBUG` environment variable. If the error is within this tool, set `DEBUG` to
`multi-api-benchmark:*`.

This can be done with:

```sh
export DEBUG=multi-api-benchmark:*     # Mac/Linux
${env:DEBUG}='multi-api-benchmark:*'   # Windows PowerShell
```

Note that this will set the variable for the remainder of the current terminal
session -- you must reopen your terminal or set it to an empty string (`""`) to
undo this.

If it seems like this issue is within your own API, add a `proxy` to the
configuration. If you have not used a proxy before, https://www.inproxy.io/ is a
nice (and free!) choice.
