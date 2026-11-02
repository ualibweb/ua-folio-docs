# Lombok (aka, magic)

_Last reviewed: October 2026_

Lombok is a really cool Java library that generates a lot of the boilerplate code that people
typically associate with Java. Gone are the days of writing dozens of getters, setters, etc; it's
now as simple as `@Getter` or `@Data`.

> **Java 21 needs Lombok 1.18.30 or later.** Older versions fail to compile with a confusing error
> like `java.lang.NoSuchFieldError: Class com.sun.tools.javac.tree.JCTree$JCImport does not have
> member field 'com.sun.tools.javac.tree.JCTree qualid'`. If you see that, update the Lombok
> version in the project's `pom.xml` (`folio-training-backend` uses 1.18.34).

## Features we use a lot

- `@Log4j2` on a class adds a `log` object (see [Logging with Log4j2](Log4j.md))
- `@Getter`/`@Setter` on a field adds a getter/setter
- `@Getter`/`@Setter` on a class adds getters/setters for all fields
- `@With` adds a "wither", which is like a setter but it creates a new instance (does not change the
  original)
- `@Data` on a class adds getters/setters, `equals`, `hashCode`, and `toString`
- `@Builder` on a class adds a builder (easy pattern to create an object)
- `@ToString` adds a nice String representation of the object
- `@EqualsAndHashCode` adds `equals` and `hashCode` methods
- `@NoArgsConstructor` adds a constructor with no arguments
- `@AllArgsConstructor` adds a constructor with all arguments
- `@RequiredArgsConstructor` adds a constructor with all `final` arguments
- `@UtilityClass` on a class makes it a utility class (all static methods, private constructor)

## What does it do behind the scenes?

It sits before the compiler, generating code based on `@Annotations`. To see an example of what it
does, clone [folio-training-backend](https://github.com/ualibweb/folio-training-backend) and run:

```sh
mvn prepare-package -DskipTests
```

Then, take a look at `target/generated-sources/delombok/org/folio/sample/domain/entity/Book.java`;
here we can see the "delomboked" version of the file. Almost two hundred lines of boilerplate code
generated for us from only these four annotations:

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
```

## Lombok in VS Code

VS Code needs Lombok support to understand the generated code; it's included with the
**Extension Pack for Java** (or the separate **Lombok Annotations Support** extension, see the
[VS Code setup guide](../config/VSCode/README.md)). Without it, VS Code may show red errors on code
that uses Lombok, even though Maven builds it fine.