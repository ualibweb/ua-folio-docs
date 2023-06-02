# What is Stripes?

Stripes, like what an [okapi has](Okapi.md), is the frontend for FOLIO. It's a framework that brings
together all of the FOLIO UI modules into a single interface, combined with a number of tools and
component libraries. This document will describe some of the main parts of Stripes that you will
come across, what they do, and why we care about them. It is in no ways comprehensive; Stripes
itself has [much more detailed docs](https://github.com/folio-org/stripes/tree/master/doc).

## [stripes](https://github.com/folio-org/stripes)

This is the main package that re-exports all of the other Stripes packages. We will likely never
need to modify it, however, all our imports are centered around it (for example, to use `Button`
from `stripes-components`, the proper import would be
`import { Button } from '@folio/stripes/components';`).

## [stripes-core](https://github.com/folio-org/stripes-core)

This contains core functionality, routing, internationalization, and other central utilities. It
also provides convenient methods for checking for user's permissions, enabled modules, etc.

## [stripes-components](https://github.com/folio-org/stripes-components)

This is a library of React components that are used throughout Stripes. It includes things like
`<Button>`, `<Pane>`, `<MultiColumnList>`, form fields, and much more that are used throughout all
UI modules.

## [stripes-final-form](https://github.com/folio-org/stripes-final-form)

This is a wrapper for [`react-final-form`](https://github.com/final-form/react-final-form) that
provides a bit of extra functionality (checking for module navigation, etc.).

## [stripes-types](https://github.com/folio-org/stripes-types)

TypeScript support across Stripes is relatively new and, as most of Stripes is in plain JS, this
package provides type definitions (similar to how many `@types/*` packages from
[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) work).

## [platform-complete](https://github.com/folio-org/platform-complete)

Not a Stripes core package, but important nonetheless. The branches of this repository contain the
versions of modules that should be used for a full install of the FOLIO system. Typically, you will
want to look at `snapshot` (latest), `bama-rancher` (the one we use for our
[Rancher](./Rancher.md`)), and `R#-20##` (for a given flower release).

## [stripes-webpack](https://github.com/folio-org/stripes-webpack)

This contains the webpack configuration for how Stripes bundles its modules. It is unlikely that you
will need to ever touch this, however, there are some relevant TypeScript support efforts, so I'm
listing it for completeness.

## [stripes-cli](https://github.com/folio-org/stripes-cli)

This is a CLI package that is used for creating workspaces and running a local development server.

## [eslint-config-stripes](https://github.com/folio-org/eslint-config-stripes)

This contains a centralized eslint configuration for all of Stripes modules.
