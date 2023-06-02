# Backend Training – Testing

## Objective

After completing this section, you should:

- understand the importance of testing
- understand the difference between unit and integration testing
- understand what coverage is
- be able to write unit tests in JUnit with Hamcrest
- be able to write parameterized unit tests
- be able to achieve good coverage (80%+) on unit tests
- be able to write integration tests in JUnit with RestAssured/Hamcrest
- be able to achieve good coverage (80%+) in integration tests

## Goal

Write quality tests for our application.

## Deliverables

- A pull request containing unit and integration tests for all code thus far. Minimum 80% coverage,
  preferably 100%.

## Introduction

This section will focus on testing; please read the [testing](../../docs/Testing.md) document before
starting for important context.

## Steps

1. First, let's make a branch to keep these changes separate:

   ```sh
   git checkout -b your-name-or-username-02-testing
   git push origin
   ```

1. Now, let's take a look at the provided tests; these should provide a good starting point.

1. Looking at the unit tests in `src/test/java/org/folio/sample/unit/domain/entity/BookTest.java`,
   we can see some basic tests for the `isPublishedInLeapYear`. This file consists of two tests,
   each of which begin by creating a `Book` object to test before asserting the result of
   `isPublishedInLeapYear`. The use of `assertThat`, `is`, `equalTo`, and others are part of a
   library called Hamcrest: Hamcrest provides a set of matchers that can be used to make assertions
   in tests much more readable and easier to use. For example, `assertThat(someArray, hasSize(2));`
   is more readable than `assertEquals(2, someArray.size());`. For more information on the dozens of
   Hamcrest matchers, see
   [this page](https://hamcrest.org/JavaHamcrest/javadoc/1.3/org/hamcrest/Matchers.html).

1. Looking at the original `isPublishedInLeapYear`, we can see that these tests do not cover all
   possible conditions. To see exactly what was missed and what our current coverage status is, run:

   ```sh
   mvn clean test jacoco:report
   ```

   Then, open `target/site/jacoco/index.html` in your browser. This will show you the coverage;
   clicking in `org.folio.sample.domain.entity` will show the coverage for `Book`. Two conditions
   are missing; add tests to cover these.

1. Once you have tests that achieve 100% coverage on `Book`, you may notice that running tests like
   this can become a bit repetitive (a lot of code to create a book when the only thing changing is
   the date). Try creating a parameterized test using `@MethodSource` such that only one call to
   `Book.builder()` is needed; for a guide, see
   [this article](https://www.arhohuttunen.com/junit-5-parameterized-tests/#multiple-parameters-with-methodsource)
   (only the part for `@MethodSource` is relevant).

1. Now that we've completed our unit tests, lets write integration tests for the controller (and
   therefore the service) code. Take a look at
   `src/test/java/org/folio/sample/integration/api/books/GetSingleBookTest.java` and try to create
   similar tests for all the remaining conditions/lines in the controller and service.

   - The `ra()` method and requests/parameters/response methods are part of a library called
     RestAssured; this allows easy testing of REST-based APIs. For more information, see the
     https://rest-assured.io/.
   - Create an amount of tests that you feel is sufficient; there is no need to go all out here; for
     example, we have already written tests for the `isPublishedInLeapYear` method, so when we're
     testing `getAllBooksPublishedInLeapYears`, we don't need to write tests for every possible leap
     year scenario; we can just assume that `isPublishedInLeapYear` works as expected and only test
     the controller/service code.

1. To run only one test at a time, you can run `mvn test jacoco:report -Dtest=YourTestClassHere`. If
   you want to debug tests, or just run them easier, there is a "Testing" pane on the left side of
   VS Code (you may need to right click the sidebar to enable the view). Please note, although the
   IDE method allows interactive debugging, it can not compute coverage.

1. Once you've reached 100% coverage, create a pull request and request a review on it.

1. After a successful review and PR merge, move onto the next section:
   [03-databases](03-databases.md).
