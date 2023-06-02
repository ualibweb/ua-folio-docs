# Logging with Log4j2

To log information in Java, we use Log4j2 (as compared to something like `System.out.println()`). To
log something in a class, simply add `@Log4j2` to the top of a class
(`import lombok.extern.log4j.Log4j2;`) then you can use `log.info("something");` anywhere within the
class. To see an example, take a look at
`src/main/java/org/folio/sample/controller/BookController.java`.

## Log levels

There are a number of different logging levels; by default only ones at INFO and above are shown:

- `log.trace` for very detailed information, possibly only useful when debugging
- `log.debug` for debugging information
- `log.info` for general information
- `log.warn` for warnings
- `log.error` for errors
- `log.fatal` for fatal errors

## Interpolation

When logging, **any** object can be passed in, making it really convenient.

To interpolate strings, avoid concatenation, `String.format`, or anything else. All you need are
placeholders `{}`:

```java
log.info("The book {} was created", book);
```

You can add as many parameters of any type as you'd like.

## Exceptions

**To log an exception, a slightly different pattern is needed:**

```java
log.error("Something went wrong", exception);
```

Doing it like this will cause Log4j2 to print out the entire stack trace, rather than the
exception's default string representation (which hides that information).
