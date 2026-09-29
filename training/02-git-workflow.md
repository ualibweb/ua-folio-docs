# Git Workflow

_Last reviewed: September 2026_

This page covers how we use Git and GitHub, both in training and on real FOLIO modules. Every
training lesson asks you to create a branch and open a pull request; this is the reference for how.

## Cloning

Clone with SSH if you've set it up (see [Set up Git](01-common-installs.md)):

```sh
git clone git@github.com:ualibweb/folio-training-frontend.git
```

Or with HTTPS:

```sh
git clone https://github.com/ualibweb/folio-training-frontend.git
```

For the backend track, use `folio-training-backend` instead of `folio-training-frontend`.

Pushing to these repositories requires access to the `ualibweb` GitHub organization (see
[Onboarding](00-onboarding.md)). If a push fails with a permission error, check that you've
accepted the organization invite.

## Your base branch (training only)

In the training repositories, each student works from their own **base branch** instead of the
shared default branch. Create it once, right after cloning:

```sh
git switch -c <username>-base
git push -u origin <username>-base
```

Replace `<username>` with your GitHub username (for example `jsmith-base`). Older pull requests
may show this as `<username>-master`; both mean the same thing.

## Starting a lesson (or a feature)

Each lesson gets its own branch, created from your base branch:

```sh
git switch <username>-base
git pull
git switch -c <username>-02-basic-ux
git push -u origin <username>-02-basic-ux
```

The `-u` flag (`--set-upstream`) links your local branch to the one on GitHub. It's required the
**first** time you push a new branch; without it, Git stops with
`fatal: The current branch ... has no upstream branch`. After that, plain `git push` and `git pull`
work.

On real FOLIO modules, branches are usually named after the Jira issue, for example
`UICAL-123-fix-date-picker`.

## Committing

Commit small, logical steps with clear messages:

```sh
git add src/views/MainPage.tsx
git commit -m "Add institutions list to main page"
git push
```

On FOLIO modules, start commit messages and PR titles with the Jira issue key (for example
`MODCAL-45: Validate exception dates`) so the work shows up on the issue.

## Pull requests

1. Push your branch, then open a pull request on GitHub. GitHub shows a "Compare & pull request"
   banner right after you push.
2. **In training, set the base branch to your `<username>-base` branch**, not the repository
   default. Use the **base:** dropdown at the top of the pull request page. This keeps each
   lesson's changes reviewable on their own.
3. Describe what you changed and anything you want feedback on, then request a review from your
   trainer.
4. Open the PR early, even before you're finished. Draft PRs are a good way to ask questions.
5. Address review comments with new commits on the same branch; the PR updates automatically.
6. Once approved, you or your trainer merges the PR. Then start the next lesson from your updated
   base branch.

## Keeping up to date

If your base branch changed after you started a lesson, bring those changes in:

```sh
git switch <username>-base
git pull
git switch <username>-03-testing
git merge <username>-base
git push
```

If Git reports a **merge conflict**, it marks the conflicting sections in the affected files. VS
Code highlights them and offers buttons to keep either version or both. Resolve each one, then
`git add` the files and `git commit` to finish the merge. If you're unsure, ask your trainer
before committing.

## Line endings (Windows)

Git for Windows converts line endings automatically by default. If every line of a file suddenly
shows as changed, that's usually a line-ending issue; ask your trainer before committing it.

## Next step

Choose your track:

- Frontend: [frontend/00-prereqs-and-setup](frontend/00-prereqs-and-setup.md)
- Backend: [backend/00-prereqs](backend/00-prereqs.md)