# Frontend Training — React Basics

**This tutorial does not require any setup if the online editor is used and can be completed
separately/before any other training/accounts/etc.**

## Objective

After completing this section, you should be comfortable creating modern React components, managing
state across components, and using basic TypeScript.

## Deliverables

A TypeScript version of React's "Tic-Tac-Toe" tutorial.

## Steps

There are many guides and tutorials for React, and we do not want to duplicate them here. Instead,
we want you to use the official React tutorial, and then we will build on that.

1. Read through the tutorial [here](https://react.dev/learn/tutorial-tic-tac-toe).

1. Start working through the tasks listed there. There is a lot of information on the page, however,
   it is all extremely valuable and explains a lot of the philosophy behind React. It is up to you
   if you want to run it locally in VS Code or use the online CodeSandbox.

1. Once everything is working, and along the way, we recommend asking your trainer for periodic
   reviews, just to make sure you are on the right track, and to answer any questions you may have.
   Communication is key, especially as you are learning!

1. Once you're satisfied with your work, let's try to convert your code into TypeScript. TypeScript
   is a superset of JavaScript that adds type information, helping prevent common errors (for
   example, accidentally mixing up a string and a number, or using a slightly different prop name).

1. Before we start adding TypeScript to your game, read through the
   [TypeScript handbook basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
   (skip sections "tsc, the TypeScript Compiler", "Emitting with Errors", "Erased types", and
   "Downleveling" for now).

   Also check out
   ["Everyday Types"](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) and at
   least look at ["Narrowing"](https://www.typescriptlang.org/docs/handbook/2/narrowing.html). It's
   completely okay if you don't understand a lot of this — it's extremely in-depth, but we do
   recommend you at least expose yourself to this information.

1. Now, let's add TypeScript to our project! First, add the following `dependencies` to
   `package.json`:

   ```json5
   "typescript": "^4.5.4",
   "@types/react": "^18.0.0"
   ```

   If you are not using CodeSandbox, you will need to run `npm install` to install these new
   dependencies.

   Next, add a `tsconfig.json` file to the root of your project. This file tells TypeScript how to
   compile your code.

   ```json
   {
     "compilerOptions": {
       "outDir": "build/dist",
       "module": "esnext",
       "target": "es5",
       "lib": ["es6", "dom"],
       "sourceMap": true,
       "allowJs": true,
       "jsx": "react",
       "moduleResolution": "node",
       "rootDir": "src",
       "strict": true
     }
   }
   ```

1. One more thing, before we begin converting. If you have not already, separate your components
   into separate files (be sure to `export default` them). This will allow us to tackle one
   component at a time.

1. With everything ready, we can begin converting your code. I recommend starting at the smallest
   level possible, perhaps `Square`, then moving upwards. To convert a component, follow these
   general steps:

   - Change the extension to `.tsx`
     - _Aside: TypeScript files typically have a `.ts` extension, however, for React, they get
       `.tsx` (due to the addition of JSX syntax)_
   - Create an `interface` to define your props and add it to the component's signature

     - For example, `Square` would become something like:

       ```tsx
       interface SquareProps {
         ...
       }

       export default function Square({props, you, are, using} : SquareProps)
       ```

   - Add types where needed within the code (`let`/`const`/`function`/etc. where TypeScript cannot
     infer the type)
   - Add types to the `useState` hook (if you are using it) by passing in the type as a generic
     - For example, `useState(0)` would become `useState<number>(0)`.

1. As a final task, convert callback functions inside components to `useCallback`. This is not
   TypeScript related, however, it improves React performance. See
   [the docs](https://react.dev/reference/react/useCallback) for more information; this is typically
   straightforward and just involves wrapping your `function`s in `useCallback` and adding a list of
   dependencies.

1. We recommend reading through some of the other articles on the React site, especially
   ["Thinking in React"](https://reactjs.org/docs/thinking-in-react).

1. Now that you know more about React, we can start using it for FOLIO. The next section,
   [02-stripes-components](./02-stripes-components.md), will introduce you to the Stripes framework
   and how we build apps in FOLIO.
