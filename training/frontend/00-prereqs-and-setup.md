# Frontend Training — Prerequisites

_Last reviewed: October 2026_

## Objective

After completing this section, you should have everything necessary installed and a full Stripes
workspace ready for use.

## Deliverables

A working IDE environment, a functioning Stripes workspace, and the sample module running locally.

## Steps

First, make sure you've finished [onboarding](../00-onboarding.md),
[common installs](../01-common-installs.md), and read the [Git workflow](../02-git-workflow.md).

1. Download and install:

   - [Node.js](https://nodejs.org/en) **version 22** (22.12 or later), the version FOLIO's Trillium
     release officially supports. Newer versions such as Node 24 may install and run, but aren't
     officially supported yet; if you hit strange build or test errors, switch to Node 22 first.
     Note that the "LTS" download on nodejs.org and `winget install OpenJS.NodeJS.LTS` now give
     you Node 24. Options:
     - macOS: `brew install node@22`
     - Windows: install [nvm-windows](https://github.com/coreybutler/nvm-windows)
       (`winget install CoreyButler.NVMforWindows`), open a new terminal, then run
       `nvm install 22` and `nvm use 22`. Alternatively, download a v22 installer from the
       [Node.js downloads page](https://nodejs.org/en/download) by choosing version 22.
     - A version manager ([nvm](https://github.com/nvm-sh/nvm) on macOS/Linux, nvm-windows, or
       [fnm](https://github.com/Schniz/fnm)) also makes it easy to switch when FOLIO moves to a
       newer Node version.

     Check with `node --version`; it should print `v22.x.x`.

   - Yarn **version 1** (FOLIO still requires Yarn 1, not Yarn 2+). Yarn is a package manager like
     `npm`, with workspace features we rely on. Install it with `npm install -g yarn`, then check
     `yarn --version` shows `1.x`.

   After installing anything, **close and reopen your terminal**; a terminal that was already open
   won't see newly installed programs.

1. Configure Yarn to find FOLIO's packages. **Don't skip this step:**

```sh
   yarn config set "@folio:registry" https://repository.folio.org/repository/npm-folioci/
```

   This tells Yarn to look in FOLIO's repository for `@folio/*` packages, specifically `folioci`,
   which contains snapshot (tip-of-main) builds. You only need to do this once per computer. If you
   skip it, `yarn install` fails later with `Couldn't find package "@folio/stripes-cli" on the "npm"
   registry`.

1. Create a Yarn workspace. A Yarn workspace is a collection of packages developed together; since
   [Stripes](../../docs/Stripes.md) and the FOLIO modules all work together, it's important that
   everything can be developed at the same time. Make a new folder for your workspace (for example
   `stripes-workspace`).

1. Add the following as `package.json` in the new folder:

```json
   {
     "private": true,
     "workspaces": ["*"],
     "devDependencies": {
       "@folio/stripes-cli": "^5.0.0"
     },
     "resolutions": {
       "@types/react": "^18.2.0"
     }
   }
```

   This tells Yarn that we're using a workspace, that we need `@folio/stripes-cli` (which runs
   Stripes modules), and to use a single version of `@types/react`. Without that pin, Yarn may
   install several versions at once, causing confusing type errors. Keep `"private": true`; Yarn
   only allows workspaces in private projects.

   Also copy our [.prettierrc](../../docs/style/.prettierrc) file into the workspace folder. Keep
   the name exactly `.prettierrc` (no `.json`). For frontend work we use single quotes, so add
   `"singleQuote": true` to your copy. This applies our formatting preferences to every project in
   the workspace; see the [style guide](../../docs/style/README.md).

1. Get the example code. In the workspace folder, run:

```sh
   git clone git@github.com:ualibweb/folio-training-frontend.git
   yarn install
```

   This uses SSH, which only works if you've added an SSH key to GitHub (see
   [Set up Git](../01-common-installs.md#set-up-git)). Otherwise, use the HTTPS URL
   `https://github.com/ualibweb/folio-training-frontend.git`. `yarn install` sets up the whole
   workspace and may take a few minutes the first time; it prints many `warning` lines about
   deprecated or unmet dependencies, which are normal. It's done when it says `success Saved
   lockfile.` Inside a workspace, `yarn install` can be run from any folder and installs
   dependencies for every package, so there's no need to `cd` around.

1. Create your base branch, as described in
   [Git workflow → Your base branch](../02-git-workflow.md#your-base-branch-training-only):

```sh
   cd folio-training-frontend
   git switch -c <username>-base
   git push -u origin <username>-base
```

1. Open the **entire workspace folder** (not just `folio-training-frontend`) in VS Code.

1. Open `folio-training-frontend/src/index.tsx`. Hover over classes, variables, and methods; if you
   see type information, IntelliSense is working!

1. Run the application against a shared FOLIO backend: the **Eureka snapshot** reference
   environment. FOLIO runs on the [Eureka platform](../../docs/Eureka.md); the old Okapi-based
   snapshot environments are retired as of October 1, 2026.

   Run this **from inside `folio-training-frontend`** (not the workspace folder):

```sh
   cd folio-training-frontend
   yarn stripes serve --okapi https://folio-etesting-snapshot-kong.ci.folio.org --tenant diku --hasAllPerms
```

   Then open <http://localhost:3000/> and log in as `diku_admin` / `admin`. Despite the flag's
   name, `--okapi` here points at the environment's **Kong** gateway, which is how Eureka receives
   requests. You should see **Playground** (the training app) in the top menu.

   If you see `"serve" should be run from an app or platform context`, or Playground is missing
   from the menu, you ran the command from the workspace folder; `cd folio-training-frontend` and
   run it again.

   The app is ready when you see `webpack built ... in ####ms`. **The command keeps running until
   you stop it with `Ctrl+C`.** While it runs, the page reloads automatically with your latest code.

   _Some changes require restarting the server. If you're doing translation work or seeing weird
   behavior (especially with file resolution), restart it first._

   **(verify)** This logs in directly through Kong. A `stripes.config.js` using Eureka's Keycloak
   login page currently shows "Unauthorized" after logging in from `localhost`. Confirm with the
   team that direct login is the recommended setup for training.

   Having trouble? Ask in `#bama`, and include the command you ran and the error you see.

1. Now you have two choices:

   - If you aren't familiar with React (functional components and hooks) or TypeScript basics,
     complete [01-basics](./01-basics.md).
   - If you're comfortable with those, jump into
     [02-stripes-components](./02-stripes-components.md)!