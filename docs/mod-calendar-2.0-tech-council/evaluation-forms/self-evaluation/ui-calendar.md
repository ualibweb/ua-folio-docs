# mod-calendar self evaluation criteria

- [x] Upon acceptance, code author(s) agree to have source code canonically in folio-org github
- [x] Copyright assigned to OLF
- [x] Uses Apache 2.0 license
- [x] Third party dependencies use an Apache 2.0 compatible license
- [x] Module’s repository includes a compliant Module Descriptor
- [x] Modules must declare all consumed interfaces in the Module Descriptor “requires” and
      “optional” sections
- [x] ~~Environment vars are documented in the ModuleDescriptor~~ N/A
- [x] ~~Back-end modules must define endpoints consumable by other modules in the Module Descriptor
      “provides” section~~ N/A
- [x] ~~All API endpoints are documented in RAML or OpenAPI~~ N/A
- [x] ~~All API endpoints protected with appropriate permissions~~ N/A
- [x] No excessive permissions granted to the module
- [x] Code of Conduct statement in repository
- [x] Installation documentation included
- [x] Contribution guide is included in repo
- [x] ~~Module provides reference and/or sample data (if applicable)~~ N/A
- [x] Personal data form is completed, accurate, and provided as PERSONAL_DATA_DISCLOSURE.md file
- [x] Sensitive information is not checked into git repository
- [x] Module is written in a language and framework that FOLIO development teams are familiar with
      _React/Stripes with TypeScript_
- [x] ~~Back-end modules are based on Maven/JDK 11 and provide a Dockerfile~~ N/A
- [x] ~~Integration (API) tests written in Karate if applicable -_note: these tests are defined in
      https://github.com/folio-org/folio-integration-tests_~~ N/A
- [x] ~~Back-end unit tests at 80% coverage~~ N/A
- [x] ~~Data is segregated by tenant at the storage layer~~ N/A
- [x] ~~Back-end modules don’t access data in DB schemas other than their own and public~~ N/A
- [x] Tenant data is segregated at the transit layer
- [x] Back-end modules respond with a tenant’s content based on x-okapi-tenant header
- [x] ~~Standard GET /admin/health endpoint returning a 200 response -_note: read more at
      [https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol](https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol)_~~
      N/A
- [x] ~~HA compliant~~ N/A
- [ ] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI
      module cannot be accepted that relies on an interface only provided by a back end module that
      hasn’t been accepted yet_ - Requires `calendar 5.0`, as implemented by `mod-calendar`
- [x] Module only uses existing infrastructure / platform technologies* e.g. PostgreSQL,
      ElasticSearch (and Kafka, despite it being still unofficial at present)*
- [x] ~~Integration with any third party system (outside of the FOLIO environment) tolerates the
      absence of configuration / presence of the system gracefully.~~ N/A
- [x] Front-end modules: builds are Node 16/Yarn 1
- [ ] Front-end unit tests written in Jest/RTL at 80% coverage
- [ ] Front-end End-to-end tests written in Cypress, if applicable
- [x] Front-end modules have i18n support via react-intl and an en.json file with English texts
- [x] Front-end modules have WCAG 2.1 AA compliance as measured by a current major version of axe
      DevTools Chrome Extension
- [x] Front-end modules use the current version of Stripes
- [x] Front-end modules follow relevant existing UI layouts, patterns and norms -_note: read more
      about current practices at
      [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
- [x] Front-end modules must work in the latest version of Chrome (the supported runtime
      environment)
- [ ] sonarqube hasn't identified any issues
