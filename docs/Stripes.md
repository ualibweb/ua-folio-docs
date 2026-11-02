# What is Stripes?

_Last reviewed: October 2026_

Stripes, like what an [okapi has](Okapi.md), is the frontend for FOLIO. It's a framework that brings
together all of the FOLIO UI modules into a single interface, combined with a number of tools and
component libraries. This document will describe some of the main parts of Stripes that you will
come across, what they do, and why we care about them. It is in no ways comprehensive; Stripes
itself has [much more detailed docs](https://github.com/folio-org/stripes/tree/master/doc) (in
particular
["How Stripes fits together"](https://github.com/folio-org/stripes/blob/master/doc/dev-guide.md#how-stripes-fits-together)).

## [stripes](https://github.com/folio-org/stripes)

This is the main package that re-exports all of the other Stripes packages. We will likely never
need to modify it, however, all our imports are centered around it (for example, to use `Button`
from `stripes-components`, the proper import would be
`import { Button } from '@folio/stripes/components';`).

## [stripes-core](https://github.com/folio-org/stripes-core)

This contains core functionality, routing, internationalization, and other central utilities. It
also provides convenient methods for checking for user's permissions, enabled modules, etc.

It also provides the `useOkapiKy()` hook for making API requests. Despite the name, it works on
FOLIO's current [Eureka](Eureka.md) platform too: it simply talks to whichever gateway Stripes is
configured for (Kong on Eureka).

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
[Rancher](./Rancher.md)), and `R#-20##` (for a given flower release).

> **Update (October 2026):** `platform-complete` is the legacy, Okapi-era platform repository. As of
> October 1, 2026, it no longer receives snapshot updates; its release branches (such as
> `R1-2025-okapi` for Sunflower on Okapi) remain for libraries still running Okapi. Eureka
> environments are built from [platform-lsp](https://github.com/folio-org/platform-lsp) instead,
> which lists the _applications_ that make up each release (see [Eureka](Eureka.md)). The
> `bama-rancher` branch is outdated; see [Rancher](Rancher.md) for the current way to set up our
> environment.

## [stripes-webpack](https://github.com/folio-org/stripes-webpack)

This contains the webpack configuration for how Stripes bundles its modules. It is unlikely that you
will need to ever touch this, however, there are some relevant TypeScript support efforts, so I'm
listing it for completeness.

## [stripes-cli](https://github.com/folio-org/stripes-cli)

This is a CLI package that is used for creating workspaces and running a local development server.

Version 5 (FOLIO's Trillium release) requires **Node.js 22**; see the
[frontend training setup](../training/frontend/00-prereqs-and-setup.md).

## [eslint-config-stripes](https://github.com/folio-org/eslint-config-stripes)

This contains a centralized eslint configuration for all of Stripes modules.

## [stripes-connect](https://github.com/folio-org/stripes-connect)

This is the old way of making "smart" components that interact with Okapi/backend module APIs. Note
that this library is _not_ for use in new modules; instead, `react-query` should be used. See
[training/frontend/04-query](../training/frontend/04-query.md) and
[training/frontend/05-mutations](../training/frontend/05-mutations.md) for more information.

FOLIO modules use the `react-query` package (the v3 line) that Stripes provides, so make sure any
React Query docs or examples you find online match that version.