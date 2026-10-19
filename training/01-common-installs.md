# Installs

_Last reviewed: October 2026_

These tools are needed for both frontend and backend work. Track-specific tools (Node.js, Java,
Docker, and so on) are covered in each track's prerequisites.

- [macOS only](#macos-only)
  - [Command Line Tools](#command-line-tools)
  - [Homebrew](#homebrew)
- [Windows only](#windows-only)
  - [Package managers: winget and Chocolatey](#package-managers-winget-and-chocolatey)
  - [Install Git](#install-git)
  - [Terminal](#terminal)
- [For all platforms](#for-all-platforms)
  - [Visual Studio Code](#visual-studio-code)
  - [Set up Git](#set-up-git)
  - [REST client](#rest-client)

## macOS only

### Command Line Tools

To use compilers and other development features, you need the macOS command line tools (if they
aren't already installed):

```sh
xcode-select --install
```

This opens a new window and may take a few minutes to complete.

### Homebrew

[Homebrew](https://brew.sh/) is a package manager for macOS that makes it easy to install and
update development software. It also includes "casks" for desktop applications.

Install it with:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

When it finishes, the installer prints **"Next steps"** commands that add `brew` to your PATH (on
Apple Silicon Macs, Homebrew installs to `/opt/homebrew`). Run them, then open a new terminal and
check that `brew --version` works.

## Windows only

### Package managers: winget and Chocolatey

**winget** is built into Windows 11 and recent Windows 10. Check that it works by running
`winget --version` in PowerShell; if it isn't found, install **App Installer** from the Microsoft
Store.

**Chocolatey** is still needed for a few tools that aren't available through winget, such as Maven
in the backend track. To install it, open PowerShell **as an administrator** (right-click the Start
menu) and paste:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### Install Git

```powershell
winget install --id Git.Git -e
```

Or download [Git for Windows](https://git-scm.com/download/win) directly. The installer also
provides **Git Bash**, a Bash shell that runs the macOS/Linux-style commands in these docs as-is.

After installing, **close and reopen your terminal**, then check that `git --version` works. A
terminal that was already open won't see newly installed programs. If `git` still isn't
recognized, Git's folder isn't on your PATH: add `C:\Program Files\Git\cmd` through **Edit
environment variables for your account → Path**, then open a new terminal.

### Terminal

[Windows Terminal](https://learn.microsoft.com/en-us/windows/terminal/install) is the default on
Windows 11. On Windows 10, install it from the Microsoft Store. It can open PowerShell and Git Bash
tabs side by side.

> **Windows tip:** Most commands in these docs are written for Bash. They work unchanged in **Git
> Bash**. In PowerShell, multi-line commands ending in `\` don't work, and `curl` is an alias for a
> different command; use Git Bash for those, or type `curl.exe` instead of `curl`.

## For all platforms

### Visual Studio Code

Download and install [Visual Studio Code](https://code.visualstudio.com/) (on Windows,
`winget install --id Microsoft.VisualStudioCode -e`), then set it up according to
[our configuration](../config/VSCode/README.md).

During install on Windows, keep **"Add to PATH"** checked so you can open folders with `code .`
from a terminal.

### Set up Git

Tell Git who you are, so your commits show your name and email:

```sh
git config --global user.name "Your Name"
git config --global user.email your_email@ua.edu
```

Use an email that's added to your GitHub account (**Settings → Emails**), or your commits won't be
linked to your profile. If you use Git for personal and work projects and want different emails,
run these commands without `--global` inside a repository; they then apply only to that repository.

We recommend setting up **SSH authentication** with GitHub by following
[GitHub's SSH instructions](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
(particularly the "generating" and "adding" sections). If you prefer HTTPS, GitHub will prompt you
to sign in through your browser the first time you push.

A graphical Git client can help while you learn. Options include VS Code's built-in Source Control
view, [GitHub Desktop](https://desktop.github.com/), and [GitKraken](https://www.gitkraken.com/).
GitKraken's Student Plan is free for 6 months through the
[GitHub Student Developer Pack](https://education.github.com/pack), then discounted while you're a
student.

How we use Git day to day is covered in [02-git-workflow](02-git-workflow.md).

### REST client

A REST client makes it easy to send and save API requests while developing. Popular options:

- [Insomnia](https://insomnia.rest/)
- [Bruno](https://www.usebruno.com/), which is open source and stores requests as files you can
  commit
- [Postman](https://www.postman.com/)
- The VS Code **REST Client** extension, for `.http` files right in your editor

Use whichever you prefer; `curl` in a terminal works too.

## Next step

Continue to [02-git-workflow](02-git-workflow.md).