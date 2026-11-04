# Rancher

_Last reviewed: October 2026_

> **Updated for Eureka (October 2026).** FOLIO's Rancher environments now run on the
> [Eureka](Eureka.md) platform, and the pipelines moved to a new Jenkins at
> <https://jenkins.ci.folio.org>. The old Okapi-era jobs on `jenkins-aws.indexdata.com`, the
> `platform-complete`/`bama-rancher` UI flow, and the 2023 shutdown schedule no longer apply.
> Items marked **(verify)** are UA-specific details that should be confirmed in `#bama` or
> `#folio-rancher-support`.

Our Rancher environment allows cloud-based testing of FOLIO. Since this is in the cloud, it does not
require the resources and hassles of running FOLIO locally. Unlike the shared
[reference environments](https://folio-org.atlassian.net/wiki/spaces/FOLIJET/pages/513704182/Reference+environments),
which are rebuilt on a schedule, a team environment can run the module versions and branches the
team needs.

## Where things are

| What | Where |
| --- | --- |
| Jenkins (create, delete, and deploy to environments) | <https://jenkins.ci.folio.org> → **0) FOLIO Rancher**. Sign in with GitHub. |
| Rancher UI (logs and status of pods/containers) | <https://rancher.ci.folio.org/> |
| Status of FOLIO's CI jobs and environments | <https://operational-dashboard.ci.folio.org/> |
| How-to guides | The Rancher/Eureka how-to pages in the FOLIO wiki's Folio Development Teams (FOLIJET) space, linked below |
| Help | Slack `#folio-rancher-support` |

Administration should be done through the Jenkins jobs; use the Rancher UI for viewing logs and
status.

## Our environment

Eureka environments run on clusters whose names start with `e`: `edev` for development, `etesting`
for testing. Following FOLIO's naming pattern (`folio-<cluster>-<namespace>-<tenant>`), our team
environment would be:

| What | URL |
| --- | --- |
| FOLIO UI (tenant `diku`) | <https://folio-edev-bama-diku.ci.folio.org/> |
| Kong gateway (replaces Okapi) | <https://folio-edev-bama-kong.ci.folio.org/> |
| Keycloak (logins) | <https://folio-edev-bama-keycloak.ci.folio.org/>|

Cluster `edev`, namespace `bama`. If these don't load, the environment may not exist
yet (or may have been removed); see "I want to create or recreate our environment" below.

**Shutdown schedule:** team environments have historically been shut down overnight and on weekends
to save costs. Ask in `#folio-rancher-support` for the current schedule **(verify)**.

## Common use cases

### I want to create or recreate our environment

From [Create Eureka SUNFLOWER environment](https://folio-org.atlassian.net/wiki/spaces/FOLIJET/pages/1232633857)
and related FOLIJET pages:

1. If the environment already exists, delete it first (see "I want to delete an environment"
   below). Even if a previous create job failed, the namespace must be deleted before recreating
   it.
2. Sign in to <https://jenkins.ci.folio.org>.
3. Open the job
   [createNamespaceFromBranch](https://jenkins.ci.folio.org/job/folioRancher/job/manageNamespace/job/createNamespaceFromBranch/)
   (for a Sunflower-release environment, use
   [createNamespaceFromBranch-Sunflower](https://jenkins.ci.folio.org/job/folioRancher/job/manageNamespace/job/createNamespaceFromBranch-Sunflower/)
   instead).
4. Click **Build with Parameters**, set the parameters below, and click **Build**.

| Parameter | Value |
| --- | --- |
| `PLATFORM` | `Eureka` |
| `CLUSTER` | `edev` |
| `NAMESPACE` | `bama`|
| `FOLIO_BRANCH` | The `platform-lsp` branch to build from (for example `snapshot`) |
| Optional flags | Such as sample/reference data or consortia; the job describes each one |

Eureka environments are built from [platform-lsp](https://github.com/folio-org/platform-lsp)
(not `platform-complete`). To use custom versions of platform components, create a branch of
`platform-lsp`, change the versions there, and select that branch as `FOLIO_BRANCH`.

### I want to deploy my backend module work

From
[Deploy module from feature branch Eureka](https://folio-org.atlassian.net/wiki/spaces/FOLIJET/pages/700809316/Deploy+module+from+feature+branch+Eureka):

1. Push your changes to a branch of the module in **`folio-org`** (ask in `#folio-devops` for push
   access if needed). Work on FOLIO modules belongs on branches under `folio-org`, not `ualibweb`.
2. Sign in to <https://jenkins.ci.folio.org> and open the job **deployModuleFromFeatureBranchEureka**.
3. Click **Build with Parameters** and set: `MODULE_NAME` (your module), `MODULE_BRANCH` (your
   branch), `JAVA_VERSION` `21`, `CLUSTER` `edev`, `NAMESPACE` `bama`, and
   `CONFIG_TYPE` `development`.
4. Click **Build** and wait. The job builds the module, creates a Docker image, and deploys it to the
   namespace. Optional flags can load the module's sample or reference data.

Protected namespaces need approval from Kitfox (FOLIO's DevOps team) before deploying.

### I want to deploy my Stripes/platform/UI work

The old flow (cloning `platform-complete`, editing the `bama-rancher` branch, and running
`ui-bundle-deploy`) no longer applies. Follow the FOLIJET wiki page **Build/Deploy UI for Eureka
environment**, or ask in `#folio-rancher-support` for the current job.

For day-to-day UI development, you usually don't need Rancher at all: run your module locally
against a shared Eureka environment, as described in the
[frontend training setup](../training/frontend/00-prereqs-and-setup.md).

### I changed permissions and need them to take effect

On Eureka, access is managed with **roles and capabilities**; there is no
`update-user-permissions` job anymore. New permission declarations in a module descriptor or
`package.json` become capabilities when the module is deployed. See
[Eureka → Roles and capabilities](Eureka.md#roles-and-capabilities), and the FOLIJET wiki page
**Reinstall module on tenant** if a module needs to be reinstalled.

### I want a separate tenant or environment

The old `create-tenant` and `delete-tenant` jobs were part of the Okapi setup. To test a specific
set of versions without touching the main environment, create a separate namespace with
`createNamespaceFromBranch` (using a `platform-lsp` branch with the versions you need), and delete
it when you're done. Ask in `#folio-rancher-support` before creating extra namespaces, since they
use shared cluster resources.

### I want to delete an environment

From [Delete Eureka environment](https://folio-org.atlassian.net/wiki/spaces/FOLIJET/pages/700809293/Delete+Eureka+environment):

1. Sign in to <https://jenkins.ci.folio.org>.
2. Open the job
   [deleteNamespace](https://jenkins.ci.folio.org/job/folioRancher/job/manageNamespace/job/deleteNamespace/).
3. Click **Build with Parameters**, select `CLUSTER` (`edev`) and `NAMESPACE`, keep the default
   `AGENT`, and click **Build**.

## When something goes wrong

- **Can't log in to the environment:** see the FOLIJET wiki page **Fix Eureka login issue**.
- **A module or the whole environment is misbehaving:** see the FOLIJET wiki pages **How to
  troubleshoot issue(s) on Rancher environment(s)** and **How to report an issue on Rancher
  environment**.
- **Anything else:** ask in `#folio-rancher-support`, and include the Jenkins job link or the
  environment URL.
