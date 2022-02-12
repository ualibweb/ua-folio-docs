# New Development Setup for macOS

## Prerequisites

Please note, you will likely need at least 20 GB of ram to run the full FOLIO environment.

### Command Line Tools

To use compilers and other development features, you need to install the macOS
command line tools (if they have not already been installed):

```sh
xcode-select --install
```

This will open a new window and may take a few minutes to complete.

### Homebrew

[Homebrew](https://brew.sh/) is a package manager for macOS, making it easy to
install and update software, particularly software used for development. It also
includes "casks" for desktop applications.

Install it with:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Virtualization Software

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

### Database Software

For analyzing databases, I recommend [DBeaver](https://dbeaver.io/):

```sh
brew install --cask dbeaver-community
```

### Code Editor

For development, Visual Studio Code is recommended -- it is a good blend of a
fully-featured IDE and a lightweight text editor. Install it with:

```
brew install --cask visual-studio-code
```

Then, open Visual Studio Code, press ⌘+Shift+P. In here, search for "Install
'code' command in PATH":

![image](https://code.visualstudio.com/assets/docs/setup/mac/shell-command.png)

After you do this, you will need to restart your terminal.

### VS Code Extensions

Many extensions are available to add features to Visual Studio Code. I recommend
the following, each of which can be installed by copying the line into your
Terminal:

```sh
code --install-extension aaron-bond.better-comments # Highlight TODO commends with a different color
code --install-extension adammaras.overtype # Allow use of the Insert key to type over characters (not applicable to most mac keyboards)
code --install-extension blzjns.vscode-raml # RAML syntax highlighting
code --install-extension dawhite.mustache # Mustache syntax highlighting (for openapi)
code --install-extension dbaeumer.vscode-eslint # Detect JS/TS errors with eslint
code --install-extension donjayamanne.githistory # View file history from the Git view
code --install-extension ecmel.vscode-html-css # CSS class autocompletion
code --install-extension esbenp.prettier-vscode # A better code formatter
code --install-extension GabrielBB.vscode-lombok # Support for lombok Java annotations
code --install-extension gurumukhi.selected-lines-count # Count the number of selected lines
code --install-extension hilleer.yaml-plus-json # Easily convert between YAML and JSON
code --install-extension mechatroner.rainbow-csv # Display each column of a CSV in a different color
code --install-extension mermade.openapi-lint # Linter for openapi specifications to find errors quicker
code --install-extension mgmcdermott.vscode-language-babel # More modern JS syntax highlighting
code --install-extension ms-azuretools.vscode-docker # Docker syntax highlighting
code --install-extension mwpb.java-prettier-formatter # Allow using prettier on Java code
code --install-extension Pivotal.vscode-boot-dev-pack # Spring Boot extension pack
code --install-extension Pivotal.vscode-spring-boot # Spring Boot validation/syntax
code --install-extension redhat.java # Java syntax/code highlighting
code --install-extension redhat.vscode-commons # Needed for other redhat extensions
code --install-extension redhat.vscode-xml # XML syntax highlighting
code --install-extension redhat.vscode-yaml # YAML syntax highlighting
code --install-extension SonarSource.sonarlint-vscode # SonarLint warnings/errors in VS Code
code --install-extension streetsidesoftware.code-spell-checker # Warn for incorrectly spelled words
code --install-extension VisualStudioExptTeam.vscodeintellicode # More intelligent autocompletion
code --install-extension volkerdobler.insertnums # Easily insert a sequence of numbers
code --install-extension vscjava.vscode-java-dependency # Explore Java project dependencies
code --install-extension vscjava.vscode-java-pack # Set of java extensions
code --install-extension vscjava.vscode-java-test # Explore and test Java projects
code --install-extension vscjava.vscode-spring-boot-dashboard # Spring Boot helper plugin
code --install-extension vscjava.vscode-spring-initializr # Easily create new Spring Boot projects
code --install-extension wix.vscode-import-cost # Show size of JS/TS imports
code --install-extension wmaurer.change-case # Easily convert between lower case, camelCase, dash-case, etc
code --install-extension Wscats.eno # Better TS compilation/runnig
code --install-extension yzhang.markdown-all-in-one # Markdown tools/table of contents generator
code --install-extension ZainChen.json # JSON tree view
```

### Java

For Java support, you will need to install Eclipse (provides some code
intellisense features, even though we do not use it directly):

```sh
brew install --cask eclipse-java
```

To install Java 11 itself (the version we use), use:

```sh
brew install openjdk@11
```

Maven, the build tool, can be installed with (note that this is an improved version of normal
`maven` with improved colors, formatting, and benchmarking):

```sh
brew tap jcgay/jcgay
brew install maven-deluxe
brew unlink maven # Optional
brew link maven-deluxe
```

### Git Client

Git, used for version control, is very powerful and, unfortunately, the tools in
VS Code are not comprehensive. To make up this gap, I like
[Sublime Merge](https://sublimemerge.com/):

```sh
brew install --cask sublime-merge
```

This is a paid product, however, the free trial is unlimited.

### API Debugging

#### REST Client

For sending REST requests and analyzing an API, the client
[Insomnia](https://insomnia.rest) is very nice:

```sh
brew install --cask insomnia
```

#### Proxy

Sometimes, requests need to be intercepted and debugged in real time. This can
be done with a proxy.

Personally, I like [Charles](https://charlesproxy.com/), however, this is an
expensive paid product. I have heard good things about https://www.inproxy.io/,
however, have not used it myself.

#### cURL

cURL is a widely-used tool for sending HTTP requests. You can install it with:

```sh
brew install curl
```

### Node

Node (and NPM) is used for most all JavaScript/TypeScript development. Install
them with:

```sh
brew install node
```

With this, you can now install the following tools (used to enforce code style
and validate openapi):

```sh
npm install -g --save-dev prettier prettier-plugin-java @prettier/plugin-xml prettier-plugin-sql
```
