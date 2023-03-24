# Rancher

Our Rancher environment can be controlled at [this link](https://rancher.ci.folio.org/). The main
wiki for interacting with Rancher is [here](https://wiki.folio.org/display/FOLIJET/How-To) (outdated,
but still good reference, [here](https://dev.folio.org/faqs/how-to-get-started-with-rancher/)).  The actual deployed Rancher environment is at https://folio-dev-bama-diku.ci.folio.org/

# THE BELOW INFORMATION IS OUTDATED DUE TO AN ENTIRELY REDESIGNED RANCHER INTERFACE AS OF 2022 USE [THIS WIKI](https://wiki.folio.org/display/FOLIJET/How-To) AS THE PRIMARY SOURCE OF INFORMATION

Please note, the instructions for "Building Backend" and "Building Frontend" are outdated/invalid
(although most of the other information, such as building from a branch, is similar to what is here
and/or currently accurate).

## Installing/Updating a Module

Specific versions can be used by going to our "bama" rancher project, choosing "Apps", then
selecting "Upgrade" on the applicable module. From there, you can specify repository, tag, and other
options as needed.

If something else needs to be changed from the current setup (e.g. port number), you can override
the key found in the "Preview" at the bottom of the form.  For example, port can be changed with
`service.containerPort`.

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

For this, you can branch `platform-complete` and edit `stripes-install.json` and other install files
with applicable tags.  We have a dedicated branch `bama-rancher` for this purpose.  The first step
is to get the branch built with
[Jenkins](https://jenkins-aws.indexdata.com/job/folio-org/job/platform-complete/job/bama-rancher/)
(note: Jenkins will automatically rebuild on push, however, if you did not update the platform but
only modules which it uses, then you must manually trigger a build from Jenkins).  Once the branch
is built, the
[`BUILD-UI` Jenkins job](https://jenkins-aws.indexdata.com/job/scratch_environment/job/BUILD-UI/)
should be manually built with parameters for our rancher and `platform-complete` branch.  This will
produce a tag you can use in Rancher (listed at
https://docker.dev.folio.org/v2/platform-complete/tags/list) with the specific build number
included.  Once this is done, upgrade `platform-complete` like any other Rancher app.

I am not certain that the `platform-complete` step is necessary -- it may be possible to simply
start with the `BUILD-UI` step.

## Making Okapi Aware

For Okapi-related changes, such as updating the module description, use something like this in your
local terminal:

```sh
docker run --rm -e TENANT_ID=diku -e OKAPI_URL=https://bama-okapi.ci.folio.org \
  -e MODULE_NAME='mod-calendar' -e MODULE_VERSION='2.0.0-SNAPSHOT' \
  docker.dev.folio.org/folio-okapi-registration
```

If permissions are changed, you can fix them:

```sh
docker run --rm -e TENANT_ID=diku -e ADMIN_USER=diku_admin -e ADMIN_PASSWORD=admin \
  -e OKAPI_URL=https://bama-okapi.ci.folio.org \
  folioci/bootstrap-superuser
```

Details of these scripts are in their source code:
https://github.com/folio-org/folio-helm/blob/master/docker/folio-okapi-registration/create-deploy.sh

