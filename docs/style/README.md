# Style Guides

- [Prettier Configuration](#prettier-configuration)
- [Quotes](#quotes)
- [React](#react)
- [SonarLint](#sonarlint)
- [Pre-Commit Hooks](#pre-commit-hooks)

FOLIO as a whole uses a two-space indentation style and the following style guide:
https://dev.folio.org/guidelines/contributing/#coding-style.

## Prettier Configuration

There is a `.prettierrc` in this repo with some basic settings (really just two-space indentation).

To use prettier on the codebase, you must have the following NPM modules globally available and in
your PATH:

```sh
npm install -g prettier prettier-plugin-java
```

For frontend/Stripes work, you can drop this `.prettierrc` in your Stripes workspace folder as a
whole and it will take effect across all projects inside.

## Quotes

Note that, for the frontend, we use single quotes; add this to the `.prettierrc` file with
`"singleQuote": true`. This does not apply to JSX attributes (where double quotes should be) and for
strings involving concatenation (where template literals should be used instead).

For the backend, we use double quotes (as is Java standard).

## React

All JSX tags with two or more attributes must be separated on multiple lines, with the closing `>`
separate:

```jsx
<MyComponent
  prop1="foo"
  prop2="bar"
>
```

Self-closing is fine, provided that it follows the same guide (except with a closing `/>`).

CSS classes should be written in `camelCase`.

## SonarLint

[SonarLint](https://sonarlint.org/) is a wonderful IDE plugin to lint your code.

You can connect it to UA's sonar ruleset by going to the command palette (`cmd/ctrl`-`shift`-`P`),
searching for "connect to sonarcloud"; once you've connected, you can "update all project bindings"
which will load in UA's sonar rulesets. For more information, you can view the full
[Java](https://sonarcloud.io/organizations/ualibweb/rules?activation=true&qprofile=AYgnZwN72OQqzs1gKQbL)
and
[TypeScript](https://sonarcloud.io/organizations/ualibweb/rules?activation=true&qprofile=AYgnb4h4mOVlLpmQaCd8)
rulesets.

## Pre-Commit Hooks

We generally recommend the use of a `pre-commit` hook to ensure all code is appropriately formatted
before committing. For JS based projects, this is easy with `husky` and `lint-staged` from NPM.
