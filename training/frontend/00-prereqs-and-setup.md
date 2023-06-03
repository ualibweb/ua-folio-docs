# Backend Training — Prerequisites

## Objective

After completing this section, you should have everything necessary installed and a full Stripes
workspace ready for use.

## Deliverables

A working IDE environment, functioning stripes workspace, and the sample module running locally.

## Steps

First, be sure you have accounts created/access to the necessary repositories as specified in the
[onboarding document](../00-onboarding.md).

1. Download and install:

   - [Node.js](https://nodejs.org/en). Be sure to get version 18 or higher. For macOS, it is likely
     easier to `brew install node`.
   - Yarn (**version 1**). This is a package manager for node similar to `npm`, however, it has a
     few key differences that make it more suitable for our purposes. You can install it with
     `npm install -g yarn`.

1. Run `yarn config set "@folio:registry" https://repository.folio.org/repository/npm-folioci/`.
   This configures Yarn to look in FOLIO's repository for our packages (and `folioci` specifically,
   which contains snapshot (daily) versions).

1. Next, we'll need to create a Yarn workspace. A Yarn workspace is a collection of packages that
   work together; since [Stripes](../../docs/Stripes.md) and all the FOLIO modules all work
   together, it's important that everything can be developed at the same time. To do this, first
   make a new directory for your workspace (I recommend calling this `stripes`, `workspace`,
   `stripes-workspace`, or something along those lines).

1. Now, add the following as `package.json` in this new folder:

   ```json
   {
     "private": true,
     "workspaces": ["*"],
     "devDependencies": {
       "@folio/stripes-cli": "^2.6.1"
     },
     "resolutions": {
       "@types/react": "^17.0.2"
     }
   }
   ```

   This tells Yarn that we are using a workspace, we need `@folio/stripes-cli` (which facilitates
   running Stripes modules), and to use a certain version of `@types/react` (otherwise Yarn is
   likely to use multiple versions at the same time, creating weird conflicts and errors).

   Also, copy our [.prettierrc](../../docs/style/.prettierrc) file into the workspace folder (be
   sure that it stays as `.prettierrc`, no `.json`). This sets up our preferences for formatting.
   Also, add the following line inside: `"singleQuote": true`. For more information about this,
   check out our [style guide](../../docs/style/README.md).

1. Now, you should be able to get started with our example code. In this workspace folder, run:

   - `git clone git@github.com:ualibweb/folio-training-frontend.git`

     This will download the repository from GitHub -- if you setup SSH authentication for GitHub,
     this will also allow you to seamlessly commit and push changes. If you are not using SSH
     authentication (not recommended), use `https://github.com/ualibweb/folio-training-frontend.git`
     instead.

   - `yarn install`

     This will install all the dependencies and setup the workspace. This may take a while on the
     first run. As an extra note, when in a workspace, `yarn install` can be ran from anywhere
     inside the workspace and will install all dependencies for all packages — no need to `cd`
     around every time you need to modify dependencies.

     Now, cd into `folio-training-frontend` and run:

   - `git checkout -b your-name-or-username-master`

     This will create a new branch, `your-name-or-username-master`, for you to base your changes off
     of. Normally we would use the primary `master`, however, for demonstration purposes we'll use
     this branch as the basis for your changes.

   - `git push origin`

     This will push your new branch to GitHub; you should see something like:

     ```
     Total 0 (delta 0), reused 0 (delta 0), pack-reused 0
     remote:
     remote: Create a pull request for 'ncovercash-master' on GitHub by visiting:
     remote:      https://github.com/ualibweb/folio-training-frontend/pull/new/ncovercash-master
     remote:
     To github.com:ualibweb/folio-training-frontend
      * [new branch]      ncovercash-master -> ncovercash-master
     ```

1. Now that your local repository is setup, let's get your environment ready. First, open the entire
   workspace folder in VS Code.

1. Once you've gotten it open, try opening `folio-training-frontend/src/index.tsx`. You should be
   able to hover over classes, variables, and methods to see information about them -- if you do,
   then everything is setup and intellisense is working! :tada:

1. Finally, you should be able to run the application. Run the following:

   ```sh
   yarn stripes serve --okapi https://folio-snapshot-okapi.dev.folio.org --tenant diku --hasAllPerms
   ```

   This will start the application at http://localhost:3000/ using the current snapshot's
   [Okapi](../../docs/Okapi.md). It is ready to go as soon as you see
   `webpack built xxxxxxxxxxxxxxxxxxxx in ####ms`; **the command will not terminate until manually
   ended with `Ctrl+C`**. As you develop, this will continue to update the page at
   http://localhost:3000/ with the newest code, making changes near-instant.

   _Note: some changes may require restarting the server. If you're doing translation work, or
   experiencing weird behavior (particularly with file resolution), try restarting it as a first
   step._

1. Now, you have two choices:

- If you are not familiar with React (and functional components/hooks!) or TypeScript basics,
  complete the steps in [01-basics](./01-basics).
- If you are comfortable with React, functional components, and the basics of TypeScript, jump right
  into [02-stripes-components](./02-stripes-components.md)!
