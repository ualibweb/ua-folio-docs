# Backend Training – Integration Testing

Now that you've written some API endpoints, its time to start writing some tests! First, we'll focus
on integration tests -- as the name implies, these tests will integrate with external resources (in
our case, API network requests just as we did manually in Insomnia).

All of our test code goes in `src/test` -- if you look in `src/test/java/org/folio/hello/`, you can
see some sample test code. For now, don't worry about the `BaseIntegrationTest`; instead, look at
the `test/HelloTest` class. At its core, an integration test makes a request to API endpoint(s) and
checks that the results/responses are as expected. The function `ra` is provided in the
`BaseIntegrationTest` superclass and creates an instance of `restassured`, the library we use for
API testing.

From here, we say we want a `GET` request (`.get`) to `/hello` (the `getRequestUrl` function, also
provided by `BaseIntegrationTest`, appends the `http://localhost:1234/` as needed).

We can take the response and check its HTTP status code; then, we'll check the actual response.
Since this endpoint only returns a String, this is really simple: we just say
`.getBody().asString()`. Then, we can take this string and run our actual assertion, ensuring that
the response `is` what we expect.

_As a sidebar, `assertThat` and `is` are from a library called Hamcrest. Hamcrest provides a lot of
"matchers" that make tests a lot easier to write and read; for example, you can
`assertThat(someArray, contains(element1, element2, ...))`. There are over
[a hundred of these matchers](https://hamcrest.org/JavaHamcrest/javadoc/1.3/org/hamcrest/Matchers.html),
making it easy to cover nearly any possible assertion._

Now, look at `ExampleSumTest`. Remove the block comment around `testSumQueryEndpoint` and you can
see a more complex use of restassured. Here, our endpoint accepts query parameters; we can easily
provide these before sending the `POST` request. IDE intellisense is wonderful here, since you can
easily see and search what methods are available when preparing the request and parsing the
response.

Also, since this response is more complex, we'll convert the body to a `SumResponse` using
`.getBody().as(SumResponse.class)`. Then, we can use Hamcrest matchers on this just like any other
object.

For this training module, do the following:

1. First, let's make a branch to keep these changes separate:

```sh
git checkout -b your-name-or-username-02-integration
git push origin
```

1. Create integration tests for the GET and POST `sum` endpoints created in the previous module.
   - Use the example tests as a starting point, however, please create a new file/class for your
     tests
   - For the GET endpoint, two tests should be sufficient
   - For the POST endpoint, please be sure to test a variety of cases (empty array, single item,
     multiple items, etc...)
1. Run your tests using the builtin tools in your IDE
   - In VS Code, there should be icons in the gutter by the line numbers that can be clicked to run
     and debug tests
   - Also in VS Code, there is a testing pane (flask icon on the left sidebar). If you don't see it,
     right click in the toolbar and turn it on.
     - This pane can let you easily explore tests and run everything at once
1. Once everything is working, remove the `ExampleSumTest`, commit your changes, and make a pull
   request!
1. While you're waiting on your pull request to be reviewed, let's look at code coverage, a measure
   of how much of the code is tested
1. To evaluate code coverage, we use a tool called JaCoCo. To run it, use Maven (be sure Docker is
   running):
   ```sh
   mvn clean test jacoco:report
   ```
1. Once this is done, you can open `target/site/jacoco/index.html` in your browser. This will show
   all the classes in the project; clicking the names will allow you to drill down and see
   individual methods and, eventually, every line of code. If your tests are good, then all of the
   sum API methods should be fully covered!
