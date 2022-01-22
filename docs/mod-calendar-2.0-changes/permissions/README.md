# Permission Changes

This folder contains a series of stages to move from the current permission
system to one that is more intuitive and follows current FOLIO permission
guidelines.

The
[`mod-permissions` system to migrate and deprecate permissions](https://wiki.folio.org/display/DD/Migration+of+Static+Permissions+Upon+Upgrade#MigrationofStaticPermissionsUponUpgrade-ChangestoOKAPI)
can be used to likely reduce the number of separate changes required for this
operation to one per module.

## Affected Modules

- `mod-calendar`
- `ui-calendar`
- `mod-circulation` (a permission _should_ be renamed per this specification in
  the near feature, however, it is not a breaking change)

I've boiled what I want to change into a series of steps. Please note that
"Assignable Permission" refers to permissions which are user-facing/visible and
can be assigned through the interface whereas "Checked Permissions" refers to
permissions that are verified by Okapi before a request is forwarded to an
endpoint (via `modulePermissions`).

## TODO

- [ ] Consider adding a permission to separate service point assignment from
      `modperms.calendar.update`.

## Explanation

### Current

First, this is the initial/current configuration:
![img](https://raw.githubusercontent.com/ualibweb/ua-folio-docs/main/docs/mod-calendar-2.0-changes/permissions/current.png)

Every endpoint has its own permission, as assigned by superpermissions in the
UI. The `calendar.all` permission scope allows access to every endpoint,
however, should not be used (per
[UICAL-169](https://issues.folio.org/projects/UICAL/issues/UICAL-169?filter=allopenissues)
and the
[Permission Set Guidelines](https://wiki.folio.org/display/DD/Permission+Set+Guidelines#PermissionSetGuidelines-Using*.allPermissions)).

Additionally, note that there is no distinction between creating and editing
calendars (both are allowed under `ui-calendar.edit`) and that there is no
specific permission for calendar deletion: it may only be enabled through
`ui-calendar.all`.

### Phase 1

![img](https://raw.githubusercontent.com/ualibweb/ua-folio-docs/main/docs/mod-calendar-2.0-changes/permissions/proposed-intermediate-1.png)

For this, we refactor the backend permission structure. This is done by creating
a series of new, generic calendar permissions (based on the CRUD model) to
control access, editing, creation, and deletion of data. If a user has any of
these, they must be able to view (otherwise things get funky with returning
errors in requests/etc) and it does not make sense for them to be unable to see
what they're editing.

These new endpoints are prefixed with `modperms.` as they are invisible and used
for API control, per what I read in the
[Permission Set Guidelines](https://wiki.folio.org/display/DD/Permission+Set+Guidelines).
This may be incorrect, however, I have not yet spoken with someone on the
permissions team to verify this. I should be able to find someone to run this by
in the next few days.

The current endpoint-based permissions would likely become deprecated, with
subpermissions allowing automatic transfer to the `modperms` CRUD permissions
(or full
[replacement](https://wiki.folio.org/display/DD/Migration+of+Static+Permissions+Upon+Upgrade),
depending on how migration works under the hood (I am still waiting on
confirmation from someone more knowledgable on this nuance).

The `calendar.all` permission would be fully removed at this stage as, quite
frankly, it is not used by anything and should never be referenced. No UI
permission changes would be made yet.

### Phase 2

![img](https://raw.githubusercontent.com/ualibweb/ua-folio-docs/main/docs/mod-calendar-2.0-changes/permissions/proposed-intermediate-2.png)

Now, the endpoint-based permissions would be fully removed (not simply
deprecated).

This phase focuses primarily on UI permission refactoring: the too-generic
`.all` and `.edit` permissions would be deprecated and new CRUD-based
permissions would take their place, isomorphic to the permissions created in
Phase 1 to the backend.

### Phase 3

![img](https://raw.githubusercontent.com/ualibweb/ua-folio-docs/main/docs/mod-calendar-2.0-changes/permissions/proposed-intermediate-3.png)

For this phase, the `.all` and `.edit` UI permissions are fully removed, for the
reasons mentioned above.

### Final

![img](https://raw.githubusercontent.com/ualibweb/ua-folio-docs/main/docs/mod-calendar-2.0-changes/permissions/final.png)

After all of these, we are left with simple, granular permissions that directly
correlate to data-related permissions.
