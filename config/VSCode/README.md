# Visual Studio Code Setup

Visual Studio Code (VS Code) is an extremely powerful text editor and, with the right extensions,
can offer functionality similar to a full-blown IDE (such as Eclipse or IntelliJ) in a much leaner
and customizable manner.

[Here](https://code.visualstudio.com/docs/introvideos/basics) is a quick guide to getting started
with VS Code -- it is similar to most other text editors and is designed to be heavily
user-friendly!

For your own reading, here is some documentation on how to use the builtin tools (included in the
[list of extensions below](#extensions)) to do things such as manage projects, refactor, test, etc.:
[Java](https://code.visualstudio.com/docs/java/java-tutorial),
[regular JavaScript](https://code.visualstudio.com/docs/nodejs/working-with-javascript), and
[TypeScript](https://code.visualstudio.com/docs/typescript/typescript-tutorial).

## Extensions

There are a large number of extensions which I recommend installing, however, your uses may vary and
you may not need (or want) all of them. These are categorized and may be installed by executing
`./install.sh` from this folder in your terminal.

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

#### [RAML](https://marketplace.visualstudio.com/items?itemName=blzjns.vscode-raml)

```sh
code --install-extension blzjns.vscode-raml
```

This package adds support for RAML and provides syntax highlighting when viewing it. Although we do
not directly write RAML, it is useful when analyzing existing code.

#### [Mustache](https://marketplace.visualstudio.com/items?itemName=dawhite.mustache)

```sh
code --install-extension dawhite.mustache
```

This package provides syntax highlighting for the Mustache language, which is what
`openapi-generator` templates are written in.

#### [Lombok Annotations Support](https://marketplace.visualstudio.com/items?itemName=GabrielBB.vscode-lombok)

```sh
code --install-extension GabrielBB.vscode-lombok
```

This adds support for the widely used [Lombok library](https://projectlombok.org/) directly from VS
Code.

#### [openapi-lint](https://marketplace.visualstudio.com/items?itemName=mermade.openapi-lint)

```sh
code --install-extension mermade.openapi-lint
```

This allows the linting of OpenAPI documents, preventing simple and time-consuming errors.

#### [Spring Boot Extension Pack](https://marketplace.visualstudio.com/items?itemName=Pivotal.vscode-boot-dev-pack)

```sh
code --install-extension Pivotal.vscode-boot-dev-pack
```

This package adds intelligent Spring Boot support to VS Code, allowing better autocompletion,
documentation, and intelligent syntax highlighting on Spring Boot-specific files.

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

#### [Babel JavaScript](https://marketplace.visualstudio.com/items?itemName=mgmcdermott.vscode-language-babel)

```sh
code --install-extension mgmcdermott.vscode-language-babel
```

This package improves JS/TS syntax highlighting and supports modern esnext features.

#### [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)

```sh
code --install-extension wix.vscode-import-cost
```

This will show the sizes of each import added to code, to encourage slimmer builds.

#### [React PropTypes Intellisense](https://marketplace.visualstudio.com/items?itemName=OfHumanBondage.react-proptypes-intellisense)

```sh
code --install-extension OfHumanBondage.react-proptypes-intellisense
```

This allows Intellisense of PropTypes in React (as well as applicable docblocks)

### Tools

These are tools to make it easier to interact with other, external tools.

#### [Vagrant](https://marketplace.visualstudio.com/items?itemName=bbenoist.vagrant)

```sh
code --install-extension bbenoist.vagrant
```

This package allows controlling Vagrant boxes from within VS Code, preventing the use of a Terminal
to start/stop boxes.

#### [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

```sh
code --install-extension esbenp.prettier-vscode
```

This allows using the [Prettier](https://prettier.io/) code formatter from within VS Code.

#### [Prettier ESLint](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint)

```sh
code --install-extensions rvest.vs-code-prettier-eslint
```

This is similar to the above Prettier extension, but after formatting it runs ESLint (to ensure
single/double quotes and other standards are respected).

#### [Java Prettier Formatter](https://marketplace.visualstudio.com/items?itemName=mwpb.java-prettier-formatter)

```sh
code --install-extension mwpb.java-prettier-formatter
```

The default Prettier extension unfortunately does not support Java, so this extension is required.

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

#### [SonarLint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)

```sh
code --install-extension SonarSource.sonarlint-vscode
```

SonarLint maintains a large list of special rules to ensure code is bug-free and easily
maintainable. For our current list of rules, see [the style guide](../../docs/style/README.md).

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

## Configuration

VS Code has a _lot_ of customization options -- here are the ones I recommend, and why.

To access your settings, press `Cmd` + `,` (command and comma). Some may only be editable as JSON
(and it is often easier to bulk import them this way) -- to access the JSON settings file, use the
command pallette (`Cmd` + `Shift` + `P`) and search for "Settings (JSON)". You can easily find any
of these settings in the main UI by searching for the key (the part in parentheses below).

All of these settings are provided in [`settings.json`](settings.json) and may be copied over if so
desired.

### Formatting Options

Setup our formatter:

- Default Formatter (`editor.defaultFormatter`): Use the Prettier formatter
  `"esbenp.prettier-vscode"`,
- Prettier Path (`prettier.prettierPath`): By default, Prettier is installed at
  `"/usr/local/lib/node_modules/prettier"` so this should not be changed,
- Prettier Prose Wrap (`prettier.proseWrap`): Always wrap lines to the appropriate length
  `"always"`, and
- Resolve Global Modules (`prettier.resolveGlobalModules`): Allow the usage of non-default Prettier
  modules (for other languages) `true`.

Ensure our formatting specifications are always met:

- Format on Paste (`editor.formatOnPaste`): `true`,
- Format on Save (`editor.formatOnSave`): `true`,
- Tab Size (`editor.tabSize`): 2 (FOLIO standard),
- Insert a newline at the end of every file (`editor.insertFinalNewline`): `true`,
- Trim extra newlines at the end of every file (`editor.trimFinalNewlines`): `true`, and
- Remove extra whitespace from the end of lines (`editor.trimTrailingWhitespace`): `true`.

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

### SonarLint

SonarLint rules need to be added (`sonarlint.rules`) -- see the
[style guide](../../docs/style/README.md) for the full list of rules to enable.

### Jest

By default, Jest uses an extremely over-eager method for deciding when to when tests.  This causes
most workspaces to become nearly unusable, especially at launch, due to the frequency and volume of
tests.

- Jest: Auto Run (`jest.autoRun`) should be set to `{ "watch": false, "onSave": "test-src-file" }` in the settings JSON

## Other Customization

Of course, this is only an opinionated list of extensions for development -- there are many, many
others out there to suit your development style. If you would like to change the theme/color scheme,
you can easily do so with
[these instructions](https://code.visualstudio.com/docs/getstarted/themes).
