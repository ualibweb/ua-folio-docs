# How to release a module

_Last reviewed: October 2026_

If you are at all unsure during this process, or do not have permissions, ask before proceeding;
`#folio-devops` can be asked about permissions and Oleksii Petrenko in Slack is a wonderful person
to ask if you have any questions **(verify: confirm he's still the right contact)**.

For frontend modules, follow
[this guide](https://github.com/folio-org/stripes/blob/master/doc/release-procedure.md#release-procedure).
You should be able to disregard anything about Jenkins.

For backend modules, most FOLIO modules now build and release with GitHub Actions. Follow the
[Centralized Maven Workflows release procedures](https://github.com/folio-org/.github/blob/master/README-maven.md#release-procedures).
The "quick summary" on FOLIO's
[release procedures page](https://dev.folio.org/guidelines/release-procedures/) is still a good
reference for the overall steps (NEWS.md, version numbers, Jira, release notes), but its Jenkins
steps only apply to repositories that still use Jenkins. As of October 2026, the legacy Jenkins
server is restricted to FOLIO DevOps, so if a module still seems to depend on it, ask in
`#folio-devops`.

After releasing, mark the version as released in [Jira](https://folio-org.atlassian.net/), and
announce it in `#folio-releases` on Slack.