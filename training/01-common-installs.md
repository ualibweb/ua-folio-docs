# Installs

## macOS Only

### Command Line Tools

To use compilers and other development features, you need to install the macOS command line tools
(if they have not already been installed):

```sh
xcode-select --install
```

This will open a new window and may take a few minutes to complete.

### Homebrew

[Homebrew](https://brew.sh/) is a package manager for macOS, making it easy to install and update
software, particularly software used for development. It also includes "casks" for desktop
applications.

Install it with:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Windows Only

### Chocolatey

This will install Chocolatey, a package manager for Windows that makes it easier to install
development software. Open PowerShell as an administrator (right-click the Start menu) and paste the
following:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### Install Git

Download and install [Git for Windows](https://git-scm.com/download/win)

### Install Windows Terminal

I recommend [Windows Terminal](https://learn.microsoft.com/en-us/windows/terminal/install) -- it is
much more usable than PowerShell directly.

## For all platforms

### Visual Studio Code

Download, install, and setup [Visual Studio Code](https://code.visualstudio.com/) according to
[our configuration](../../config/VSCode/README.md)

### Setup Git

It is recommended to setup SSH authentication with GitHub, if you have not done so already. This can
be done with
[these instructions](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
(particularly the "generating" and "adding" sections).

I recommend getting a Git client, since the Git command line interface can be difficult at times. I
recommend [GitKraken](https://www.gitkraken.com/); GitKraken Pro is free with the
[GitHub Student Developer Pack](https://education.github.com/pack)

To make Git/GitHub display your information, you should add your name and email to the git settings
with the following commands:

```sh
git config --global user.name "Your Name"
git config --global user.email your_email@ua.edu
```

If you use Git for personal and work projects and would like to keep the email addresses separated,
you can run these commands without the `--global` flag and they will only apply to the current
repository. This will need to be done for each repository you want to use a custom configuration
with.

### REST client

I recommend getting a REST client, such as [Insomnia](https://insomnia.rest/). There are many
alternatives out there; feel free to search around for what works best.
