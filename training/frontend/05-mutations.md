# Frontend Training — Mutations

_Last reviewed: September 2026_

## Objective

After completing this section, you should be able to create and change data through FOLIO APIs
with React Query's `useMutation`, keep cached queries up to date afterwards, and test mutation
code.

## Goal

Let users add a new institution from your application.

## Deliverables

- A pull request where the "new +" pane from [02-stripes-components](02-stripes-components.md)
  contains a form to create an institution (name and code at least).
- Saving the form sends a `POST` to `location-units/institutions`, closes the pane, and the new
  institution appears in the list from [04-query](04-query.md) **without a page reload**.
- Errors from the server are shown to the user.
- Tests for the mutation hook and the form, with coverage meeting the 80% goal from
  [03-testing](03-testing.md).

## Introduction

In [04-query](04-query.md) we used `useQuery` to **read** data. Queries run automatically and are
cached. Changing data (create, update, delete) is different: it should only happen when the user
asks, it isn't cached, and afterwards any cached data it affected is out of date.

React Query handles this with **mutations**. `useMutation` wraps an async function that changes
data and gives you:

- `mutate` / `mutateAsync`: call these to run the mutation (`mutateAsync` returns a promise)
- status flags such as `isLoading`, `isSuccess`, and `isError`, plus `error`
- callbacks such as `onSuccess` and `onError`

After a successful mutation, we tell React Query that the institutions list is stale with
`queryClient.invalidateQueries`. Any component showing that list then refetches automatically.

Read [React Query's mutations guide](https://tanstack.com/query/v3/docs/react/guides/mutations) and
[invalidation guide](https://tanstack.com/query/v3/docs/react/guides/invalidations-from-mutations)
before starting. As in the last lesson, FOLIO uses the `react-query` (v3) package, so make sure
examples you find match that version.

> **Permissions note:** creating institutions requires the right capability (on Eureka) or
> permission (on legacy Okapi). The `diku_admin` user on reference environments has everything
> needed. In your own code, the module descriptor or `package.json` must declare what the UI needs;
> see [Eureka → Roles and capabilities](../../docs/Eureka.md#roles-and-capabilities).

## Steps

1. Create a branch for this lesson (see [Git workflow](../02-git-workflow.md)):

```sh
   git switch <username>-base
   git pull
   git switch -c <username>-05-mutations
   git push -u origin <username>-05-mutations
```

1. Look up the institution schema in the `mod-inventory-storage` API docs (linked from
   [dev.folio.org](https://dev.folio.org/reference/api/)) and note which fields are **required** when
   creating an institution. Make sure your `Institution` type from lesson 04 is exported and
   includes `code`, then add a type for the create request next to it, for example:

```ts
   export type NewInstitution = Pick<Institution, 'name' | 'code'>;
```

1. Create `src/hooks/useCreateInstitution.ts`:

```ts
   import { useOkapiKy } from '@folio/stripes/core';
   import { useMutation, useQueryClient } from 'react-query';
   import { Institution, NewInstitution } from './useInstitutions';

   export const useCreateInstitution = () => {
     const ky = useOkapiKy();
     const queryClient = useQueryClient();

     return useMutation<Institution, Error, NewInstitution>({
       mutationFn: (institution) =>
         ky.post('location-units/institutions', { json: institution }).json<Institution>(),
       onSuccess: () => queryClient.invalidateQueries(['ui-training', 'institutions']),
     });
   };
```

   What's happening:

   - `mutationFn` sends the new institution as the JSON body of a `POST` and returns the created
     record from the response.
   - The three generics are the **result** type, the **error** type, and the **variables** type
     (what you pass to `mutate`).
   - `onSuccess` invalidates every query whose key starts with `['ui-training', 'institutions']`,
     which is the key `useInstitutions` uses, so the list refetches. This is why consistent query
     keys matter.

1. Build the form in your second pane. Use Stripes form components such as `TextField` and `Button`
   from `@folio/stripes/components`, and keep the field values in React state for now. (Larger FOLIO
   forms use `react-final-form` via `@folio/stripes/final-form`; plain state is fine for two fields.)

   When the user saves:

```tsx
   const createInstitution = useCreateInstitution();

   const handleSave = async () => {
     try {
       await createInstitution.mutateAsync({ name, code });
       onClose(); // close the pane on success
     } catch {
       // createInstitution.error now holds the error; render it in the pane
     }
   };
```

   Disable the save button while `createInstitution.isLoading` is true, so users can't submit twice.

1. Try it out against your reference environment:

   - Create an institution and confirm it appears in the list without reloading.
   - Submit something invalid (for example, a `code` that already exists) and confirm your error
     message shows.
   - Watch the React Query devtools as you save, and notice the institutions query refetching.

   Remember that reference environments are shared and rebuilt daily, so don't worry about cleaning
   up test data, but don't delete institutions you didn't create.

1. Write tests for `useCreateInstitution`, following the `renderHook` pattern from
   [04-query](04-query.md). This time mock `post` instead of `get`:

```tsx
   const kyPostMock = jest.fn(() => ({
     json: () => Promise.resolve({ id: 'new-id', name: 'New', code: 'N' }),
   }));

   jest.mock('@folio/stripes/core', () => ({
     ...jest.requireActual('@folio/stripes/core'),
     useOkapiKy: () => ({ post: kyPostMock }),
   }));
```

   Then check that:

   - `kyPostMock` was called with `'location-units/institutions'` and
     `{ json: { name: 'New', code: 'N' } }`
   - the hook's result becomes `isSuccess`
   - the institutions query was invalidated. Hint: create the `QueryClient` yourself, then
     `jest.spyOn(queryClient, 'invalidateQueries')` before running the mutation.

   Inside `renderHook`, run the mutation with `act`:

```tsx
   await act(() => result.current.mutateAsync({ name: 'New', code: 'N' }));
```

   (`act` is exported from `@folio/jest-config-stripes/testing-library/react` too.)

1. Test the form by mocking `useCreateInstitution`, the same way you mocked `useInstitutions` in the
   last lesson. Cover saving successfully (is `mutateAsync` called with the typed values, and does
   the pane close?), the loading state, and showing an error.

1. **Stretch goal:** add a delete button to each row, using a second mutation that sends
   `DELETE location-units/institutions/{id}`. Ask for confirmation first; the
   [MOTIF](https://ux.folio.org/docs/all-guidelines/) guidelines describe FOLIO's confirmation
   patterns.

1. Open a pull request against your `<username>-base` branch and request a review. After a
   successful review and merge, you've finished the main frontend training. Congratulations!