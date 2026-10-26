# Backend Training — OpenAPI

_Last reviewed: October 2026_

## Objective

After completing this section, you should be comfortable creating API endpoints in the OpenAPI
specification and using them in the resulting Java Spring controller.

## Goal

Add a PUT endpoint to the application to allow overwriting a book's current data.

## Deliverables

- A pull request containing an implementation of a PUT endpoint which accepts a book's data and
  updates it in the database.
- The following manual test case should work:

  ```sh
  curl --request POST \
     --url http://localhost:8081/books \
     --header 'x-okapi-tenant: diku' \
     --header 'Content-Type: application/json' \
     --data '{"name":"My cool book", "publishedDate":"2000-01-01"}'
  # Take the ID from that and use it in place of %%%%%%%%% in the following:

  curl --request PUT \
     --url http://localhost:8081/books/%%%%%%%%% \
     --header 'x-okapi-tenant: diku' \
     --header 'Content-Type: application/json' \
     --data '{"name":"My cooler book", "publishedDate":"2001-02-03"}'

  curl --request GET \
     --url http://localhost:8081/books/%%%%%%%%% \
     --header 'x-okapi-tenant: diku'
  # should return {"id": "%%%%%%%%%", "name": "My cooler book", "publishedDate": "2001-02-03"}

  curl -I --request PUT \
     --url http://localhost:8081/books/d193dfd5-9d74-5748-88ba-73fdc6914ebc \
     --header 'x-okapi-tenant: diku' \
     --header 'Content-Type: application/json' \
     --data '{"name":"My cooler book", "publishedDate":"2001-02-03"}'
  # should start with "HTTP/1.1 404 Not Found"
  ```

  On Windows, run these in Git Bash or a REST client. PowerShell's `curl` is a different command,
  and the `\` line continuations don't work there.

## Introduction

This section will focus on OpenAPI, the system used to define the APIs implemented and used by our
modules. OpenAPI is the current industry standard, and is very extensible; for the full
specification, please use [this link](https://spec.openapis.org/oas/latest.html).

> _Note: OpenAPI used to be called Swagger, before version 3. If you see Swagger mentioned in
> conversations/searches about OpenAPI, they are interchangeable and refer to the same thing._

At its core, OpenAPI is a simple way of declaring paths (e.g. `/hello`, `/entity/{id}`, etc.), their
methods (GET, POST, PUT, DELETE, etc), and the requests/responses applicable for each.

For example, let's look at part of the
["Swagger Petstore" API schema](https://github.com/swagger-api/swagger-petstore/blob/568715cb2f69a001808ea32a2489011214b51959/src/main/resources/openapi.yaml#L35-L65).
This declares an endpoint `POST /pet` to "Add a new pet to the store." Looking at the `requestBody`,
we see a JSON payload of a "Pet" is accepted; under responses we see successful operations will
return a Pet and 200 status code, while invalid inputs will return a 405. One of the most powerful
features of OpenAPI is the ability to reference other schemas, such as the Pet schema mentioned
earlier -- its
[implementation](https://github.com/swagger-api/swagger-petstore/blob/568715cb2f69a001808ea32a2489011214b51959/src/main/resources/openapi.yaml#L736-L776)
is a simple JSON schema. The API can be easily visualized in
[this documentation](https://petstore3.swagger.io/).

> Note: For an introduction to JSON schema, see
> [this guide](https://json-schema.org/learn/getting-started-step-by-step). We typically
> write our schemas in YAML for readability, but everything else is the same.
>
> Also, although it is possible to combine all schemas and endpoints into one giant file, we prefer
> to split it across multiple files. The same `$ref` property can be used with filenames instead of
> local references. For an example of splitting up schemas and paths, see
> https://github.com/folio-org/mod-calendar/tree/d32a5431bc3a63a8f6c70e10aa1db557a8485147/src/main/resources/api.

This reusability makes it really easy to share data types and, as an added bonus, the components and
endpoints are automatically turned into Java code!

Now, for the actual coding portion of this lesson:

## Steps

1. First, create a branch for this lesson (see [Git workflow](../02-git-workflow.md)):

   ```sh
   git switch <username>-base
   git pull
   git switch -c <username>-01-openapi
   git push -u origin <username>-01-openapi
   ```

1. Now, run `mvn generate-sources`. This will run the generator on the API schema.
1. Open up `src/main/resources/api/api.yaml` and look at the contents. This is the OpenAPI
   specification for our sample module. It defines a few different paths: `/books` has the `GET` and
   `POST` methods while `/books/{bookId}` has `GET` only.
1. Look in `target/generated-sources/api/src/main/java/org/folio/sample`. Here, you can see the code
   generated from the OpenAPI.
   - The `rest/resource` folder contains the endpoint information, in an interface called
     `BooksApi` -- don't worry about the specific code in here, only the method signatures are
     important.
   - We can see three real methods in here, buried under all the annotations (and named based off
     the `operationId`s in `api.yaml`):
     - `ResponseEntity<List<BookDTO>> getAllBooks(Boolean onlyLeapYears)`
     - `ResponseEntity<BookDTO> createBook(BookForCreationDTO book)`
     - `ResponseEntity<BookDTO> getBook(UUID bookId)`
   - In `domain/dto`, we can see the actual API components; in this case, two exist, corresponding
     to the JSON schemas in `src/main/resources/api/schemas` (`book.yaml` and
     `bookForCreation.yaml`).
     - Objects from the API are called DTOs (Data Transfer Objects) and are kept separate from the
       "proper" entities within the application, to prevent any malicious user input from affecting
       the application. To convert between the two, use the `BookMapper` as shown in the
       `BookController` class.
1. Now, based on the POST `/books` and GET `/books/{bookId}` paths, let's create a PUT
   `/books/{bookId}` endpoint. This should take a `bookForCreation.yaml` object as the request body and
   overwrite the book specified by `bookId` with the provided contents. The response should be the
   updated book with a 200. If no book exists with the given ID, respond with a 404.

   <details>
      <summary>Hint 1</summary>

   You will need a `requestBody` and `parameters` for the path.

   </details>

1. Now, run `mvn clean generate-sources` to regenerate the code. You should see a new method in
   `BooksApi`: `ResponseEntity<BookDTO> updateBook(UUID bookId, BookForCreationDTO bookForCreation)`
   (the names depend on the `operationId` you chose).
1. Create a matching method in `BookController` that implements this endpoint. You will also need to
   add an implementation in the service.
   <details>
   <summary>Hint 1</summary>

   First, get the book from the database, throwing a not found exception if it is not there (using
   `Optional`'s `orElseThrow`, the same way `getBook` in `BookController` throws FOLIO's
   `NotFoundException`, which becomes a 404 response).
   </details>

   <details>
   <summary>Hint 2</summary>

   Once you have the current book, copy the name and published date from the one provided from the
   API.
   </details>

   <details>
   <summary>Hint 3</summary>

   Save the resulting book (the same way `createBook` does).
   </details>

1. Test that everything works with curl or your preferred REST client.
1. Once everything is to your satisfaction, commit and push your changes. Open a pull request from
   this branch into your `<username>-base` branch and request a review.
1. Optionally, complete [docs/api-doc](../../docs/api-doc.md) to see how we create documentation for
   the API.
1. After a successful review and PR merge, move onto the next section: [02-testing](02-testing.md).
