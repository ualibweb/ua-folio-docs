# Frontend Training — Common Components and UI/UX Patterns

_Last reviewed: October 2026_

## Objective

After completing this section, you should:

- be able to navigate the main parts of the FOLIO interface
- be able to use some of the fundamental FOLIO components
- understand some of the common FOLIO UX patterns
- know where to look for more information on UX patterns and components

## Goal

Be able to understand and use basic FOLIO components and patterns.

## Deliverables

- A pull request containing a modified `MainPage` with at least the following:
  - A `Pane` with a "new +" `Button` in the header
    - On click, this button should render a second `Pane`
    - This pane does not need to contain any data, but should be `dismissible` (adding a close
      button that closes the pane, although you'll also need to implement its `onClose`)
  - A `MultiColumnList` with some data (can be anything, preferably hardcoded — we will add dynamic
    data later)

## Introduction

First, let's take a look at the code provided in `folio-training-frontend`. Everything we need is in
the `src/` folder (ignore `translations/` and `src/test` for now).

Inside `src/`, we have the following:

- `index.tsx` - the entry point for our application, what is shown when the "Playground" app is
  clicked
  - This contains information about what pages get routed where
- `views/MainPage.tsx` contains the page that is rendered for the application's main page
- `views/MainPage.module.css` contains the CSS for the `MainPage` component.

  - Note that we import this using `import css from './MainPage.module.css'` then, to use
    classes/IDs from it, we reference `css.className` rather than a hardcoded string. When compiled,
    each class/ID will be given a unique name to avoid collisions (`wrapper` may become
    `wrapper---w86QT`).

- `views/MainPage.test.tsx` contains tests for the `MainPage` component. Feel free to replace the
  value in `'Cool stuff is coming'` with any other text on the page, to keep the test passing;
  writing tests in the next section.
- `components/Debug.tsx` provides a simple method to debug any values you need (state, functions,
  etc).

All of our changes will be made inside `MainPage.tsx` (feel free to remove `MainPage.module.css`
once it is no longer needed).

## Steps

1. Before we design anything ourselves, let's take a look at some of the rest of FOLIO, so that we
   can get a feel for the components and patterns that are used. By doing this, we can create a
   similar experience, ensuring all applications work similarly, thereby making it intuitive for
   users. To do this, open a FOLIO reference environment and log in as `diku_admin` / `admin`:

   - [Eureka snapshot](https://folio-etesting-snapshot-diku.ci.folio.org/), or
   - its twin, [Eureka snapshot 2](https://folio-etesting-snapshot2-diku.ci.folio.org/)

   These environments are rebuilt every day, so they may be briefly down, and anything you create
   is wiped at the next rebuild. The current list is on FOLIO's
   [reference environments](https://folio-org.atlassian.net/wiki/spaces/FOLIJET/pages/513704182/Reference+environments)
   page.

1. Play around with some modules! Feel free to create, edit, or otherwise mess with any data in
   here. Some excellent places to start would be the `Users` application or the `Calendar` settings
   (under the `Settings` app). Also look at **Settings → Authorization roles**: on the
   [Eureka platform](../../docs/Eureka.md), this is where access is managed, using roles made up of
   capabilities rather than individual permissions. As you explore, you'll pick up on patterns,
   such as the division of the screen into panes, the frequent use of those striped tables (called
   `MultiColumnList`s), and more.

   There are a lot more subtle patterns too, such as every title/heading being in `Sentence case`,
   where only the first letter is capitalized, and the rest are lowercase. This is a common pattern
   in FOLIO, and is used to make the interface more consistent and easier to read; although it does
   not seem like much, two modules having different header styles (or two parts within the same
   module) can easily create inconsistencies that make the interface harder to use and give an
   unfinished and unprofessional appearance.

1. All of these common tenets are codified in FOLIO's design system, called "MOTIF". Its
   [UX patterns and guidelines](https://ux.folio.org/docs/guidelines/ux-patterns/) get very
   detailed, covering things like "Confirmation message language" and the "Create record UX
   pattern". If you're ever unsure of how something should look or behave, this is a great
   resource. There is also a Slack channel, `#folio-ux`, where you can ask for feedback on more
   niche use cases.

1. Next, let's look at the main component library in [Stripes](../../docs/Stripes.md),
   [stripes-components](https://github.com/folio-org/stripes-components). This is a library of over
   one hundred commonly used components (if you have used other component libraries, such as
   Material UI, this will be familiar). These components are used throughout FOLIO, and are the
   building blocks for the interface. Each of these has documentation, such as
   [Pane](https://github.com/folio-org/stripes-components/blob/master/lib/Pane) and
   [MultiColumnList](https://github.com/folio-org/stripes-components/blob/master/lib/MultiColumnList).

   If you want to see how these look, there is also a
   [Storybook](https://dev.folio.org/stripes-components/), providing a live demo of each component.

1. Take a look at `src/components/Debug.tsx`; here you can see the use of an `Accordion` component
   (a type of foldable view). It's this easy to use FOLIO components! There is one important thing
   to note here, however: although the components are inside the package
   `@folio/stripes-components`, it is important that we **do not import directly from here**.
   Instead, we will import from `@folio/stripes/components`, which is a "wrapper" around the
   components, allowing us to centrally manage versions of all Stripes libraries. For example, to
   import the `Button` component, use `import { Button } from '@folio/stripes/components';`.

1. Now that we know a bit more about the FOLIO UI system, let's create a branch for this lesson
   (see [Git workflow](../02-git-workflow.md#starting-a-lesson-or-a-feature)):

```sh
   git switch <username>-base
   git pull
   git switch -c <username>-02-basic-ux
   git push -u origin <username>-02-basic-ux
```

1. Start the development server in a separate terminal, using the same command you used in
   [00-prereqs-and-setup](00-prereqs-and-setup.md) (step "Run the application").

1. Now, create a `<Paneset>` and `<Pane>` for the application's main view. For relevant
   documentation on panes, see
   [this page](https://github.com/folio-org/stripes-components/blob/master/lib/Pane). This will
   create the basic layout for our application.

1. Once you've got this, let's create a FOLIO standard header text using the
   [`<Headline>` component](https://github.com/folio-org/stripes-components/tree/master/lib/Headline).
   Then, create a
   [`<MultiColumnList>`](https://github.com/folio-org/stripes-components/blob/master/lib/MultiColumnList/)
   to display any information of your choice. Feel free to play with the available props as much as
   you desire — these components are really versatile and powerful! (Don't worry about any of the
   translation/localization notes, that will come later).

1. Now, let's make this page a bit more dynamic! Add a button into the Pane's header that, when
   clicked, displays another smaller pane to its right. This smaller pane should also be
   `dismissible` via a X icon in its header (this is pretty easy, see the `Pane` documentation for
   more details). If you want to jump ahead a bit, it might be a good idea to try extracting this
   second pane into its own component!

1. Feel free to experiment with any other components that you'd like! Once you're satisfied, create
   a pull request against your `<username>-base` branch and request a review.

1. After a successful review and PR merge, move onto the next section: [03-testing](03-testing.md).