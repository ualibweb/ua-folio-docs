# Vagrantfile

Enclosed in this folder is a simple `Vagrantfile` that creates a box for use with FOLIO's test
environment, `folio/testing`. With this, you can run a Vagrant environment locally and access all of
FOLIO's modules on your own machine. For the alternative `Vagrantfile` options, be sure to rename it
to just `Vagrantfile` after you download it.

The main changes to this from the default is in port forwarding. Typically, FOLIO will use port 9130
for the backend (Okapi) and 3000 for the frontend (Stripes). However, if you want to run Stripes
locally for development, this will _also_ use 3000, leading to a conflict. This Vagrantfile uses
port 3001 instead; as a result, you must use http://localhost:3001/ to access the running FOLIO
instance. Personally, I prefer this to using the dedicated `testing-backend` box which will serve
Okapi _only_, with no frontend at all -- I like being able to access both, as needed. Postgres, the
database server used by FOLIO, is also directly exposed on port 5432. You can access databases
`okapi_modules` and `okapi` with username `okapi` and password `okapi25` (FOLIO's default).

Additionally, a command is used to install all the requirements for the `api-doc` tool within the
box.

An important note about Vagrant is that the VM will be able to access the folder that the
Vagrantfile is in (mounted as `/vagrant`). Therefore, it is optimal to ensure that whatever code you
may want to use in Vagrant will be available in the same folder -- an nice solution is to create a
folder for use with all FOLIO-based things and place the Vagrantfile in there, therefore Vagrant
will automatically be able to access them (preventing weird issues with setting them up manually).

There are a few other Vagrant boxes that may be of interest:

- `folio/snapshot`, the latest of all modules (used for the `Vagrantfile`)
- `folio/release`, the latest full "flower" quarterly release
- Many more, as listed [here](https://app.vagrantup.com/folio)

## Ports

- frontend Stripes is forwarded to **nonstandard** localhost:3001 (to prevent conflicts with local
  Stripes instances on :3000)
- backend Okapi is forwarded to localhost:9130
- Vagrant's Postgres is forwarded to **nonstandard** localhost:5433 (to prevent conflicts with local)
- Vagrant's Kafka is forwarded to **nonstandard-ish** localhost:29092

## Basic Commands

To start your Vagrant machine, simply use `vagrant up`. This will be used to download the current
machine version, boot it up, etc., all in one command. Once this boots (this may take a _very_ long
time!), you can use `vagrant ssh` to log in to the machine.

Once you are done, you can use `vagrant suspend` to pause the machine, allowing you to quickly
resume it later or `vagrant halt` to shut it down.

## Updating Your Box

The FOLIO boxes are re-released every day (usually), therefore, it is quite easy to get out of date.
Upgrading the box will, however, destroy all of your data inside of it, so be sure you want to do
this.

First, you must delete the current box with `vagrant destroy -f`. Then, you can run
`vagrant box update` and finally `vagrant up`. After updating, a download of the old version will be
left on your system -- use `vagrant box prune` to delete old/unused ones.

## Advanced

The advanced Vagrantfile (`Vagrantfile-advanced`) creates two boxes, `stock` and `testing`, with
`stock` based off of `folio/release` and `testing` based off of `folio/testing`. The redundancy here
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

## Notes for Java 17

To get Java 17 support (the provided install of Maven only supports JDK 11):

```sh
sudo apt update
sudo apt install openjdk-17-jdk
```

Then, there's a bug that prevents Maven from working correctly. Follow
[these instructions](https://github.com/m-thirumal/installation_guide/blob/39187a6e9acff22b6800c7a407370478f1df5a77/maven/upgrade_maven.md)
to fix that, then you should be good to go.

There's a ticket, [FOLIO-3714](https://issues.folio.org/browse/FOLIO-3714?filter=-2), to get this fixed.
