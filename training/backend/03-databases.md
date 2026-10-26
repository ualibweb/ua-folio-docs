# Backend Training — Databases

_Last reviewed: October 2026_

## Objective

After completing this section, you should:

- be able to alter database schemas using Liquibase
- be able to use Spring repositories to interact with the database
- be able to use MapStruct to convert between database entities and DTO objects

## Goals

Add an "available" boolean to the Book entity that works with all previous endpoints and a new
`GET /books/available`

## Deliverables

- A liquibase changeset to add a new column
- A new field in the Book entity
- A new field in the API schema for availability
- A mapping in `BookMapper`
- A new endpoint in `BookController`
- Sufficient tests, per the last section.

## Introduction

Managing databases over time can be a real pain, since we want to ensure deployments are smooth and
that database changes are carefully controlled. Without a tool to manage this, it is easy to end up
with a database that is out of sync, or worse, one that is destroyed due to a poor deployment. To
avoid requiring sysadmins to manually run SQL scripts on updates, we use a tool called Liquibase to
manage our database schema.

Liquibase works by defining a set of changes over time, ensuring that each "changeSet" is run
sequentially with no other changes. This ensures the database can be upgraded between any two
versions without headache. For a real-world example, see the ones
[defined for mod-calendar](https://github.com/folio-org/mod-calendar/tree/72d312d5fe5d06c2109b819e65b0fb031860df9c/src/main/resources/db/changes):
here, there are a lot of changesets for the initial schema then, as we developed, we had to add
names to the exceptions table (0030), change null constraints (0040), and more — liquibase allowed
us to manage all this with ease.

## Steps

1. First, create a branch for this lesson (see [Git workflow](../02-git-workflow.md)):

   ```sh
   git switch <username>-base
   git pull
   git switch -c <username>-03-databases
   git push -u origin <username>-03-databases
   ```

1. Take a look in `src/main/resources/db`; this is where our Liquibase changelogs are stored.
   `changelog-master.yaml` uses `includeAll` to run every file in the `changes` folder, in
   alphabetical order, which is why the files are numbered. There is only one so far,
   `changes/0000-create-book-table.yaml`, which defines the initial `books` table. However, as we
   develop, requirements and our understandings change and we need to update this database.
   Suppose we now need to add a column for if the book is available or not. To do this, we can
   define a new changeset in the `changes` folder (such as `0010-add-available-column.yaml`) with
   an
   [addColumn change](https://docs.liquibase.com/community/reference-guide-5-0/change-types/addcolumn),
   type `boolean`, and `defaultValueBoolean` `true` (for any books that may already be in the
   database). Thanks to `includeAll`, you don't need to register the new file anywhere else.

1. To re-run Liquibase, we need to simulate the module being installed for a tenant (normally the
   platform does this; see [Eureka](../../docs/Eureka.md)). Send this request while the module is
   running:

   ```sh
   curl --request POST \
     --url http://localhost:8081/_/tenant \
     --header 'x-okapi-tenant: diku' \
     --header 'Content-Type: application/json' \
     --data '{"module_to":"mod-training-sample"}'
   ```

   You should see some log messages in the console about the changeset being evaluated and the
   column being added.

1. Now, let's make Java aware of this column. Edit
   `src/main/java/org/folio/sample/domain/entity/Book.java` and add the new `boolean` field
   `available`. We will also want to include this in our API responses, so let's add a required
   property `isAvailable` to `src/main/resources/api/schemas/bookForCreation.yaml`. Note that _this
   should be a different name_ than the field in the entity, for demonstration purposes.

1. Now that the API schema has been modified, run `mvn generate-sources` to generate the new
   `BookDTO` and `BookForCreationDTO` classes.

1. Lastly, Java needs to know how to map `isAvailable` (DTO) and `available` (database entity). This
   is done through the MapStruct library, with the `BookMapper` class (in
   `src/main/java/org/folio/sample/domain/mapper`). You will need to add `@Mapping` annotations for
   each method here; MapStruct will take those annotations and generate the appropriate code.

   <details>
   <summary>Hint</summary>

   ```java
   @Mapping(source="isAvailable", target="available") // for fromDTO
   @Mapping(source="available", target="isAvailable") // for toDTO
   ```

   </details>

1. Now that all our types are defined, let's add a new endpoint to `api.yaml` to get all available
   books. This will be a `GET` request to `/books/available` and will return a list of `Book`
   objects, similar to the main `GET /books`. You will need to add a new method to the controller,
   however, don't implement the service layer yet.

1. To find books published in leap years, the logic was a bit complex, so in `BookService` we pulled
   _all_ books, then evaluated each one on the Java side. That is fine for small sets of data,
   however, it can be pretty inefficient. To make this much faster, we want to leverage the database
   (improving speed and eliminating the need to load all the objects into Java's memory).

1. Open up `src/main/java/org/folio/sample/repository/BookRepository.java`. This is a JPA (Java
   Persistence API) that Spring does its magic on, allowing us to easily interact with the database
   in an abstract way. Just with the one line in there, Spring is able to provide
   [a ton of methods](https://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html),
   such as `findAll`, `findBy`, `delete`, `save`, and anything else we need for most simple CRUD
   operations. For more complex queries, we can use the `@Query` annotation to define a custom query
   in JPQL (the Jakarta Persistence Query Language, formerly Java Persistence Query Language). JPQL
   looks like SQL but uses Java class and field names instead of table and column names.

1. Add a new method `findAllAvailable()` which returns a `List<Book>`. This method should use the
   `@Query` annotation to define a custom query that returns all books where `available` is `true`.

   <details>
   <summary>Hint</summary>

   ```java
    @Query("SELECT b FROM Book b WHERE b.available = true")
    List<Book> findAllAvailable();
   ```

   </details>

1. Now that you have this repository method, you can create a service method that just returns its
   results, allowing you to finish implementing this endpoint:

   ```java
   public List<Book> findAllAvailable() {
     return bookRepository.findAllAvailable();
   }
   ```

1. Add some tests for your endpoint, update the old tests (PUT/GET/etc) to expect this new property
   and, once you've reached 100% coverage, open a pull request against your `<username>-base` branch
   and request a review.

1. After a successful review and PR merge, that's it for the main Spring training. Congratulations!
   For supplemental topics, see [Lombok](../../docs/Lombok.md), [logging](../../docs/Log4j.md),
   [API documentation](../../docs/api-doc.md), and [Karate tests](../../docs/Karate.md).
