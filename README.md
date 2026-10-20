# ua-folio-docs

_Last reviewed: October 2026_

A centralized source for UA-specific documentation for working on the
[FOLIO](https://www.folio.org/) project: onboarding, training, local environment setup, our
development process, and module-specific notes that don't belong in the modules themselves.

## Start here (new team members)

Work through these in order:

1. [Onboarding](training/00-onboarding.md): accounts, access, and Slack channels
2. [Common installs](training/01-common-installs.md): Git, VS Code, and platform tools
3. [Git workflow](training/02-git-workflow.md): how we branch, push, and open pull requests
4. Pick a track: **Frontend** (React/Stripes) starts at
   [frontend/00-prereqs-and-setup](training/frontend/00-prereqs-and-setup.md); **Backend**
   (Java/Spring) starts at [backend/00-prereqs](training/backend/00-prereqs.md). The backend
   track is still being updated for the current FOLIO release, so check with your trainer before
   starting it.

Along the way, keep [What is Eureka?](docs/Eureka.md) open: it explains the platform FOLIO runs on
today, which replaced Okapi.

## Repository map

| Folder                  | What's in it                                                       |
| ----------------------- | ------------------------------------------------------------------ |
| [`training/`](training) | Step-by-step training for new developers (frontend and backend)    |
| [`docs/`](docs)         | Reference material: platform concepts, tools, testing, style guide |
| [`config/`](config)     | Editor configuration (VS Code) and legacy Vagrant VM setup         |
| [`scripts/`](scripts)   | Utility scripts used for past benchmarking and API comparison work |

## Maintaining these docs

FOLIO changes quickly. If something here is wrong or out of date, fix it in a pull request
following the [Git workflow](training/02-git-workflow.md), and update the `Last reviewed` date
at the top of any page you check.