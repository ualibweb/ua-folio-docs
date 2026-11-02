# Karate smoke tests

_Last reviewed: October 2026_

FOLIO runs a suite of Karate tests every night, written in the Gherkin language (based on
Cucumber). These tests combine all modules together with zero mocking (see
[testing](Testing.md) for more information) and are stored in
[folio-integration-tests](https://github.com/folio-org/folio-integration-tests).

At its core, these tests are just API calls, but they are written in a way that is easy to read
(albeit very different from traditional programming languages).

A feature could be as simple as:

```gherkin
Feature: Calendar searching

  Background:
    * url baseUrl
    * callonce login testUser
    * configure headers = { 'Content-Type': 'application/json', 'x-okapi-token': '#(okapitoken)', 'Accept': 'application/json, text/plain' }
    * def servicePointId1 = call uuid1
    * def servicePointId2 = call uuid2

  Scenario: Create a simple calendar with no exceptions
    * def calendarName = 'Sample calendar'
    * def startDate = '2000-08-01';
    * def endDate = '2000-08-31';
    * def assignments = [#(servicePointId1), #(servicePointId2)]
    * def createCalendarRequest = read('samples/createCalendar.json')

    Given path 'calendar/calendars'
    And request createCalendarRequest
    When method POST
    Then status 201
    And def createdCalendarId = $.id
    # should contain all properties sent originally
    And match $ contains deep createCalendarRequest
    And match $.normalHours contains only createCalendarRequest.normalHours
    And match $.exceptions contains only createCalendarRequest.exceptions

    Given path 'calendar/calendars'
    When method GET
    Then status 200
    And match $.calendars[0].id == createdCalendarId
    # should contain all properties sent originally
    And match $.calendars[0] contains deep createCalendarRequest
    And match $.calendars[0].normalHours contains only createCalendarRequest.normalHours
    And match $.calendars[0].exceptions contains only createCalendarRequest.exceptions

    # cleanup
    Given path 'calendar/calendars/' + createdCalendarId
    When method DELETE
    Then status 204
```

The `x-okapi-token` header in this example is still correct on FOLIO's current
[Eureka](Eureka.md) platform; like `x-okapi-tenant`, it kept its original name.

For more information about these tests, how to write them, and most importantly how to run them,
see the [folio-integration-tests repo](https://github.com/folio-org/folio-integration-tests).
FOLIO's nightly runs now target Eureka environments. To run tests yourself, point them at a shared
Eureka environment (see [Eureka → Environments](Eureka.md#environments)), or ask in `#bama` which
environment the team uses. The old Okapi snapshot environments were retired on October 1, 2026,
and local Vagrant boxes are [legacy](../config/Vagrant/README.md).