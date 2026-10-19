# Frontend Training — Testing

_Last reviewed: September 2026_

## Objective

After completing this section, you should:

- understand the importance of testing
- understand what coverage is and how to calculate it
- be able to write tests in Jest with RTL
- be able to write parameterized tests
- be able to achieve good coverage (80%+) on tests

## Goal

Write quality tests for our application.

## Deliverables

- A pull request containing unit and integration tests for all code thus far. Minimum 80% coverage,
  preferably as close to 100% as we can get. You may not be able to get full coverage on some parts;
  work with your trainer to find ways to test as much as possible. **Ignore the `DebugForm`
  component for now.**

## Introduction

This section will focus on testing; please read the [testing](../../docs/Testing.md) document before
starting for important context.

## Notes

Most applications import directly from `@testing-library/react` and friends. FOLIO modules
instead use the versions re-exported from `@folio/jest-config-stripes`. This extra layer makes
every FOLIO module use the same versions (currently Jest 29+ and React Testing Library 14+),
ensuring compatibility and uniformity.

This looks like:

```diff
-import { render, screen } from '@testing-library/react';
-import userEvent from '@testing-library/user-event';
+import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
+import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
```

Besides the import change, everything works just as it does with the regular Jest and RTL
packages. `describe`, `it`, `expect`, and `jest` are globals, so they don't need importing.

## Steps

1. First, create a branch for this lesson (see [Git workflow](../02-git-workflow.md)):

   ```sh
   git switch <username>-base
   git pull
   git switch -c <username>-03-testing
   git push -u origin <username>-03-testing
   ```

1. With testing, and JS testing in particular, there are a lot of frameworks and libraries that work
   together, so let's take a minute to define some. **Jest** is the main tool we use for frontend
   testing: it finds and runs tests, provides the `describe`/`it`/`expect` functions, and lets us
   mock other modules. **React Testing Library (RTL)** adds tools that make testing React components
   easier, such as ways to `render` components, query the DOM, and (with its companion
   **user-event**) simulate user interactions. **jsdom** is the simulated browser environment Jest
   runs these tests in.

1. Before we start writing new tests, let's gauge our current coverage. To do this, run:

   ```sh
   yarn coverage
   ```

   This will run all of our tests and generate a coverage report, giving percentages for statements
   (significant lines), branches (conditions), functions, and lines. Overall, our goal is to get
   these all to 80%, although the higher the better! As you add increasing amounts of tests, running
   the full set can take a long time, so these commands may also be helpful:

   ```sh
   yarn test # do not generate a coverage report, just check that they pass
   yarn test --watch # re-run tests as files change
   yarn test someFile # run tests in files matching that pattern
   # all of these also work with `yarn coverage`
   ```

