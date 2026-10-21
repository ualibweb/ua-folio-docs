# Installs the recommended VS Code extensions on Windows. See README.md for what each one does.
# Run from this folder: .\install.ps1
# If scripts are blocked: Set-ExecutionPolicy -Scope Process Bypass

$ErrorActionPreference = "Continue"

if (-not (Get-Command code -ErrorAction SilentlyContinue)) {
  Write-Error "The code command was not found. Reinstall VS Code with Add to PATH checked, then restart your terminal."
  exit 1
}

$extensions = @(
  "vscjava.vscode-java-pack"
  "dawhite.mustache"
  "vscjava.vscode-lombok"
  "mermade.openapi-lint"
  "dbaeumer.vscode-eslint"
  "ecmel.vscode-html-css"
  "wix.vscode-import-cost"
  "esbenp.prettier-vscode"
  "rvest.vs-code-prettier-eslint"
  "mwpb.java-prettier-formatter"
  "ms-azuretools.vscode-docker"
  "donjayamanne.githistory"
  "mhutchie.git-graph"
  "ryanluker.vscode-coverage-gutters"
  "SonarSource.sonarlint-vscode"
  "streetsidesoftware.code-spell-checker"
  "alexkrechik.cucumberautocomplete"
  "kirkslota.karate-runner"
  "Orta.vscode-jest"
  "mechatroner.rainbow-csv"
  "hilleer.yaml-plus-json"
  "redhat.vscode-xml"
  "redhat.vscode-yaml"
  "aaron-bond.better-comments"
  "adammaras.overtype"
  "gurumukhi.selected-lines-count"
  "ms-vscode.wordcount"
  "volkerdobler.insertnums"
  "wmaurer.change-case"
)

foreach ($extension in $extensions) {
  code --install-extension $extension
}

# Optional/legacy (see README.md):
# code --install-extension blzjns.vscode-raml
# code --install-extension bbenoist.vagrant
