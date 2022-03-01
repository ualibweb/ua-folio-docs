# New Development Setup -- START HERE

This document is meant to be a guide through the various other documentation present in this repo.

To setup a new machine for development, here are the main steps you will want to follow:

## Install Required Software

First, you will need to install a laundry list of software. It is quite a lot, however, all of is
useful for some part of the development process, be it writing code, testing, or anything else.

For macOS users, please see [installs/MACOS.md](installs/MACOS.md) for an opinionated list of
recommendations.

<!-- TODO: Write Windows and/or more generic instructions -->

## Configure Vagrant

In order to locally run a full instance of FOLIO, see [config/Vagrant](../../config/Vagrant) for
some example configurations.

## Setup Git

To get a copy of our code on your machine, you'll need to clone the git repositories. You can do
this using GitKraken, the command-line, or another Git client. For a guide for GitKraken, go
[here](https://support.gitkraken.com/start-here/guide/). You can find the URL using
[these instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
-- SSH is recommended, however, additional steps must be taken for this to work.

To make any commits, you should add your name and email to the git settings with the following
commands:

```sh
git config --global user.name "Your Name"
git config --global user.email your_email@ua.edu
```

## Setup VS Code

If you are using Visual Studio Code as your text editor, there is quite a bit to do to make it work
optimally. For my opinionated configuration guide, see [config/VSCode](../../config/VSCode).
