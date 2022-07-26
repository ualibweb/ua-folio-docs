# Permission Changes

This folder contains the proposed changes to move from the current permission system to one that is
more intuitive and follows current FOLIO permission guidelines.

The
[`mod-permissions` system to migrate and deprecate permissions](https://wiki.folio.org/display/DD/Migration+of+Static+Permissions+Upon+Upgrade#MigrationofStaticPermissionsUponUpgrade-ChangestoOKAPI)
can (and should) be used to make this process much more straightforward.

## Affected Modules

- `mod-calendar`
- `ui-calendar`
- ~~`mod-circulation`~~

## Explanation

Please note that "Assignable Permission" refers to permissions which are user-facing/visible and can
be assigned through the interface whereas "Checked Permissions" refers to permissions that are
verified by Okapi before a request is forwarded to an endpoint (via `modulePermissions`).

### Current

First, this is the initial/current configuration:
![img](https://raw.githubusercontent.com/ualibweb/ua-folio-docs/main/docs/mod-calendar-2.0-changes/permissions/current.png)

Every endpoint has its own permission, as assigned by superpermissions in the UI. The `calendar.all`
permission scope allows access to every endpoint, however, should not be used (per
[UICAL-169](https://issues.folio.org/projects/UICAL/issues/UICAL-169?filter=allopenissues) and the
[Permission Set Guidelines](https://wiki.folio.org/display/DD/Permission+Set+Guidelines#PermissionSetGuidelines-Using*.allPermissions)).

Additionally, note that there is no distinction between creating and editing calendars (both are
allowed under `ui-calendar.edit`) and that there is no specific permission for calendar deletion: it
may only be enabled through `ui-calendar.all`.

### Final

![img](https://raw.githubusercontent.com/ualibweb/ua-folio-docs/main/docs/mod-calendar-2.0-changes/permissions/final.png)

With this structure, both frontend and backend have permissions structures that follow a standard
CRUD format with inheritance that is straightforward and non-confusing, with the added benefit of an
extra layer of abstraction. Additionally, problematic `.all` permissions were removed.

Note that the specific endpoints in the image above have been replaced with new endpoints. However,
the permissions still apply as indicated following the CRUD pattern.
