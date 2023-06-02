# The Spring Way

FOLIO defines the Spring Way as a set of technologies that work together to power backend modules.
Notably, this includes the Spring Boot framework, an extremely popular Java framework (most popular
by multiple magnitudes), OpenAPI, and Postgres. This moves away from Vert.X and RMB
(raml-module-builder, FOLIO's previous custom-built framework) and towards a more standard Java
stack. For more information about the Spring Way, see the
[presentation](https://docs.google.com/presentation/d/1YgDCBimLTQ1ou-fPhvyKbWpVkec3Goa8lyJJe2hcLHk/edit).

It's really easy to go deep into the Spring rabbit hole (it is extraordinarily capable, but gets
really complex when you get deep into it), so here are some commonly used terms.

## What's a Controller? Service? All these magical things?

It's easy to get overwhelmed by the amount of new terminology and concepts that come with Spring,
especially since it does a ton of things automatically for you. Here's a quick rundown of the most
important concepts:

- **Controller**: A controller is a class that handles HTTP requests (we generate the specifications
  for these from OpenAPI). From the UML system diagram, these act as the boundary components,
  operating in the area between the user and the controls (services).
- **Service**: A service is a class that handles business logic. From the UML system diagram, these
  act as the control components; they do not talk to the user directly, but instead talk to the
  controllers (boundaries), other services (controls) and entities.
- **Entity**: An entity is a class that represents data, typically in a database. These should
  typically have no communication with services or controllers, and should be as simple as possible.
- **Repository**: A repository is a class that handles database operations, as we saw in
  [03-databases](../training/backend/03-databases).

## What's a component? And a bean?

A Component is a generalized version of controllers, services, and anything else that should only
exist once in an application. You can make your own (that aren't controllers/services/etc, since
those are automatically components) with the `@Component` annotation. These, and other "beans" are
automatically initialized at application launch; when they're needed by other classes, they are
simply `@Autowired` and injected by Spring; the developer does not need to create them or worry
about passing them around.

You can think of these like static classes, however, Spring does a lot more work under the hood to
ensure initialization, synchronization, and a lot more under-the-hood elements work correctly.

## What's a POJO? And a DTO?

A POJO is a "Plain Old Java Object," referring to a simple class with fields, getters, setters,
etc., but no business logic. A DTO is a "Data Transfer Object," which is a POJO that is used in API
requests and responses.
