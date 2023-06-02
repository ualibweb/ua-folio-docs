# Rancher

**Important note:
[As of May 9, 2023](https://folio-project.slack.com/archives/C017RFAGBK2/p1683623956748919), Rancher
environments are shut down for the weekends (from Friday at 5p CT until Sunday at 5:30p CT). The
page will display a 502 error while it is down, however, all data/installations/configuration will
be retained and available when it comes back up.**

Our Rancher environment allows cloud-based testing of FOLIO. Since this is in the cloud, it does not
require the resources and hassles of a local Vagrant box.

Our rancher environment (with tenant `diku`) is deployed at
https://folio-dev-bama-diku.ci.folio.org/; Okapi is available at
https://folio-dev-bama-okapi.ci.folio.org/.

To configure the environment, please refer to
[this wiki](https://wiki.folio.org/display/FOLIJET/How-To). A series of Jenkins jobs have been
created to make deployment a breeze; common use cases are described below. Our cluster is
`folio-dev`, project is `bama`. **For pipelines that request the admin password, ensure that you
manually type `admin` in — the prefilled `••••••••` will not work.**

To view logs and see the status of pods/containers, use [this link](https://rancher.ci.folio.org/).
Administration, however, should be done from the Jenkins jobs listed above.

## Common use cases

These are all adapted from [the main wiki](https://wiki.folio.org/display/FOLIJET/How-To).

### I want to deploy my Stripes/platform/UI work

1. Locally clone [platform-complete](https://github.com/folio-org/platform-complete)
1. Checkout branch `bama-rancher` (or, if you want to do something else that should not interfere
   with our main `diku` rancher, create a new branch based off of `bama-rancher`)
1. Make your changes in the `package.json`, `stripes.config.js`, and anything else you need. If you
   want to include work from a `ualibweb` fork, you can include Git URLs inside the `package.json`.
1. **Delete `yarn.lock`**
1. Run `yarn install`
1. If needed, verify everything installed correctly with `yarn why`
1. Push your changes
1. Run the
   [ui-bundle-deploy](https://jenkins-aws.indexdata.com/job/Rancher/job/Update/job/ui-bundle-deploy/build?delay=0sec)
   job; ensure that you have `ui_bundle_build` checked.

### I want to deploy my backend module work

1. Ensure your changes are in a branch on the `folio-org` module (you may need to ask in #devops for
   permission to push, if needed).
1. Run the
   [feature-backend-module-deploy](https://jenkins-aws.indexdata.com/job/Rancher/job/Update/job/feature-backend-module-deploy/build?delay=0sec)
   job. Be sure to select the java 17 agent.
   - If it does not show your branch, check the `refreshParameters` box and run it (leaving the rest
     unchanged); after that completes, you can create a new job with the desired branch
   - If you are changing things with the module descriptor/etc, you will likely want to check the
     `reinstall` box.
   - If you are changing permissions, run the
     [update-user-permissions](https://jenkins-aws.indexdata.com/job/Rancher/job/Update/job/update-user-permissions/build?delay=0sec)
     job

### I want to create a new tenant

This is useful if you want to create a separate Rancher environment for a certain set of versions,
for example testing how old a bug is, giving someone a certain environment, etc., where you do not
want to use the main `diku` tenant.

To do this, use the
[create-tenant](https://jenkins-aws.indexdata.com/job/Rancher/job/Update/job/create-tenant/build?delay=0sec)
job. Once you are done with the tenant, be sure to run the
[delete-tenant](https://jenkins-aws.indexdata.com/job/Rancher/job/Update/job/delete-tenant/build?delay=0sec)
job.
