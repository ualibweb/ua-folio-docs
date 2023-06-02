# What is Okapi?

This is an [okapi](https://en.wikipedia.org/wiki/Okapi):
![image](https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Saint-Aignan_%28Loir-et-Cher%29._Okapi.jpg/1920px-Saint-Aignan_%28Loir-et-Cher%29._Okapi.jpg)

Joking aside, Okapi is FOLIO's system for managing modules, routing, permissions, authentication,
and much more. It's what connects the backend services (mod-whatever) to the frontend (Stripes and
friends). You likely will not be developing Okapi itself, however, gaining an understanding of it
can be very helpful, especially when it comes to higher-level orchestration with permissions,
interfaces, etc.

There is a lot of information about Okapi over on its
[documentation pages](https://github.com/folio-org/okapi/blob/master/doc/guide.md); this is just a
summary of some of what I think is the most relevant to our usage.

_Fun fact: Okapi got it's name for being an "OK API", and Stripes is named that since okapis have
stripes!_

## Tenants

One of the first things you need to know about Okapi is the concept of multiple "tenants" in a
single Okapi instance. A single instance of Okapi can maintain different sets of modules, versions,
and any other information for each tenant.

Each Okapi install comes with a `supertenant` (the default), although we will not be using that.
Instead, we will typically use `diku`; to specify this, any request to Okapi should include the
header `X-Okapi-Tenant: diku`.

## Modules

Okapi is responsible for managing the modules that make up FOLIO. Each module is a separate service
with deployments, an API, and often much more. Okapi will manage the deployments for us; we just
need to tell it to install and enable modules for our tenant via an API request to
`/_/proxy/tenants/some-tenant/modules`; as part of this, Okapi will make a request to the module's
`/_/tenant`. This is when the module installs itself, creating databases, sample data, etc.; for
local development, you'll likely want to send that `/_/tenant` request yourself. This process is all
documented in much more depth at the Okapi guide.

## Interfaces

Okapi defines inter-module dependencies by each module's provided "interfaces". Each interface is a
set of API routes and permissions, versioned separately from the main module's version. This allows
a lot more specificity over dependencies; for example, `mod-inventory-storage` offers many
interfaces for `service-points`, `campuses`, `locations`, and more; if my module only needs to
access service points, I can specify that I need interface `service-points` version `1.0`.

Upon install, Okapi will verify all these dependencies are met. The lists of provided and consumed
interfaces are all specified in the `ModuleDescriptor` for backend modules and `package.json` for
frontend ones.

## Permissions

Although not technically a first-class Okapi responsibility (since these are handled by
`mod-permissions`), it's a part of the `ModuleDescriptor` and I wanted to include it here. Each
module provides a set of permissions via its `ModuleDescriptor` or `package.json`; each of these
interfaces can have children, making it easy to describe complex needs. For example, to check out a
book (`ui-checkout.circulation`), you need to be able to view book information
(`inventory.items.collection.get`).
