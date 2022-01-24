# `mod-calendar` API Changes Introduced with v2.0.0

- [`mod-calendar` API Changes Introduced with v2.0.0](#mod-calendar-api-changes-introduced-with-v200)
  - [(Breaking) Change Summary](#breaking-change-summary)
  - [Error Responses](#error-responses)
    - [Error Codes](#error-codes)
    - [HTTP Error Codes](#http-error-codes)
    - [Error Schema](#error-schema)
  - [Service Point Validation](#service-point-validation)
  - [`GET /calendar/periods`](#get-calendarperiods)
    - [Incorrect Legacy Behavior Trimming at Boundaries](#incorrect-legacy-behavior-trimming-at-boundaries)
    - [Legacy not Deduplicating Times Opened by Multiple Calendars](#legacy-not-deduplicating-times-opened-by-multiple-calendars)
  - [`POST /calendar/periods/{servicePointId}/period`](#post-calendarperiodsservicepointidperiod)
    - [ID Validation](#id-validation)
    - [Name Validation](#name-validation)
    - [Date Validation](#date-validation)
  - [`GET /calendar/periods/{servicePointId}/period/{periodId}`](#get-calendarperiodsservicepointidperiodperiodid)
  - [`PUT /calendar/periods/{servicePointId}/period/{periodId}`](#put-calendarperiodsservicepointidperiodperiodid)
  - [`DELETE /calendar/periods/{servicePointId}/period/{periodId}`](#delete-calendarperiodsservicepointidperiodperiodid)

## (Breaking) Change Summary

These are the most significant changes to the API:

- The `servicePointId` provided in each route's path is now actually verified
  [ref](#service-point-validation)
- Error responses no longer always return `422` and `intervalsOverlap`
  [ref](#error-responses)
- `/calendar/periods` now returns more predictable and consistent output
  [ref](#get-calendarperiods)

For a full changelog and information about each of these, please continue
reading.

## Error Responses

As a whole, error responses have changed with the new `mod-calendar`.

### Error Codes

Previously, every error returned had a response code of `intervalsOverlap`
which, in many cases, was completely unrelated to the actual error, causing many
errors to be presented in the UI improperly.

For example, trying to get information about a period that does not exist:

```jsonc
// GET /calendar/periods/22222222-2222-2222-2222-222222222222/period/22222222-2222-2222-2222-222222222222
{
  "errors": [
    {
      "message": "Openings with id '22222222-2222-2222-2222-222222222222' is not found",
      "code": "intervalsOverlap",
      "parameters": []
    }
  ]
}
```

The new API has a selection of error codes which it employs depending on the
type of error:

- `internalServerError`: Catch-all for any other unhandled exceptions
- `invalidRequest`: Catch-all for unparsable requests (bad JSON, etc)
- `invalidParameter`: Catch-all for missing or wrongly-typed parameters
- `noName`: The request did not include a name (or used an empty name) for the
  object
- `settings.error.invalidDateRange`: The start date was after the end date
- `duplication`: The new calendar would overlap with another calendar for this
  service point! Please change the dates or add an exception.
- `notFound`: No calendar/period was found with this ID

Although these error codes look strange, they attempt to reuse the same error
message codes used in the `ui-calendar` translation files, making it easy to
implement localization.

### HTTP Error Codes

Previously, the HTTP code sent with anticipated errors was `422`. This is meant
to be used
[only for WebDAV servers](https://datatracker.ietf.org/doc/html/rfc4918#section-11.2),
not a standard REST API. Furthermore, when it is used in WebDAV, it means that
the request was internally inconsistent, rather than actually causing an error.
This implies that this request will never be valid, which is not the case with
many of these situations (as they depends on previously existing calendars).

The new API makes use of a range of standard HTTP codes, including but not
limited to:

- `400 Bad Request` for data that is invalid or not parsable, such as malformed
  UUIDs
- `404 Not Found` for when a requested calendar could not be found or an
  endpoint does not exist
- `405 Method Not Allowed` for when an endpoint is found, however, the given
  method (GET/POST/etc) is not supported
- `409 Conflict` for when a change (POST/PUT/etc) conflicts with existing
  calendars
- `500 Internal Server Error` for when an unknown error occurs (this can
  occasionally occur with totally invalid data that throws errors deep inside
  Spring)

Please see more information about my effort to support a wider range of error
codes and messages in https://github.com/folio-org/ui-calendar/pull/368

### Error Schema

The legacy API would sometimes return text and HTML responses, both on invalid
and valid API endpoints. Now, all errors, regardless of their source or
severity, are returned in the standard FOLIO format.

The standard FOLIO error format offers `message`, `type`, `code`, and
`parameters` as valid properties for each returned error object. The legacy API
made no use of `type`, therefore, we will not either -- this seems fairly
redundant with `code`.

The old `mod-calendar` returns `parameters`, however, it is always an empty
array. The new API adds a `_parameters` key and attempts to fill in relevant
parameters on a best-effort basis. This is not always possible, therefore, this
is prefixed with `_` to attempt to discourage any developers to rely on it.

Similarly, we provide a `_trace` property which includes a full stack trace of
where the error occurred. Although this information may appear sensitive
(including file names and line numbers of source code), since this project is
open source, anyone could easily find this information themselves, so this adds
no risk.

Finally, the new API adds `timestamp` and `status` (the HTTP status) to the
outer object, allowing developers to see more information about any error(s) in
their logs.

## Service Point Validation

The previous API would not check the service point in the URL, completely
ignoring it. The new API verifies that this is correct and, if it is not,
returns a 404 (as no period was found with the period and service point
specified).

For example, if there exists a calendar ID
`dddddddd-dddd-dddd-dddd-dddddddddddd` on service point
`00000000-0000-0000-0000-000000000000`, a request to
`DELETE /calendar/periods/99999999-9999-9999-9999-999999999999/period/dddddddd-dddd-dddd-dddd-dddddddddddd`
would have previously succeeded, despite it being semantically incorrect.

We would like to eventually check that the provided service point ID
actually is a service point, however, at this point in time, nothing more
than a UUID check is performed.  Future scope of this may relate to
permissions/calling service point APIs; see
https://github.com/ualibweb/mod-calendar/issues/19.

## `GET /calendar/periods`

**This endpoint is the only one with changes that should affect current FOLIO
modules.**

### Incorrect Legacy Behavior Trimming at Boundaries

With the new API, data is returned for every day in the calendar, regardless of
if it is open. Previously, only dates from the first opening through the last
opening were returned.

For example, if a calendar went from `2021-05-01` to `2021-05-07` but only had
openings on `2021-05-02` and `2021-05-06`, the legacy API would only return
information for dates `2021-05-02` through `2021-05-06`. The new API covers the
entire range. In reality, this is not a significant change as most, if not all,
calls to this endpoint use `startDate` and/or `endDate` parameters which
override this behavior.

### Legacy not Deduplicating Times Opened by Multiple Calendars

Previously, if multiple calendars caused openings along the same time range,
they would all be returned. The new API does not intelligently consolidate,
however, does remove exact duplicates. This is important since this information
may be used in `mod-circulation` to calculate the amount of fines to be charged
to a patron; therefore, three service points sharing a calendar could result in
triple the charges to a patron.

## `POST /calendar/periods/{servicePointId}/period`

This endpoint was affected by the lack of
[service point validation](#service-point-validation).

### ID Validation

When creating a new calendar, the legacy endpoint would not check if the
provided `id` already existed. If the `id` did exist, an internal server error
would be thrown, however, the error message is an unreadable JSON blob straight
from the database, making it difficult to determine the error. It also suffers
from all of the aforementioned error issues.

### Name Validation

Calendars with empty names should not be permitted. If an attempt is made to
create a calendar with an empty name (`""`), the legacy endpoint would return a
plaintext error `Not valid json object. Missing field(s)...`. This has been
replaced with a proper error.

Calendars with only-whitespace names should not be allowed either (for example,
one consisting solely of spaces). The legacy API provided no validation for this
case.

### Date Validation

Previously, no validation was done to ensure that the provided dates made sense
(for example, the calendar should not start on `2021-12-31` and end on
`2021-12-01`).

## `GET /calendar/periods/{servicePointId}/period/{periodId}`

This endpoint was affected by the lack of
[service point validation](#service-point-validation).

## `PUT /calendar/periods/{servicePointId}/period/{periodId}`

This endpoint was affected by the lack of
[service point validation](#service-point-validation). This was fixed by
ensuring `servicePointId` matches the service point provided in the **new**
period. This should not affect any current usage of the API since there is no
support to change the service point of a created calendar.

Additionally, against
[HTTP standards](https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.4),
the legacy API did not support creating new calendars through this endpoint.
This behavior was retained, however, deserved mentioning here. Documentation
relating to this endpoint now specifically states that it cannot be used in this
way.

Finally, the legacy endpoint did not allow updating the `id` of a period, also
against the HTTP standard. Instead of changing it or returning an error, this
endpoint would have changed everything _except_ the `id`, ignoring that
property. The new endpoint supports changing the `id` as would be expected by a
`PUT` endpoint, however, will throw an error if the `id` is already in use.

## `DELETE /calendar/periods/{servicePointId}/period/{periodId}`

This endpoint was affected by the lack of
[service point validation](#service-point-validation).
