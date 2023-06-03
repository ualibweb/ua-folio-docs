# Software Testing

- [Summary/TL;DR](#summarytldr)
- [Introduction](#introduction)
- [Why do we test?](#why-do-we-test)
- [What kind of tests are there?](#what-kind-of-tests-are-there)
  - [Unit testing](#unit-testing)
  - [Integration testing](#integration-testing)
  - [End-to-end testing](#end-to-end-testing)
    - [Smoke testing](#smoke-testing)
  - [Acceptance testing](#acceptance-testing)
- [How does this look in FOLIO?](#how-does-this-look-in-folio)
- [How do we evaluate tests?](#how-do-we-evaluate-tests)

## Summary/TL;DR

| Type        | Frameworks/Languages                                                        | Purpose/Scope                                                    | Written by         | Evaluated at        | Tutorial/more info                                                                               |
| ----------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------ | ------------------- | ------------------------------------------------------------------------------------------------ |
| Unit        | Backend: {JUnit} in Java, Frontend: {Jest} in JavaScript/TypeScript         | Single function, no external resources                           | Developers         | Commit/pull request | [backend 2](../training/backend/02-testing.md), [frontend 3](../training/frontend/03-testing.md) |
| Integration | Backend: {JUnit/RestAssured/Mockito} in Java, Frontend: {Jest/RTL} in JS/TS | Multiple functions/higher level logic, external resources, React | Developers         | Commit/pull request | [backend 2](../training/backend/02-testing.md), [frontend 3](../training/frontend/03-testing.md) |
| End-to-end  | Backend: {Karate} in Cucumber/Gherkin, Frontend: {Cypress} in JS/TS         | Multiple modules interactions, runs a full FOLIO install         | Developers/QA team | Nightly             | [backend supplement](./Karate.md)                                                                |
| Smoke       | Same as above                                                               | Critical paths, runs a full FOLIO install                        | Developers/QA team | Nightly             | [backend supplement](./Karate.md)                                                                |
| Acceptance  | TestRails                                                                   | Ensure the final product meets the user's requirements           | QA team/end users  | Bug Fest            |                                                                                                  |

## Introduction

Software testing is as much of a philosophical exercise as a practical one, so it's really important
that we try to approach testing with the right mindset, taking it from what many see as a boring and
repetitive task to something that is valuable and rewarding.

I _highly_ recommend the book _Introduction to Software Testing_ by Ammann and Offutt. It's a great
introduction to many of these concepts — although it offers deep dives into syntax, graph theory,
and so much more, the first few chapters are all about why we test and other foundations and I
recommend the read to anyone. It's easily available on Amazon and other places and I cannot
recommend it enough; there is also a companion course CS 416/CS 516 that goes over the contents.

Anyways, without further ado:

## Why do we test?

Most developers, especially in their early years, view testing the same as debugging; the only
purpose of testing is to allow them to debug their software, ensure it compiles, etc. This can be
extended a little more to show that software is correct, however, this is still a very narrow view
of testing and runs into a wall, since it is impossible to test every input (a function that takes
two 8-bit integers and adds them could have sixty-five thousand test cases). We can also view
testing as a way to find incorrect behavior, but this is a negative view and incentivizes less
testing (as less testing reveals less incorrect behavior).

What we want to do is to use testing, as a whole, to develope higher-quality software. Testers and
developers should be on the same team, working together to achieve the best product. Each test
should have a specific purpose and a reason for existing; without that, the time spent creating it
is a waste and it does not help anyone.

Testing also helps us detect faults as early as possible (and detect faults that happened later,
such as if a dependency changed, also known as regression testing).

## What kind of tests are there?

There are many types of testing, each with a different goal. As these progress, tests get larger,
more complex, and more expensive/time-consuming to run, so the goals broaden each time. Everyone has
a different view on what to call these, but here is my perspective from a bottom-up view
(particularly as it applies to FOLIO):

### Unit testing

This, as the name implies, is testing the smallest unit of code possible. This is typically done on
a single function at a time and, as the most granular level of testing, it is the easiest to find
and fix faults in, since the scope is so small. Of course, we still cannot test every possible
combination of inputs, but the goal here is to cover all conditions/branches, edge cases, and other
possibilities.

These are typically written with the functions.

### Integration testing

Now, we start _integrating_ other components into our tests. Unit tests focus on a single function,
without any external resources (file I/O, API calls, databases, etc); integration tests bring these
pieces together. This is where we test the bigger picture, where these functions tie together, etc.
We do not want to test every single condition of the underlying functions here — that is the job of
the unit tests — instead, we want to ensure all the parts work together. For the frontend, most unit
tests technically fall into this category (the line is a bit blurry, but IMO React and the DOM would
be an "external resource").

### End-to-end testing

FOLIO is built on a module system where each module is an independent piece (although they often
talk to each other). For integration/unit testing, we "mock" the other modules (assume they work
correctly); these tests will use real versions of other modules, ensuring they work from one end
(module) to another.

#### Smoke testing

Smoke testing is a specialized version of this, where we focus on a few "critical paths" — the most
important parts of the system. These are run frequently to ensure that changes in other modules have
not affected this module and follow the adage "where there's smoke, there's fire" — they are only
intended to signal that there's a deeper problem.

### Acceptance testing

This, as the name implies, is the final stage of "accepting" the software/feature/etc., and is
typically done at the end of development. **These test cases are based on the original
requirements**, ensuring that the software meets the requirements and customer's needs. Tying this
back to earlier, faults found here are often the hardest to fix, since these tests are the
highest-level and touch the most parts. These may not be written in code, due to their high-level
nature and the fact that they are often written by the end user/consumer.

## How does this look in FOLIO?

Unit and integration tests are run very often, every time a module has a commit/pull request.
End-to-end testing and smoke tests typically run every night, and acceptance testing is run as part
of "Bug Fest," an event that happens as part of every major release (typically three per year).

## How do we evaluate tests?

This is always a hard question, since by definition, we cannot test everything. We want to ensure
that the code is sufficiently evaluated, but we also want to minimize development time and the
number of tests. There are many ways to ensure we have the needed tests, and even entire fields of
study dedicated to this, but here are a few general goals:

- Touch every line (each line should be executed in a test)
- Touch every branch (each branch should be executed in a test)
- Handle any kind of edge/boundary cases
  - For this, we usually divide the input up into groups based on its qualities and the context. For
    example, for a number, it may be negative, zero, and positive.
- Ensure invalid values are treated appropriately

On a practical basis though, we can not measure much more than the line and branch coverage. As
such, we look at those as the primary "grade" of a set of tests, assigning it a "coverage percent."
FOLIO standards say this should be 80% or higher, however, we always want to strive for as high as
is practical.

Although this may seem like a high number, it is quite achievable. If you have trouble achieving it,
it generally means that the code under test has quality issues and should be split into smaller
pieces/refactored/etc.