1. Now, let's begin writing some tests. I would recommend starting with the `Debug` component, since
   it is quite simple (also, disregard the `DebugForm` component, we will learn about that later).
   First, let's create a structure for the test file, `Debug.test.tsx` (which should live alongside
   the component):

   ```tsx
   import React from 'react';
   import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
   import { Debug } from './Debug';

   describe('Debug', () => {
     it('renders strings correctly', () => {
       // TODO
     });
   });
   ```

   Now would be a good time to summarize the main Jest features:

   - `describe`: denotes a group of tests, usually for a single component or function
     - these can be nested and makes it much easier to read test outputs
     - inside the arrow functions in here, you can add functions such as `beforeAll`, `beforeEach`,
       `afterAll`, and `afterEach` to run code before/after each test to setup/teardown common
       things
     - you should not put `expect` assertions in here, only in `it`/`test` functions
   - `it` and `test` (interchangeable): describe a single test
     - these cannot be nested
     - the arrow functions for these can be `async` (make sure to `await` _everything_ necessary!
       use intellisense to see what returns a `Promise`, a lot of RTL features require this)
     - `it` may seem like a weird name, but it's meant to be semantic, e.g.
       `it('renders correctly')` or `it('calls the callback')`
   - `expect` is the main tool for assertions
     - `expect(someValue).toBe(someOtherValue)` is the most common assertion
     - `expect(someValue).toEqual(someOtherValue)` is similar to `toBe` but works for objects
     - `expect(someValue).not.toBe(someOtherValue)` is the opposite of `toBe`
     - there are many more, such as `toBeFalsy`, `toBeUndefined`, `toHaveBeenCalledWith`, etc.;
       see the [Jest `expect` docs](https://jestjs.io/docs/expect) for the full list
     - RTL's jest-dom matchers add DOM-related assertions, such as `toBeInTheDocument`,
       `toHaveAttribute`, `toHaveClass`, and `toBeDisabled`
   - `waitFor` is useful for waiting for things to happen, e.g. if you're waiting for an async
     function to call a mocked function: `waitFor(() => expect(myMock).toHaveBeenCalled())`
   - `jest.fn()` creates a mock function (with optional implementation); these are useful for
     testing callbacks and other functions that are passed as props
     ([see more](https://jestjs.io/docs/jest-object#mock-functions)). More information on this will
     be in the coming sections.
   - `jest.mock()` mocks a module, replacing it with a mock implementation. More information on this
     will be in the coming sections.

   Also, when using RTL, there a few key things to know:

   - `render` renders a component
   - `screen` provides access to the DOM to make queries

     - This is how we can find and reference elements.
     - There are three types of methods on this object:

       - `getBy*`: these require the element to be present upon query and will throw an error if the
         element is not found
       - `queryBy*`: this will return `null` if the element is not found
       - `findBy*`: this **returns a promise** and will wait for the element to appear before
         resolving (ideal for testing interactive components, to ensure the component has time to
         update; for example, if a button is clicked to display a dialog, `getBy` may be called too
         soon for the dialog to be present)

       - There are also `All` versions (`getAllBy*` and so on) that return arrays; see RTL's
         [query reference](https://testing-library.com/docs/queries/about) and
         [which query should I use?](https://testing-library.com/docs/queries/about#priority)

1. Anyways, back to our test; let's start by rendering the component and checking that it contains
   the expected text:

   ```tsx
   it('renders strings correctly', () => {
     render(<Debug label="test" value="myString" />);

     expect(screen.getByRole('heading', { name: 'Debug (test)' })).toBeVisible();
     expect(screen.getByText('"myString"')).toBeVisible();
   });
   ```

   This does three things:

   1. Renders our component
   1. Ensures that the heading has the proper label (note the use of **ByRole** here, rather than
      **ByText** — whenever possible, we want to find components by their accessible roles, since
      this ensures that the component is accessible to screen readers and other assistive
      technologies).
   1. Ensures that the JSON-ified string is present.

1. Create a few more tests, perhaps including a number, array, object, and null. Looking at the
   `Debug` component, there's another type of value that gets special treatment; can you figure out
   what it is and write a test for it? We'll need that for full branch/condition coverage.

1. Once you've got a few of these, you might notice how repetitive this is. We don't need to keep
   the heading test (since there is no special logic there), but we're still `render`ing and
   `expect`ing the same each time; surely there's a better way to do this! The good news is there
   is: parameterized testing. We can use `it.each` (or `test.each`):

   ```tsx
   it.each([
     ['myString', '"myString"'],
     [123, '123'],
     [true, 'true'],
     [false, 'false'],
     [null, 'null'],
     // ...
   ])('renders value %s as %s', (value, expected) => {
     render(<Debug label="test" value={value} />);

     expect(screen.getByText(expected)).toBeVisible();
   });
   ```

1. Once you're done with `Debug`, move onto your other components. There may not be too much to test
   with the static data, but it'll be good practice. If you get any errors saying something about
   `intl`, `IntlProvider`, etc., change your `render` call to look like:

   ```tsx
   render(withIntlConfiguration(<MyComponent />));
   ```

   `withIntlConfiguration` comes from `src/test/util`.

1. To test interactive elements, such as buttons, use `userEvent`. Its methods return promises,
   so make the test `async` and `await` each interaction:

   ```tsx
   import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

   it('opens the second pane', async () => {
     render(withIntlConfiguration(<MainPage />));

     await userEvent.click(await screen.findByRole('button', { name: /new/i }));

     expect(await screen.findByRole('region', { name: /new/i })).toBeVisible();
   });
   ```

   The exact roles and names depend on your component; use `screen.debug()` to print the rendered
   DOM when a query can't find something.

1. As you're working, create a pull request against your `<username>-base` branch and request a
   review. This will allow your trainer
   to see your progress and provide feedback.

1. After you have gotten sufficient coverage, a successful review, and PR merge, move onto the next
   section: [04-query](04-query.md).
