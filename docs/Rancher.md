# Rancher

Our Rancher environment can be accessed at [this link](https://rancher.dev.folio.org/). The main
wiki for interacting with Rancher is
[here](https://dev.folio.org/faqs/how-to-get-started-with-rancher/).

Please note, the instructions for "Building Backend" and "Building Frontend" are outdated/invalid
(although most of the other information, such as building from a branch, is similar to what is here
and/or currently accurate).

## Installing/Updating a Module

Specific versions can be used by going to our "bama" rancher project, choosing "Apps", then
selecting "Upgrade" on the applicable module. From there, you can specify repository, tag, and other
options as needed.

For Okapi-related changes, such as updating the module description, use instructions such as
https://github.com/ualibweb/mod-calendar/blob/ualibweb/spring/docs/first-install.md.

## Docker Images

### Main Docker Release Process

For Docker, whenever something is pushed to `master`, the `folioci` repository is updated (via
Jenkins), resulting in something like `folioci/mod-calendar` and version numbers that contain
SNAPSHOT/build numbers.

Whenever the release process is followed, `folioorg/mod-calendar` (or equivalent) will be updated
with the new release. You can view tags of each on Docker Hub.

### Branch Testing

To test a branch, you can go to Jenkins' scratch image and choose "Build Backend" pipeline. Starting
a build here will grab a branch, build it, and make it available in https://docker.dev.folio.org/.

You can see generated tags at https://docker.dev.folio.org/v2/mod-calendar/tags/list and reference
these in Rancher with a repo like `docker.dev.folio.org/mod-calendar`.

### Frontend Testing

For this, you can branch `platform-complete` and edit `stripes-install.json` with applicable tags.
This will produce something you can use in Rancher at
https://docker.dev.folio.org/v2/platform-complete/tags/list with the specific build number included.
