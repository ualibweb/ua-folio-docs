# Frontend Training — React Query

_Last reviewed: October 2026_

## Objective

After completing this section, you should be able to fetch data from FOLIO APIs using React Query
and `ky`, and test code that does so.

## Goal

Efficiently fetch data from APIs using React.

## Deliverables

- An application which displays a `MultiColumnList` (MCL) of all institutions in the system, with
  tests for the data hook and the list's loading state.

## Introduction

API requests are a core part of any modern application, connecting the frontend to the backend.
Over time there have been many ways to make them: the original `XMLHttpRequest` (XHR), jQuery's
`$.ajax`, the modern `fetch` API, and countless libraries. With React, though, components
re-render often, and sending a request on every render would quickly overload the server. To
solve this, we use [React Query](https://tanstack.com/query/v3/docs/react/overview), which caches
and manages data from APIs.

> **Which version?** FOLIO modules import React Query from the `react-query` package (the v3 line),
> which Stripes provides. The newer `@tanstack/react-query` v5 has a slightly different API, so
> when you search online, make sure the docs match the version you're using. The examples below use
> the object form of `useQuery({ queryKey, queryFn })`, which works in both.

React Query still needs something to actually make the requests. For this we use `ky`, a small
library that improves on `fetch`. FOLIO requests must include extra information: the tenant, the
gateway URL, and the current user's authentication. To include all of this automatically, we use
the `useOkapiKy()` hook from `@folio/stripes/core`. Despite the name, it works on both Eureka and
legacy Okapi platforms; it simply talks to whichever gateway Stripes is configured for (see
[Eureka](../../docs/Eureka.md)).

For this exercise, we'll use the `institutions` endpoint from `mod-inventory-storage`, which
returns the list of institutions configured in the system. To see or add institutions, open the
[Eureka snapshot](https://folio-etesting-snapshot-diku.ci.folio.org/) in your browser (not your
local UI, which only includes the training app) and go to **Settings → Tenant → Institutions**.
Feel free to add your own institutions to test with. Your local UI and the reference environment
use the same backend, so institutions you add there show up in your app too. Reference
environments are rebuilt daily, so your test data won't last.

> Aside: FOLIO tracks where items are stored hierarchically. The highest level is the institution
> (one FOLIO installation can serve several; the UA System could share one across UA, UAB, and
> UAH), then campus, then library, and finally location.

API documentation for FOLIO modules is listed on [dev.folio.org](https://dev.folio.org/reference/api/)
(for this endpoint, look for `mod-inventory-storage` and its location units API). Here's a sample
response for `GET /location-units/institutions`, which is all we'll be using:

```json
{
  "locinsts": [
    {
      "id": "40ee00ca-a518-4b49-be01-0638d0a4ac57",
      "name": "Københavns Universitet",
      "code": "KU",
      "metadata": {
        "createdDate": "2023-06-03T01:48:46.392+00:00",
        "updatedDate": "2023-06-03T01:48:46.392+00:00"
      }
    },
    {
      "id": "3ceddfd5-8628-4d9c-8d1d-b23a1dd78819",
      "name": "The University of Alabama",
      "code": "ua",
      "metadata": {
        "createdDate": "2023-06-04T00:07:50.808+00:00",
        "createdByUserId": "ad5b7a51-1574-5e44-8fb8-372c9eba2f24",
        "updatedDate": "2023-06-04T00:07:50.808+00:00",
        "updatedByUserId": "ad5b7a51-1574-5e44-8fb8-372c9eba2f24"
      }
    }
  ],
  "totalRecords": 2
}
```

## Steps

1. Create a branch for this lesson (see [Git workflow](../02-git-workflow.md)):

   ```sh
   git switch <username>-base
   git pull
   git switch -c <username>-04-query
   git push -u origin <username>-04-query
   ```

1. Add React Query's devtools to `MainPage`:

   ```tsx
   import { ReactQueryDevtools } from 'react-query/devtools';

   // somewhere in the returned JSX
   <ReactQueryDevtools initialIsOpen={false} />;
   ```

   The devtools show every query the page is running and its status. We don't normally ship them,
   but they're great for learning. Remove them before your final PR.

1. Create a new folder and file for the query hook, `src/hooks/useInstitutions.ts`:

   ```ts
   import { useOkapiKy } from '@folio/stripes/core';
   import { useQuery } from 'react-query';

   export const useInstitutions = () => {
     const ky = useOkapiKy();

     return useQuery({
       queryKey: ['ui-training', 'institutions'],
       queryFn: async () => ((await ky.get('location-units/institutions').json()) as any).locinsts,
     });
   };
   ```

   A few things are going on here:

   - We call `useOkapiKy` to get a `ky` instance already configured with the gateway URL (Kong, on
     Eureka), tenant, and user authentication. The "Okapi" in the name is historical; the hook
     works the same on Eureka. It must be called at the top level of the hook, not inside
     `queryFn`, because of the [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks):
     hooks must run in the same order on every render, never inside nested functions or after an
     early return.
   - `queryKey` identifies the cached result. Starting it with our module name keeps it from
     colliding with other modules' queries.
   - `queryFn` is an async function that returns the data to cache. Here it requests
     `location-units/institutions` and returns the `locinsts` property of the response.

1. Use the hook in `MainPage`. The `<Debug>` component is handy for this:

   ```tsx
   import { useInstitutions } from '../hooks/useInstitutions';

   // inside the component
   const institutionsQuery = useInstitutions();

   // in the JSX
   <Debug label="useInstitutions" value={institutionsQuery} />;
   ```

   This shows everything about the query: the `data`, plus status flags such as `isLoading`,
   `isSuccess`, and `isError`.

1. There's a problem: the dreaded `any` in our hook. In TypeScript, `any` should be a last resort
   (outside of tests), since it switches off type checking. Let's type the API response:

   ```ts
   export interface InstitutionsResponse {
     locinsts: Institution[];
     totalRecords: number;
   }

   export interface Institution {
     id: string;
     name: string;

     metadata: {
       createdDate: string;
       updatedDate?: string;
     };
     // What else should go here? Look at the institution JSON schema in the
     // mod-inventory-storage API docs: it lists every property and which are `required`.
     // `id` is technically optional in the schema, but only so new institutions can be created
     // without one; everything we read back will have an `id`, so we keep it required here.
   }
   ```

1. Now use these types. `ky`'s `.json()` accepts a generic telling it what it's parsing, so
   `.json<InstitutionsResponse>()` lets us drop `as any`. `useQuery` also takes a generic for the
   data it returns:

   ```ts
   return useQuery<Institution[]>({
     queryKey: ['ui-training', 'institutions'],
     queryFn: async () =>
       (await ky.get('location-units/institutions').json<InstitutionsResponse>()).locinsts,
   });
   ```

1. Now let's actually use the data! Update your `MultiColumnList` to display each institution's
   `name` and `code` (the `visibleColumns` prop limits which columns show). Handle the case where
   data hasn't loaded yet; TypeScript will help enforce this.

   <details>
   <summary>Hint for handling loading</summary>

   `data` is `undefined` while `isLoading` is `true`. There are two common ways to handle this:

   1. Pass `data ?? []` to the MCL's `contentData` prop, so it's never `undefined`.
   1. Don't render the MCL at all while loading, with something like this (or an early return):

      ```tsx
      {!isLoading && <MultiColumnList ... />}
      ```

   </details>

1. Experiment: does your page handle errors gracefully? (Change the URL in the hook to a bad one to
   find out.) If you add an institution in the reference environment and reload, does it appear?

1. Once it works, write tests. Testing `useInstitutions` is trickier than a component, because it
   calls an external API that won't be available while tests run. We'll **mock** `useOkapiKy` to
   return fake data, and use `renderHook` (instead of `render`) since we're testing a hook, not a
   component.

1. Create `src/hooks/useInstitutions.test.tsx`. First, mock `@folio/stripes/core`:

   ```tsx
   const kyGetMock = jest.fn(() => ({
     json: () =>
       Promise.resolve({
         // the data doesn't need to be realistic (no metadata etc.),
         // since the hook doesn't use it; we only check it's passed through
         locinsts: [
           { id: 'inst1-id', name: 'institution 1' },
           { id: 'inst2-id', name: 'institution 2' },
         ],
         totalRecords: 2,
       }),
   }));

   jest.mock('@folio/stripes/core', () => ({
     ...jest.requireActual('@folio/stripes/core'),
     useOkapiKy: () => ({ get: kyGetMock }),
   }));
   ```

   This does two things. First, it defines a mock `get` function that mirrors how `ky` behaves:
   calling it returns an object whose `.json()` returns a promise of the data. Second, it replaces
   `useOkapiKy` so our hook receives `{ get: kyGetMock }` instead of a real `ky`. We don't want to
   replace all of `@folio/stripes/core`, so `...jest.requireActual()` keeps everything else real.

1. Now write the test:

   ```tsx
   import React, { ReactNode } from 'react';
   import { QueryClient, QueryClientProvider } from 'react-query';
   import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
   import { useInstitutions } from './useInstitutions';

   // (the jest.mock code from the previous step goes here)

   describe('useInstitutions', () => {
     it('returns the requested data', async () => {
       // React Query needs a QueryClient. Stripes normally provides one for the whole app, but
       // since we only render the hook, we provide our own. retry: false makes failures fail fast.
       const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
       const wrapper = ({ children }: { children: ReactNode }) => (
         <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
       );

       const { result } = renderHook(() => useInstitutions(), { wrapper });

       // wait until the (mocked) request has finished
       await waitFor(() => expect(result.current.isSuccess).toBe(true));

       // the right endpoint was called...
       expect(kyGetMock).toHaveBeenCalledWith('location-units/institutions');
       // ...and the hook returned the institutions
       expect(result.current.data).toStrictEqual([
         { id: 'inst1-id', name: 'institution 1' },
         { id: 'inst2-id', name: 'institution 2' },
       ]);
     });
   });
   ```

   `renderHook` and `waitFor` both come from React Testing Library. Older tutorials import
   `renderHook` from `@testing-library/react-hooks` and get `waitFor` from its return value; that
   package is deprecated, so don't follow those examples.

1. Run the tests with `yarn test` and make sure they pass.

1. Now test your `MultiColumnList`, including the loading state. You have two options:

   1. Mock `ky` as above. That means using the real React Query, wrapping in a
      `QueryClientProvider`, and so on.
   1. Mock the `useInstitutions` hook itself, faking its return value directly.

   The second is recommended. It removes a layer of complexity, and since `useInstitutions` has its
   own tests, `MainPage`'s tests can focus on `MainPage`.

   Mocking a local file looks like this:

   ```tsx
   import { useInstitutions } from '../hooks/useInstitutions';

   // at the top of the file, before the tests
   jest.mock('../hooks/useInstitutions');

   // in each test, as needed
   jest.mocked(useInstitutions).mockReturnValue({ isLoading: true } as any);

   jest.mocked(useInstitutions).mockReturnValue({
     isLoading: false,
     isSuccess: true,
     data: [{ id: 'inst1-id', name: 'institution 1', code: 'i1' }],
   } as any);
   ```

   `jest.mocked()` tells TypeScript the function is a mock, so `mockReturnValue` is recognized. The
   `as any` is acceptable here, in a test, because we only fake the fields our component reads
   rather than the entire query result.

   The Jest docs on [mock functions](https://jestjs.io/docs/mock-functions) and
   [`jest.mock`](https://jestjs.io/docs/jest-object#jestmockmodulename-factory-options) cover
   more ways to mock modules.

1. After you have sufficient coverage, a successful review, and a merged PR, move on to the next
   section: [05-mutations](05-mutations.md).
