# New Development Setup for macOS

## Prerequisites

Please note, you will likely need at least 20 GB of ram to run the full FOLIO environment. This is
not strictly required, however, is quite useful for understanding the overall workings of FOLIO. If
your machine does not support this, you can use the more minimal versions (as described in the
[Vagrant config](../../../config/Vagrant/README.md)). If you choose not to run either of these, you
may safely skip the entire [Virtualization Software](#virtualization-software) section below.

## Command Line Tools

To use compilers and other development features, you need to install the macOS command line tools
(if they have not already been installed):

```sh
xcode-select --install
```

This will open a new window and may take a few minutes to complete.

## Homebrew

[Homebrew](https://brew.sh/) is a package manager for macOS, making it easy to install and update
software, particularly software used for development. It also includes "casks" for desktop
applications.

Install it with:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Virtualization Software

To run FOLIO environments, you must install Vagrant and VirtualBox:

```sh
brew install --cask virtualbox
brew install --cask virtualbox-extension-pack
brew install vagrant
```

You will also need Docker:

```sh
brew install --cask docker
```

## Database Software

For analyzing databases, I recommend [DBeaver](https://dbeaver.io/):

```sh
brew install --cask dbeaver-community
```

## Code Editor

For development, Visual Studio Code is recommended -- it is a good blend of a fully-featured IDE and
a lightweight text editor. Install it with:

```
brew install --cask visual-studio-code
```

Then, open Visual Studio Code, press ⌘+Shift+P. In here, search for "Install 'code' command in
PATH":

![image](https://code.visualstudio.com/assets/docs/setup/mac/shell-command.png)

After you do this, you will need to restart your terminal.

## Java

For Java support, you will need to install Eclipse (provides some code intellisense features, even
though we do not use it directly):

```sh
brew install --cask eclipse-java
```

To install Java 11 itself (the version we use), use:

```sh
brew install openjdk@11
brew link openjdk@11
```

## Git Client

Git, used for version control, is very powerful and, unfortunately, the tools in VS Code are not
comprehensive. To make up this gap, I like [GitKraken](https://gitkraken.com). The PRO version is
free through the [GitHub Education Program](https://education.github.com/toolbox) for students and
(I believe) faculty/staff.

```sh
brew install --cask gitkraken
```

[Sublime Merge](https://sublimemerge.com/) is also a nice choice, however, this is a paid product.

## API Debugging

### REST Client

For sending REST requests and analyzing an API, the client [Insomnia](https://insomnia.rest) is very
nice:

```sh
brew install --cask insomnia
```

### Proxy

Sometimes, requests need to be intercepted and debugged in real time. This can be done with a proxy.

Personally, I like [Charles](https://charlesproxy.com/), however, this is an expensive paid product.
I have heard good things about https://www.inproxy.io/, however, have not used it myself.

## Node

Node (and NPM) is used for most all JavaScript/TypeScript development. Install them with:

```sh
brew install node
```

With this, you can now install the following tools (used to enforce code style and validate
openapi):

```sh
npm install -g prettier prettier-plugin-java @prettier/plugin-xml prettier-plugin-sql @apidevtools/swagger-cli
```
