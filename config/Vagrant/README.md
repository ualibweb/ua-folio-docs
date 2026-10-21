# Vagrantfile

_Last reviewed: October 2026_

> **Legacy.** These Vagrant boxes run the **Okapi-based** FOLIO platform, which FOLIO replaced with
> [Eureka](../../docs/Eureka.md). FOLIO retired its Okapi-based builds and reference environments on
> October 1, 2026, so these boxes are unlikely to receive new versions **(verify)**. They're kept for
> reference and for reproducing old behavior. For a full local stack on the current platform, look
> at FOLIO's [eureka-platform-bootstrap](https://github.com/folio-org/eureka-platform-bootstrap)
> (Docker-based); for most work, a shared reference environment is easier (see
> [Eureka → Environments](../../docs/Eureka.md#environments)).

## Before you get started

**_FOLIO's Vagrant boxes are x86-64 images and do not run on Apple Silicon Macs (M1 and later)._**

These Vagrant boxes are large virtual machines which can run an entire instance of FOLIO. It can be
convenient for certain large-scale FOLIO development to have this large setup of modules available
to you, however, these virtual machines are _very_ demanding (recommended at least 32 GB of RAM and
1-2 CPU cores dedicated to it), so they're generally best on a very limited basis.

For most circumstances, it is easier and recommended to use a shared, cloud-hosted environment: one
of FOLIO's Eureka reference environments, or our team's [Rancher](../../docs/Rancher.md)
environment if it's available to you (ask in `#bama`). These come at the tradeoff that restarts and
installations may take longer, and some debugging features are not available.

## Prerequisites

You will need to [download and install VirtualBox](https://www.virtualbox.org/wiki/Downloads).

## Introduction

Enclosed in this folder is a simple `Vagrantfile` that creates a box from FOLIO's
`folio/snapshot` image. With this, you can run a Vagrant environment locally and access all of
FOLIO's modules on your own machine. For the alternative `Vagrantfile` options, be sure to rename it
to just `Vagrantfile` after you download it.

The main changes to this from the default is in port forwarding. Typically, FOLIO will use port 9130
for the backend (Okapi) and 3000 for the frontend (Stripes). However, if you want to run Stripes
locally for development, this will _also_ use 3000, leading to a conflict. This Vagrantfile uses
port 3001 instead; as a result, you must use http://localhost:3001/ to access the running FOLIO
instance. Personally, I prefer this to using the dedicated `testing-backend` box which will serve
Okapi _only_, with no frontend at all -- I like being able to access both, as needed. PostgreSQL,
the database server used by FOLIO, is also exposed, on port **5433** of your machine (see
[Ports](#ports)). You can access databases `okapi_modules` and `okapi` with username `okapi` and
password `okapi25` (FOLIO's default).

Additionally, a command is used to install all the requirements for the `api-doc` tool within the
box.

An important note about Vagrant is that the VM will be able to access the folder that the
Vagrantfile is in (mounted as `/vagrant`). Therefore, it is optimal to ensure that whatever code you
may want to use in Vagrant will be available in the same folder -- a nice solution is to create a
folder for use with all FOLIO-based things and place the Vagrantfile in there, therefore Vagrant
will automatically be able to access them (preventing weird issues with setting them up manually).

There are a few other Vagrant boxes that may be of interest:

- `folio/snapshot`, the latest of all modules (used for the `Vagrantfile`)
- `folio/release`, the latest full "flower" release
- Others under the `folio` namespace in the Vagrant box registry, which moved from
  `app.vagrantup.com` to [HashiCorp's Vagrant registry](https://portal.cloud.hashicorp.com/vagrant/discover/folio)
  **(verify)**

## Ports

- frontend Stripes is forwarded to **nonstandard** `localhost:3001` (to prevent conflicts with local
  Stripes instances on :3000)
- backend Okapi is forwarded to `localhost:9130`
- Vagrant's Postgres is forwarded to **nonstandard** `localhost:5433` (to prevent conflicts with
  local)
- Vagrant's Kafka is forwarded to **nonstandard-ish** `localhost:29092`

## Basic Commands

To start your Vagrant machine, simply use `vagrant up`. This will be used to download the current
machine version, boot it up, etc., all in one command. Once this boots (this may take a _very_ long
time!), you can use `vagrant ssh` to log in to the machine.

Once you are done, you can use `vagrant suspend` to pause the machine, allowing you to quickly
resume it later or `vagrant halt` to shut it down.

## Updating Your Box

While FOLIO's Okapi builds were running, the boxes were re-released almost every day. Since those
builds were retired in October 2026, new versions are unlikely **(verify)**, but if one is
available, here's how to update. Upgrading the box will destroy all of your data inside of it, so be
sure you want to do this.

First, you must delete the current box with `vagrant destroy -f`. Then, you can run
`vagrant box update` and finally `vagrant up`. After updating, a download of the old version will be
left on your system -- use `vagrant box prune` to delete old/unused ones.

## Advanced

The advanced Vagrantfile (`Vagrantfile-advanced`) creates two boxes, `stock` and `testing`, with
`stock` based off of `folio/release` and `testing` based off of `folio/snapshot`. The redundancy here
is needed so that the `testing` box can be used for normal development then, once you are ready to
test against normal Okapi and other modules, you can try changes on `stock` and reset the machine as
needed.

If you would like to preserve changes made to an existing box, rename one of the boxes here to
`default`.

Since this has multiple boxes, each command you use will need to specify the box. For example:

`vagrant up` becomes `vagrant up testing`

`vagrant ssh` becomes `vagrant ssh stock`

`vagrant destroy --force` becomes `vagrant destroy --force stock`

To see an overall status report of all boxes and their state (keep in mind, you cannot have two 'up'
at the same time, since their ports conflict), you can run `vagrant status`.

## Notes for building Java modules inside the box

Current FOLIO backend modules need **Java 21**, but the boxes ship with an older JDK and Maven. It's
usually easier to build on your own machine and only run the result against the box. If you do need
to build inside the box:

```sh
sudo apt update
sudo apt install openjdk-21-jdk
```

The box's packaged Maven may also be too old; install a current Maven (3.8 or later) by following
the [Maven install guide](https://maven.apache.org/install.html). The old tracking ticket for this,
[FOLIO-3714](https://folio-org.atlassian.net/browse/FOLIO-3714), referred to Java 17.