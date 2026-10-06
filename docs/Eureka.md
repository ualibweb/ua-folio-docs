# What is Eureka?

_Last reviewed: September 2026_

**Eureka** is the platform FOLIO runs on today. It replaced [Okapi](Okapi.md), FOLIO's original
home-grown platform, starting with the **Sunflower** release (R1 2025). Official Okapi support ended
with the release of Trillium (R1 2026) in June 2026, so new work should assume Eureka.

**As of October 1, 2026**, FOLIO has retired the Okapi-based reference environments
(`folio-snapshot`, `folio-snapshot-2`, and `folio-ramsons`), stopped updating the legacy
`platform-complete` repository, and restricted the old Jenkins server to FOLIO DevOps. The only
remaining Okapi build is the Sunflower release, kept for libraries still running Okapi.

This page summarizes what changed and what it means for day-to-day development. For the full
picture, see FOLIO's
[Eureka platform overview](https://folio-org.atlassian.net/wiki/spaces/PLATFORM/pages/193134643) and
[Eureka developer guide](https://folio-org.atlassian.net/wiki/spaces/FOLIJET/pages/712409221/Eureka+Developer+Guide).

## Why the change?

Okapi did many jobs at once: API gateway, routing, module management, and (with `mod-authtoken` and
`mod-permissions`) authentication and authorization. That made it a bottleneck and a lot of custom
code to maintain. Eureka splits those jobs between well-known open-source tools and small,
single-purpose FOLIO components, so FOLIO developers can focus on library features.

## The main pieces

| Piece                    | What it does                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| **Kong**                 | The API gateway. Every request from the UI goes to Kong, which routes it to the right module. |
| **Keycloak**             | Identity and access management: logins, tokens, SSO, and authorization policies.          |
| **Sidecars**             | A second container running alongside each backend module that checks authorization *before* a request reaches the module, and handles module-to-module calls. Edge modules (`edge-*`) run without one. |
| **Manager components**   | Services such as `mgr-applications`, `mgr-tenants`, and `mgr-tenant-entitlements` that track which applications exist and which tenants have them enabled. |
| **Applications**         | Modules are grouped into *applications* (for example `app-platform-minimal` or `app-platform-complete`). A tenant is *entitled* to applications rather than enabling modules one by one. The [platform-lsp](https://github.com/folio-org/platform-lsp) repository lists the applications that make up each release. |

Compared with Okapi: authorization used to be centralized in Okapi; on Eureka it is enforced by each
module's sidecar, and modules can call each other sidecar-to-sidecar instead of going back through
a central gateway.

Some Okapi-era modules **are not deployed at all** on Eureka: `okapi` itself, `mod-authtoken`,
`mod-login`, and `mod-login-saml`. Keycloak and its FOLIO companions (`mod-users-keycloak`,
`mod-login-keycloak`, `mod-roles-keycloak`) take over their jobs. If older code or docs tell you to
call one of those modules directly, look for the Eureka equivalent instead.

## Roles and capabilities

The biggest user-visible change is access control. Okapi used **permissions** (and permission
sets) assigned directly to users. Eureka uses **roles** made up of **capabilities**:

- A **capability** is the ability to perform an action on a resource, for example *view* or
  *create* on *instances*.
- A **role** is a named set of capabilities assigned to users (for example "Circulation staff").
- Keycloak policies are synchronized automatically from what administrators assign in FOLIO.

`mod-permissions` still exists on Eureka, but only so existing sites can migrate; assigning
permissions through it has no effect on what users can do. Role management lives in
`mod-roles-keycloak` and the `ui-authorization-roles` app. FOLIO's user documentation on
[permissions and roles](https://docs.folio.org/docs/platform-essentials/permissions/) explains the
model and the migration.

Modules still declare what they need in their module descriptors (backend) and `package.json`
(frontend); on Eureka these are turned into capabilities.

### How existing sites migrate

Libraries moving from Okapi go through two migrations, described in FOLIO's
[Migration to Eureka](https://folio-org.atlassian.net/wiki/spaces/FOLIJET/pages/442171409/Migration+to+Eureka)
guide:

1. **Users** are copied into Keycloak so they can log in. Only users who had permissions assigned
   are migrated, and passwords are not carried over, so migrated users need new passwords.
2. **Permissions** are converted into roles. Each distinct set of permissions a user had becomes a
   role with a system-generated (hash-based) name and the matching capabilities, and the users are
   assigned to it. Sites are expected to rename and reorganize these roles afterwards.

Tenants keep their data because each Eureka tenant's _name_ matches the old Okapi tenant _ID_. The
[example Okapi-to-Eureka migration](https://folio-org.atlassian.net/wiki/spaces/FOLIJET/pages/1008042111/Example+of+OKAPI+to+EUREKA+migration+overview)
walks through a full migration on FOLIO's Rancher infrastructure step by step (components, manager
services, discovery, tenants, entitlement, users and roles, reindexing). You won't run a migration
as a developer, but it's the clearest picture of how the Eureka pieces fit together.

## What stays the same for developers

A lot of your code won't notice the difference:

- **Headers keep their names.** Requests still carry `X-Okapi-Tenant` and `X-Okapi-Token`; on
  Eureka, `X-Okapi-Tenant` is required. That's why you'll still see "okapi" all over FOLIO code.
- **Login APIs** such as `POST /authn/login-with-expiry` still work.
- **Module descriptors and interfaces** still define what a module provides and requires.
- **Stripes APIs** are unchanged: `useOkapiKy()` still returns a configured HTTP client, now pointed
  at Kong instead of Okapi.
- **The tenant API** (`POST /_/tenant`) is still how a module sets itself up for a tenant; the
  platform calls it when an application is enabled.

## What changes for developers

- **Frontend configuration.** A Stripes build for Eureka needs the Kong URL, the Keycloak URL, and a
  `tenantOptions` object instead of just an Okapi URL and tenant. See FOLIO's
  [stripes.config.js properties](https://folio-org.atlassian.net/wiki/spaces/DEV/pages/46858271/stripes.config.js+properties)
  page (Eureka section).
- **Interfaces of type `multiple`** must be listed as *optional* dependencies in the module
  descriptor so the sidecar sets up that route (Okapi ignores the optional entry, so this works on
  both platforms). See the
  [Okapi guide](https://github.com/folio-org/okapi/blob/master/doc/guide.md) section on interfaces.
- **Don't call `mod-permissions` APIs** for authorization logic; they don't reflect real access on
  Eureka.
- **System users and module-to-module calls** go through sidecars; follow the developer guide above
  when a module needs to act on its own.
- **Deployment tooling** differs: builds and releases run on GitHub Actions, the legacy Jenkins
  server is being retired, and install files come from `platform-lsp` rather than
  `platform-complete`.

## Environments

- **Eureka snapshot** (shared, rebuilt daily):
  [folio-etesting-snapshot-diku.ci.folio.org](https://folio-etesting-snapshot-diku.ci.folio.org/),
  log in as `diku_admin` / `admin`. There's a twin at `folio-etesting-snapshot2-diku.ci.folio.org`.
  Support is in the `#folio-rancher-support` Slack channel.
- The **Okapi-based** `folio-snapshot`, `folio-snapshot-2`, and `folio-ramsons` environments are
  retired as of October 1, 2026. Older docs and bookmarks that point to `folio-snapshot.dev.folio.org`
  no longer work.
- The full, current list (including consortia/ECS and bugfest environments) is on FOLIO's
  [reference environments](https://folio-org.atlassian.net/wiki/spaces/FOLIJET/pages/513704182/Reference+environments)
  page.
- **Running Eureka locally:** FOLIO's
  [eureka-platform-bootstrap](https://github.com/folio-org/eureka-platform-bootstrap) starts a
  minimal Eureka platform with Docker. It's demanding on memory; for most training work a shared
  environment is easier.

## Release timeline

| Release             | Date             | Platform                                                   |
| ------------------- | ---------------- | ---------------------------------------------------------- |
| Ramsons (R2 2024)   | 2024             | Okapi                                                      |
| Sunflower (R1 2025) | 2025             | First Eureka release; Okapi also available                 |
| Trillium (R1 2026)  | June 2026        | Eureka; Okapi reference environments retired October 2026  |
| Umbrellaleaf        | expected Q4 2026 | Eureka                                                     |

Supported technology versions for each release are on the Technical Council's
[Officially Supported Technologies](https://folio-org.atlassian.net/wiki/spaces/TC/pages/5053681/Officially+Supported+Technologies)
page. For Trillium: Node 22, Stripes 10.1+, React 18.2, Java 21, Spring Boot 4.0, PostgreSQL 16.