# Frontend Training – Testing

## Objective

After completing this section, you should be able to make API requests using React Query and ky.

## Goal

Efficiently fetch data from APIs using React.

## Deliverables

- An application which displays a `MultiColumnList` (MCL) of all institutions in the system.

## Introduction

API requests are a core part of any modern application, allowing interactivity between the frontend
and the backend. Over time, there have been tons of different ways to achieve this, including the
original `XMLHttpRequest` (XHR) object, jQuery's `$.ajax`, the modern `fetch` API, and countless
others. However, these are all best suited for traditional applications that do not use React; with
React, components re-render often, and sending a request on every render will quickly overload your
server. To solve this, we use [React Query](https://tanstack.com/query/v3/docs/react/overview),
which provides a simple way to cache and manage data from APIs.

React Query, however, does still need an underlying method to make the requests. For this, we use
`ky`, a library that improves slightly on the modern `fetch`. As part of making FOLIO API requests,
however, a large number of custom information must be included (headers about the Okapi installation
and current user authentication); to include all of this automatically, we will use the
`useOkapiKy()` hook from `@folio/stripes/core`.

For this exercise, we will be using the `institutions` endpoint from the inventory storage module,
`mod-inventory-storage`. This endpoint allows us to query the list of institutions configured within
the system (you can find these in the snapshot environment at Settings -> Tenant > Institutions).
When testing this, feel free to add your own institution(s) to test with; since both
https://folio-snapshot.dev.folio.org/ and your local server are using the same backend Okapi at
https://folio-snapshot-okapi.dev.folio.org/, changes will appear in both places.

> Aside: In FOLIO, there is a hierarchical system to track where books are stored. The highest level
> is the institution (FOLIO can be installed at a high level with multiple institutions, for example
> UA System could share one installation across UA, UAB, and UAH); next is a campus, then a library,
> and finally a shelf location.

The full documentation for this API is
[here](https://s3.amazonaws.com/foliodocs/api/mod-inventory-storage/r/locationunit.html) (and all
module APIs are documented [here](https://dev.folio.org/reference/api/)). Here's a sample response
for `GET /location-units/institutions`, which is all we will be using:

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

1.  First, let's make a branch to keep these changes separate:

    ```sh
    git checkout -b your-name-or-username-04-query
    git push origin
    ```

1.  Now, let's add React Query's devtools to our project by adding this to the `MainPage`:

    ```tsx
    import { ReactQueryDevtools } from "react-query/devtools";

    // throw this somewhere
    <ReactQueryDevtools initialIsOpen={false} />;
    ```

    These devtools allow us to see all of the queries that are currently running, and their status.
    We don't normally use this, however, it is great for learning.

1.  Next, let's create a new folder and file to put our query in, as a hook:
    `src/hooks/useInstitutions.ts`:

    ```tsx
    import { useOkapiKy } from "@folio/stripes/core";
    import { useQuery } from "react-query";

    export const useInstitutions = () => {
      const ky = useOkapiKy();

      return useQuery(
        ["ui-training", "institutions"],
        async () => ((await ky("location-units/institutions").json()) as any).locinsts,
      );
    };
    ```

    There's a few things going on here:

    - First, we're using the `useOkapiKy` hook to get a `ky` instance that is configured with the
      current Okapi installation and user authentication. It is important that this is done outside
      `useQuery` since, per the [Rules of Hooks](https://legacy.reactjs.org/docs/hooks-rules.html),
      the same number of hooks must be used on every render, outside of nested functions and before
      any early returns.

    - Then, we do our query. The first argument to `useQuery` is the key, which is used to cache the
      result — we use the array with our module name here to ensure this does not pollute other
      module's API requests. The second argument is the query function, which is an async function
      that returns the data we want to cache. In this case, we are using `ky` to make a request to
      the `location-units/institutions` endpoint, and then returning the `locinsts` property of the
      response.

1.  Now, add this hook in our `MainPage`. You can do this with the `<Debug>` component:

    ```tsx
    <Debug label="useInstitutions" value={useInstitutions()} />
    ```

    This will show all of the information about the query, including the actual `data` as well as
    various status flags, such as `isLoading`, `isSuccess`, and more.

1.  This is great and all, but there's a problem: we have the dreaded `any` inside our hook's code.
    When we use TypeScript, `any` should be an absolute last resort (outside of tests), since it
    effectively disables all TypeScript features. Let's fix this by creating a type for the API
    response:

    ```tsx
    interface InstitutionsResponse {
      locinsts: Institution[];
      totalRecords: number;
    }

    interface Institution {
      id: string;
      name: string;

      metadata: {
        createdDate: string;
        updatedDate?: string;
      };
      // what else should go here?  Take a look at the original documentation's at:
      // https://s3.amazonaws.com/foliodocs/api/mod-inventory-storage/r/locationunit.html#location_units_institutions_get
      // The JSON schema in the response provides lots of information about what is provided (and what's `required`!)
      // Do note that `id` is technically optional, however, this is only to accommodate for requests that create a new one.
      // All queries of existing institutions will include IDs, so it does not need to be marked as optional (with ?:).
    }
    ```

1.  Now that we have the types made, let's use them in React Query. First, let's update that
    `.json()` call; this accepts a generic allowing it to know exactly what kind of data it's
    parsing. Swapping that out for `.json<InstitutionsResponse>()` allows us to get rid of the
    `as any`.

    While we're here, though, let's add some explicit types to `useQuery`, too. `useQuery` takes a
    generic for the resulting data's type; let's add that: `useQuery<Institution[]>`.

1.  Now that all this is here, let's actually do something with this data! Save the hook into a
    `const` and update your `MultiColumnList` to use data retrieved from this hook and display the
    `name` and `code` (you may want to use the `visibleColumns` prop to only show these two
    columns). Be sure to properly handle cases where the data has not yet loaded (TS will help
    enforce this, too).

    <details>
    <summary>Hint for handling loading</summary>

    It is possible for `data` to be `undefined` when `isLoading` is `true`. There are two ways to
    handle this:

    1.  Use the `data` prop of `MultiColumnList` and pass `data ?? []` to it. This will ensure that
        `data` is never `undefined` when passed to `MultiColumnList`.
    1.  Don't render the MCL at all when `isLoading` is true; this can be done with something like
        this (or an early return):

        ```tsx
        {!isLoading && <MultiColumnList ... />}
        ```

    </details>

1.  Play with this some; does it gracefully handle errors (you can edit the URL in the hook to a bad
    one to test this)? If you add data to the snapshot environment, does it update?

1.  Once everything appears to be working, let's write some tests! Testing `useInstitutions`,
    however, will be a little trickier: it interacts with an external API which will not be
    available when we're running our tests. To get around this, we will "mock" `ky` to give fake
    data. Also, since we won't be rendering a component, we'll also need to use `renderHook` instead
    of `render`.

1.  First, let's mock `ky`. This is pretty straightforward since we can just mock
    `@folio/stripes/core`:

    ```ts
    const kyMock = jest.fn(() => ({
      json: () => {
        return Promise.resolve({
          locinsts: [
            // we just want to check the data is returned
            // so it doesn't have to be incredibly "real" with metadata/etc,
            // since what we're testing doesn't use that
            {
              id: "inst1-id",
              name: "institution 1",
            },
            {
              id: "inst2-id",
              name: "institution 2",
            },
          ],
          totalRecords: 2,
        });
      },
    }));
    jest.mock("@folio/stripes/core", () => ({
      ...jest.requireActual("@folio/stripes/core"),
      useOkapiKy: () => ({
        get: kyMock,
      }),
    }));
    ```

    This does two things: first, it defines a mock function that will return our data (note that
    `ky` returns an object that we `await .json()` on, we return an object with a promise that
    resolves the data); second, it mocks `@folio/stripes/core` to use our mock whenever `ky.get()`
    is called. However, we do not want to mock all of `@folio/stripes/core`, so we use the
    `...jest.requireActual()` syntax to import everything else.

1.  Once our infrastructure is setup, we can write a test:

    ```tsx
    describe("Institution query", () => {
      it("Returns the requested data", () => {
        // must be provided to use react-query features. this is normally done by the Stripes interface
        // as a whole, but since we're only rendering the hook, we need to do it ourselves
        const queryClient = new QueryClient();
        // provide the queryClient
        const wrapper = ({ children }: { children: ReactNode }) => (
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );

        // a special `waitFor` for hooks is returned; we want to be sure to use it here
        const { result, waitFor } = renderHook(() => useInstitutions(), { wrapper });

        // renderHook's result gives us a lot of information; we care about the `current` hook
        // this waits until the API request has been completed
        await waitFor(() => result.current.isSuccess);

        // ensure that the proper endpoint was called
        expect(kyMock).toHaveBeenCalledWith("location-units/institutions");
        // and that it gave us what we wanted
        expect(result.current.data).toStrictEqual([
          {
            id: "inst1-id",
            name: "institution 1",
          },
          {
            id: "inst2-id",
            name: "institution 2",
          },
        ]);
      });
    });
    ```

1.  Run the tests with `yarn test` and ensure that they pass.

1.  Now that you understand how to mock `ky` and queries, try writing a test for your
    `MultiColumnList`, ensuring that the loading state works correctly. When dealing with this, you
    have two options:

    1. Mock `ky` itself, as we did above. This will require using the real `react-query`, wrapping a
       `QueryClientProvider`, etc.
    1. Mock the `useInstitutions` hook. This will allow us to fake its response without needing to
       mock `ky` or `react-query`.

    The second is recommended, since it removes a layer of complexity and, since we have tests for
    `useInstitutions`, we can assume that it works (no need to test it in two places; when writing
    tests for `MainPage`, we should focus only on `MainPage`).

    To do this, it's very similar to how we mocked `ky` before, however, it's slightly different
    since we're using a local file:

    ```ts
    import useInstitutions from "../hooks/useInstitutions";

    // at top of file, before the tests
    jest.mock("../hooks/useInstitutions");

    // in the test
    (useInstitutions as any).mockReturnValue({ isSuccess: false });
    (useInstitutions as any).mockReturnValue({ isSuccess: true, {data: ...} });
    ```

    The `as any` here is necessary since otherwise TypeScript thinks `useInstitutions` is the normal
    hook, so it won't know where `mockReturnValue` comes from and will think it is invalid.

1.  After you have gotten sufficient coverage, a successful review, and PR merge, move onto the next
    section: [05-mutations](05-mutations.md).
