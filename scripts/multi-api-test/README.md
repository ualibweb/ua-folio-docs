# multi-api-test

This script takes a JSON export of requests from [Charles](https://charlesproxy.com/) as
`capture.json` (right click in "Sequence", "Export Session" and save as a "JSON Session File
(.chlsj)") and sends API requests to two different running modules, as defined by `CORRECT_PATH` and
`TEST_PATH` in the source code (where `CORRECT_PATH` is the module which returns the "correct"
responses).

Each test compares response text (as JSON, when possible) as well as status codes. If they differ,
the user is prompted if this test should be considered passing (false positive), a warning (if it
needs to be investigated further), or failure. Once all tests are completed, a list of these will be
printed out.

For debugging purposes and to allow more information to be visualized, all requests are proxied
through `localhost:8888`.

A lot of assumptions are made about the environment this script is being ran in: please be aware
that you will likely have to edit the source code to make this work on your machine/module.

Depending on your environment, additional logic may have to be added to the `truncate` function to
ensure that the database is cleaned between every test. The current example is truncating a
RMB-based `test_mod_calendar` schema a relational Spring `diku_mod_calendar` schema.

## Special API Routes

A set of special API routes may be inserted into the Charles session and are used to indicate when a
test begins, ends, and when the database should be truncated. These are as follows:

- `GET /_/tests/_/database-truncate` every time the database is truncated
- `GET /_/tests/class/method` before every test begins
- `GET /_/tests/_/finish` after every test finishes (successful or otherwise)

Please note that the `/_/tests/class/method` will be repeated by the tester to `localhost:80`. This
is on a different port intentionally to differentiate from other requests this script makes to
actually evaluate the module, allowing easy visualization of where each test starts in the proxy
log.

## Demo

[![asciicast](https://asciinema.org/a/ywrS51wPONvpuBwlmP1uDUjpG.svg)](https://asciinema.org/a/ywrS51wPONvpuBwlmP1uDUjpG)

## Known Errors

The script will not exit when finished and must manually be stopped with Ctrl-C.
