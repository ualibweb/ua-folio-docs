# Visual Studio Code Setup

_Last reviewed: October 2026_

- [Extensions](#extensions)
  - [Java Build/Intellisense](#java-buildintellisense)
    - [Extension Pack for Java](#extension-pack-for-java)
    - [Mustache](#mustache)
    - [Lombok Annotations Support](#lombok-annotations-support)
    - [openapi-lint](#openapi-lint)
  - [Frontend JS/TS](#frontend-jsts)
    - [ESLint](#eslint)
    - [HTML CSS Support](#html-css-support)
    - [Import Cost](#import-cost)
  - [Tools](#tools)
    - [Prettier](#prettier)
    - [Prettier ESLint](#prettier-eslint)
    - [Java Prettier Formatter](#java-prettier-formatter)
    - [Docker](#docker)
  - [Version Control](#version-control)
    - [Git History](#git-history)
    - [Git Graph](#git-graph)
  - [Testing/Quality](#testingquality)
    - [Coverage Gutters](#coverage-gutters)
    - [SonarQube for IDE (formerly SonarLint)](#sonarqube-for-ide-formerly-sonarlint)
    - [Code Spell Checker](#code-spell-checker)
    - [Cucumber (Gherkin) Full Support](#cucumber-gherkin-full-support)
    - [Karate Runner](#karate-runner)
    - [Jest](#jest)
  - [Misc. Languages](#misc-languages)
    - [Rainbow CSV](#rainbow-csv)
    - [YAML plus JSON](#yaml-plus-json)
    - [XML](#xml)
    - [YAML](#yaml)
  - [Other](#other)
    - [Better Comments](#better-comments)
    - [Overtype](#overtype)
    - [Selected Lines Count](#selected-lines-count)
    - [Word Count](#word-count)
    - [Insert Nums](#insert-nums)
    - [Change Case](#change-case)
  - [Optional and legacy extensions](#optional-and-legacy-extensions)
- [Configuration](#configuration)
  - [Formatting Options](#formatting-options)
  - [File Explorer Setup](#file-explorer-setup)
  - [Java Setup](#java-setup)
  - [Editor Configuration](#editor-configuration)
  - [Terminal Configuration](#terminal-configuration)
  - [Git Config](#git-config)
  - [SonarQube for IDE](#sonarqube-for-ide)
  - [Jest](#jest-1)
- [Other Customization](#other-customization)

Visual Studio Code (VS Code) is an extremely powerful text editor and, with the right extensions,
can offer functionality similar to a full-blown IDE (such as Eclipse or IntelliJ) in a much leaner
and customizable manner. **These are all opinionated configuration options, so if you have different
preferences, would prefer to not use some extensions, or anything else, feel free to do so. If you
find something you think everyone on the team should have, feel free to add it here.**

[Here](https://code.visualstudio.com/docs/introvideos/basics) is a quick guide to getting started
with VS Code -- it is similar to most other text editors and is designed to be heavily
user-friendly!

For your own reading, here is some documentation on how to use the builtin tools (included in the
[list of extensions below](#extensions)) to do things such as manage projects, refactor, test, etc.:
[Java](https://code.visualstudio.com/docs/java/java-tutorial),
[regular JavaScript](https://code.visualstudio.com/docs/nodejs/working-with-javascript), and
[TypeScript](https://code.visualstudio.com/docs/typescript/typescript-tutorial).

## Extensions

There are a large number of extensions we recommend installing, however, your uses may vary and
you may not need (or want) all of them. These are categorized and may be installed all at once by
running the install script from this folder:

- macOS/Linux (or Git Bash on Windows): `./install.sh`
- Windows PowerShell: `.\install.ps1` (if scripts are blocked, run
  `Set-ExecutionPolicy -Scope Process Bypass` first)

Both scripts need the `code` command on your PATH. If `code --version` doesn't work, see
[VS Code's command-line docs](https://code.visualstudio.com/docs/editor/command-line).

Here is the categorized list, with a description of what it does, why I like it, and any other
applicable notes.

### Java Build/Intellisense

These are the extensions that allow coding with ease in Java with the rest of FOLIO's ecosystem.

#### [Extension Pack for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)

```sh
code --install-extension vscjava.vscode-java-pack
```

This extension contains a number of extensions, all of which directly contribute to Java
development.

These are all of the tools installed:

- Intellisense for Java, allowing intelligent suggestions, formatting, refactoring, and more,
- A debugger, allowing easy debugging of Java code directly from the editor,
- A tool for analyzing and running tests,
- A tool for interacting with Maven, the build system for Java projects, and
- A project viewer within the file pane, making it easy to browse Java class packages

#### [Mustache](https://marketplace.visualstudio.com/items?itemName=dawhite.mustache)

```sh
code --install-extension dawhite.mustache
```

This package provides syntax highlighting for the Mustache language, which is what
`openapi-generator` templates are written in.

#### [Lombok Annotations Support](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-lombok)

```sh
code --install-extension vscjava.vscode-lombok
```

This adds support for the widely used [Lombok library](https://projectlombok.org/) directly from VS
Code.

#### [openapi-lint](https://marketplace.visualstudio.com/items?itemName=mermade.openapi-lint)

```sh
code --install-extension mermade.openapi-lint
```

This allows the linting of OpenAPI documents, preventing simple and time-consuming errors.

<!-- This causes problems and gets in the way -->
<!-- #### [Spring Boot Extension Pack](https://marketplace.visualstudio.com/items?itemName=Pivotal.vscode-boot-dev-pack)

```sh
code --install-extension Pivotal.vscode-boot-dev-pack
```

This package adds intelligent Spring Boot support to VS Code, allowing better autocompletion,
documentation, and intelligent syntax highlighting on Spring Boot-specific files. -->

### Frontend JS/TS

These tools make it easier to write code for JavaScript and TypeScript. There's not too much here,
as VS Code comes with great support for these languages.

#### [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

```sh
code --install-extension dbaeumer.vscode-eslint
```

Easily lint your code and see problems within the editor.

#### [HTML CSS Support](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css)

```sh
code --install-extension ecmel.vscode-html-css
```

This package provides intellisense for CSS information within HTML (for example, auto-completing
class names, IDs, etc.)

#### [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)

```sh
code --install-extension wix.vscode-import-cost
```

This will show the sizes of each import added to code, to encourage slimmer builds.

### Tools

These are tools to make it easier to interact with other, external tools.

#### [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

```sh
code --install-extension esbenp.prettier-vscode
```

This allows using the [Prettier](https://prettier.io/) code formatter from within VS Code.

#### [Prettier ESLint](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint)

```sh
code --install-extension rvest.vs-code-prettier-eslint
```

This is similar to the above Prettier extension, but after formatting it runs ESLint (to ensure
single/double quotes and other standards are respected).

#### [Java Prettier Formatter](https://marketplace.visualstudio.com/items?itemName=mwpb.java-prettier-formatter)

```sh
code --install-extension mwpb.java-prettier-formatter
```

The default Prettier extension unfortunately does not support Java, so this extension is required.
**(verify: check that it's still maintained before relying on it.)**

#### [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)

```sh
code --install-extension ms-azuretools.vscode-docker
```

This allows interacting with Docker from within VS Code. Also notable is the inclusion of syntax
highlighting/intellisense for Docker configuration files.

### Version Control

Most of the Git work is done with an external tool, such as GitKraken or Sublime Merge. However, it
is always handy to have that information as close as possible to the editor, and these extensions
help with that.

#### [Git History](https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory)

```sh
code --install-extension donjayamanne.githistory
```

This tool allows viewing Git file/line history from within the editor, making it easy to track down
the source of a certain change or line.

#### [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)

```sh
code --install-extension mhutchie.git-graph
```

This tool shows a graph of the commit tree for the current project.

### Testing/Quality

Code quality is extremely important -- here are some of the extensions I use to ensure a high
standard is met.

#### [Coverage Gutters](https://marketplace.visualstudio.com/items?itemName=ryanluker.vscode-coverage-gutters)

```sh
code --install-extension ryanluker.vscode-coverage-gutters
```

This will take code coverage results, as produced from an external testing tool, and show what is
and is not covered in the sidebar (gutter).

#### [SonarQube for IDE (formerly SonarLint)](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)

```sh
code --install-extension SonarSource.sonarlint-vscode
```

SonarQube for IDE (renamed from SonarLint; the extension ID is unchanged) maintains a large list of
rules to keep code bug-free and maintainable.

You can connect it to UA's rulesets in SonarQube Cloud (formerly SonarCloud): open the command
palette (`Cmd`/`Ctrl` + `Shift` + `P`), search for "SonarQube Cloud" and choose the command to add
a connection, then update the project bindings to load UA's rules. Command names have changed with
the rename, so search for "connection" if you don't find it. For more information, you can view the full
[Java](https://sonarcloud.io/organizations/ualibweb/rules?activation=true&qprofile=AYgnZwN72OQqzs1gKQbL)
and
[TypeScript](https://sonarcloud.io/organizations/ualibweb/rules?activation=true&qprofile=AYgnb4h4mOVlLpmQaCd8)
rulesets.

#### [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

```sh
code --install-extension streetsidesoftware.code-spell-checker
```

It is surprisingly easy to make typos when writing code, due to autocompletion's reinforcement of
typos and the monospace font. This extension acts as a spell checker to ensure all your writing
makes sense!

#### [Cucumber (Gherkin) Full Support](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete)

```sh
code --install-extension alexkrechik.cucumberautocomplete
```

This adds syntax highlighting and some other rich language feature support to VS Code for the
Cucumber testing framework.

#### [Karate Runner](https://marketplace.visualstudio.com/items?itemName=kirkslota.karate-runner)

```sh
code --install-extension kirkslota.karate-runner
```

This allows running Karate (a framework used for integration/smoke tests) directly from VS Code.

#### [Jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)

```sh
code --install-extension Orta.vscode-jest
```

This allows running Jest tests directly from VS Code.

### Misc. Languages

There are a good few languages used other than the ones mentioned above, even if only in a minor
capacity. These packages provide support and additional features for them:

#### [Rainbow CSV](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv)

```sh
code --install-extension mechatroner.rainbow-csv
```

This package will show CSV files with each column as a different color, making it easy to follow
columns despite the format.

#### [YAML plus JSON](https://marketplace.visualstudio.com/items?itemName=hilleer.yaml-plus-json)

```sh
code --install-extension hilleer.yaml-plus-json
```

This extension allows easy conversion between YAML and JSON (and vice versa), a surprisingly common
task.

#### [XML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-xml)

```sh
code --install-extension redhat.vscode-xml
```

This package provides excellent XML support, allowing intelligent completion as well as validation
against any specifications provided within the document.

#### [YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)

```sh
code --install-extension redhat.vscode-yaml
```

This provides improved support for YAML within VS Code.

### Other

These are packages that fit in no other category, however, are useful nonetheless!

#### [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)

```sh
code --install-extension aaron-bond.better-comments
```

This will highlight comments with things such as `TODO`, `FIXME`, etc in a different color to make
them more noticeable.

#### [Overtype](https://marketplace.visualstudio.com/items?itemName=adammaras.overtype)

```sh
code --install-extension adammaras.overtype
```

This allows the use of the Insert key to type over text, rather than inserting characters in the
normal method. By default, VS Code ignores this key.

#### [Selected Lines Count](https://marketplace.visualstudio.com/items?itemName=gurumukhi.selected-lines-count)

```sh
code --install-extension gurumukhi.selected-lines-count
```

By default, VS Code will only show the number of characters currently selected -- this provides a
count of lines as well.

#### [Word Count](https://marketplace.visualstudio.com/items?itemName=ms-vscode.wordcount)

```sh
code --install-extension ms-vscode.wordcount
```

This will show a total lexicographical word count of the current file.

#### [Insert Nums](https://marketplace.visualstudio.com/items?itemName=volkerdobler.insertnums)

```sh
code --install-extension volkerdobler.insertnums
```

This extension allows inserting sequential numbers with ease.

#### [Change Case](https://marketplace.visualstudio.com/items?itemName=wmaurer.change-case)

```sh
code --install-extension wmaurer.change-case
```

This package allows conversion between UPPER CASE, snake_case, camelCase, etc., all with a simple
command.

### Optional and legacy extensions

These were previously recommended but are no longer installed by default. Install them only if you
need them:

- [RAML](https://marketplace.visualstudio.com/items?itemName=blzjns.vscode-raml)
  (`blzjns.vscode-raml`): syntax highlighting for RAML, used by older RMB-based backend modules.
- [Vagrant](https://marketplace.visualstudio.com/items?itemName=bbenoist.vagrant)
  (`bbenoist.vagrant`): only useful with the [legacy Vagrant setup](../Vagrant/README.md).
- Babel JavaScript and React PropTypes Intellisense: removed, since VS Code's built-in
  JavaScript/TypeScript support and TypeScript types cover what they did.

## Configuration

VS Code has a _lot_ of customization options -- here are the ones I recommend, and why.

To access your settings, press `Cmd` + `,` (macOS) or `Ctrl` + `,` (Windows/Linux). Some may only be
editable as JSON (and it is often easier to bulk import them this way). To access the JSON settings
file, use the command palette (`Cmd`/`Ctrl` + `Shift` + `P`) and search for "Open User Settings
(JSON)". You can easily find any
of these settings in the main UI by searching for the key (the part in parentheses below).

All of these settings are provided in [`settings.json`](settings.json) and may be copied over if so
desired.

### Formatting Options

Setup our formatter:

- Default Formatter (`editor.defaultFormatter`): Use the Prettier formatter
  `"esbenp.prettier-vscode"`,
- Prettier Prose Wrap (`prettier.proseWrap`): Always wrap lines to the appropriate length
  `"always"`, and
- Resolve Global Modules (`prettier.resolveGlobalModules`): Allow the usage of non-default Prettier
  modules (for other languages) `true`.

Ensure our formatting specifications are always met:

- Format on Paste (`editor.formatOnPaste`): `false`,
- Format on Save (`editor.formatOnSave`): `true`,
- Tab Size (`editor.tabSize`): 2 (FOLIO standard),
- Insert a newline at the end of every file (`files.insertFinalNewline`): `true`,
- Trim extra newlines at the end of every file (`files.trimFinalNewlines`): `true`, and
- Remove extra whitespace from the end of lines (`files.trimTrailingWhitespace`): `true`.

Enforce the use of Prettier where needed (note that this _must_ be put into the JSON manually):

```json
"[java]": { "editor.defaultFormatter": "mwpb.java-prettier-formatter" },
"[javascript]": { "editor.defaultFormatter": "rvest.vs-code-prettier-eslint" },
"[typescript]": { "editor.defaultFormatter": "rvest.vs-code-prettier-eslint" },
"[json]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
```

### File Explorer Setup

Treat `.sample` files as JSON (used this way in some FOLIO modules):

- File Associations (`files.associations`): `"*.sample": "json"`.

Show Eclipse-generated classpath and settings files (these are generated by Intellisense, too, and
sometimes need to be modified/debugged):

- File Excludes (`files.exclude`):
  - `"**/.classpath": false`,
  - `"**/.factorypath": true`,
  - `"**/.project": false`,
  - `"**/.settings": true`, and
  - `"node_modules": true`.

By default, VS Code requires confirmation for deleting or drag-and-dropping files within the editor.
If you like to use dangerously (although Git alleviates most risks), this will remove this
confirmation popup:

- Confirm Delete (`explorer.confirmDelete`): `false` and
- Confirm Drag and Drop (`explorer.confirmDragAndDrop`): `false`.

By default, the builtin Git support will color and add icons to all the files in your explorer
depending on if they were changed/added/etc. I personally find this confusing and obnoxious, so they
can be disabled with:

- Git: Decorations (`git.decorations.enabled`): `false`.

### Java Setup

Hopefully, VS Code will recognize your JDK out of the box. Furthermore, the Lombok extension should
remove the headache often caused with installing that. Therefore, everything _should_ just work with
no configuration.

### Editor Configuration

By default, a welcome message displays on every new file. This can be hidden with:

- Untitled Hint (`workbench.editor.untitled.hint`): `"hidden"`.

### Terminal Configuration

To allow hotkeys in your shell (and avoid them being sent to the editor instead), use the following:

- Allow Chords (`terminal.integrated.allowChords`): `false` and
- Send Keybindings to Shell (`terminal.integrated.sendKeybindingsToShell`): `true`.

### Git Config

Most Git functionality is outside of VS Code, however, I like these options to keep Git up to date:

- Auto Fetch (`git.autofetch`): to periodically fetch remotes (not changing local, just syncing)
  `true` and
- Confirm Sync (`git.confirmSync`): to bypass the confirmation when pushing, `false`.

### SonarQube for IDE

Rules need to be loaded from UA's SonarQube Cloud organization; see
[above](#sonarqube-for-ide-formerly-sonarlint) for how to connect.

### Jest

By default, the Jest extension is very eager about when it runs tests. In large workspaces this can
make VS Code nearly unusable, especially at launch.

- Jest: Run Mode (`jest.runMode`) should be set to `{ "type": "on-save", "testFileOnly": true }` in
  the settings JSON, so only the test file you save is run. (Older versions of the extension used
  `jest.autoRun` for this; it has been replaced.)

## Other Customization

Of course, this is only an opinionated list of extensions for development -- there are many, many
others out there to suit your development style. If you would like to change the theme/color scheme,
you can easily do so with
[these instructions](https://code.visualstudio.com/docs/getstarted/themes).
