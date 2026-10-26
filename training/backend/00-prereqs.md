# Backend Training — Prerequisites

_Last reviewed: October 2026_

## Objective

After completing this section, you should have everything necessary installed and
`folio-training-backend` ready for use.

> `folio-training-backend` is a small sample FOLIO module (a book storage API). It uses Spring Boot
> 3.0, while current FOLIO modules (the Trillium release) use Spring Boot 4, but it builds and runs on
> Java 21, and everything these lessons teach applies to real FOLIO modules.

## Deliverables

A working IDE environment, with the sample module running locally.

## Steps

First, make sure you've finished [onboarding](../00-onboarding.md),
[common installs](../01-common-installs.md), and read the [Git workflow](../02-git-workflow.md).

1. Download and install:

   - [OpenJDK 21](https://adoptium.net/temurin/releases/?version=21) (Eclipse Temurin). FOLIO's
     Trillium release requires **Java 21**. Choose the `.pkg` (macOS) or `.msi` (Windows) installer
     if several options are offered; on Windows, enable the "Set JAVA_HOME" option in the installer.
     You can also use `brew install --cask temurin@21` (macOS) or
     `winget install EclipseAdoptium.Temurin.21.JDK` (Windows). The winget install doesn't set
     `JAVA_HOME`; if `echo $env:JAVA_HOME` prints nothing afterwards, set it in PowerShell with:

     ```powershell
     $jdk = (Get-ChildItem 'C:\Program Files\Eclipse Adoptium' -Directory | Where-Object Name -like 'jdk-21*' | Select-Object -First 1).FullName
     [Environment]::SetEnvironmentVariable('JAVA_HOME', $jdk, 'User')
     ```

   - [Docker Desktop](https://www.docker.com/products/docker-desktop/). The sample module's
     integration tests start a temporary PostgreSQL database in Docker, so Docker must be **running**
     whenever you run tests. On Windows, Docker Desktop uses WSL 2; if the installer asks to enable or
     update it, say yes and restart when prompted.
   - [PostgreSQL 16](https://www.postgresql.org/download/), the version FOLIO supports. You can
     install it natively, or run it in Docker instead (see the Postgres step below), which avoids
     PATH problems on Windows.
   - A database client, such as [DBeaver](https://dbeaver.io/) (it's ugly, but works well)
   - Apache Maven 3.8 or later, the build tool for Java projects:

     - macOS: `brew install maven`.
     - Windows: Maven is a ZIP file you unpack and add to your PATH. This PowerShell block does it
       for you (no administrator rights needed):

       ```powershell
       $mavenVersion = '3.9.9'
       $tools = Join-Path $env:USERPROFILE 'tools'
       New-Item -ItemType Directory -Force $tools | Out-Null
       $zip = Join-Path $env:TEMP "apache-maven-$mavenVersion-bin.zip"
       Invoke-WebRequest "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip" -OutFile $zip
       Expand-Archive $zip -DestinationPath $tools -Force
       Remove-Item $zip
       $mavenBin = Join-Path $tools "apache-maven-$mavenVersion\bin"
       $userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
       if ($userPath -notlike "*$mavenBin*") { [Environment]::SetEnvironmentVariable('Path', "$userPath;$mavenBin", 'User') }
       ```

       If you already use Chocolatey, `choco install maven` (in an administrator PowerShell) works
       too.

     **Close and reopen your terminal**, then check that `java --version` shows 21 and `mvn -v`
     shows Maven 3.8 or later running on Java 21.

1. It may be a good idea to reboot after this point, to ensure everything is fully installed
1. Now, you should be able to get started with our example code. Open up your terminal in a
   directory of your choice (I recommend creating a folder to contain all your FOLIO repositories,
   but you can use anywhere) and run the following:

   - `git clone git@github.com:ualibweb/folio-training-backend.git`

     This will download the repository from GitHub -- if you setup SSH authentication for GitHub,
     this will also allow you to seamlessly commit and push changes. If you are not using SSH
     authentication (not recommended), use `https://github.com/ualibweb/folio-training-backend.git`
     instead.

     Now, `cd` into the folder and:

   - `mvn test`

     This builds the module and runs its tests, checking that everything works on your machine. The
     first run downloads a lot (dependencies and a PostgreSQL image) and can take 5-10 minutes; it
     should end with `BUILD SUCCESS`. The tests start their own database in Docker, so you don't
     need to set up PostgreSQL for this step. If it fails:

     - `'mvn' is not recognized` / `'java' is not recognized`: open a new terminal; if that doesn't
       help, revisit the install steps above.
     - "Could not find a valid Docker environment", or "Unable to determine Dialect without JDBC
       metadata": Docker Desktop isn't running. Start it, wait until it says it's running, and try
       again.
     - `Unresolved compilation problems` (often about `BookDTO` or `BooksApi`): VS Code compiled
       the project at the same time as Maven. Close VS Code and run `mvn clean test` again. If VS Code
       shows errors about those classes when you reopen it, run `mvn generate-sources`.
     - Still stuck? Ask in `#bama`, and include the last 40 or so lines of the output.

   - Create your base branch, as described in
     [Git workflow → Your base branch](../02-git-workflow.md#your-base-branch-training-only):

     ```sh
     git switch -c <username>-base
     git push -u origin <username>-base
     ```

1. Now that your local repository is setup, let's get your environment ready. First, open the
   `folio-training-backend` folder in VS Code.
   - Upon opening it, you should see a popup in the bottom-right saying "Opening Java Projects", and
     eventually the status bar should show `{} Java` to indicate that everything is ready
   - If you get any errors at this stage, be sure to resolve those before continuing. This is most
     likely an issue with your JVM configuration; ensure that the appropriate JDK is installed. You
     should be able to run `java --version` from the command line and see OpenJDK 21.
1. Once you've gotten it open, try opening
   `src/main/java/org/folio/sample/controller/BookController.java`. You should be able to hover over
   classes, variables, and methods to see information about them -- if you do, then everything is
   setup and intellisense is working! 🎉
1. Now, set up PostgreSQL, the database server used by FOLIO modules. You need a `folio_admin`
   user and an `okapi_modules` database. (The database name is historical, from the Okapi era; it's
   still what the sample module expects.)

   **Option 1: Docker (easiest, especially on Windows).** This starts PostgreSQL 16 with the user and
   database already created:

   ```sh
   docker run --name folio-postgres -d -p 5432:5432 \
     -e POSTGRES_USER=folio_admin -e POSTGRES_PASSWORD=folio_admin -e POSTGRES_DB=okapi_modules \
     postgres:16
   ```

   Later, start it again with `docker start folio-postgres`. If you use this option, skip to the
   next step. If you also have a native PostgreSQL installed, it's probably already using port 5432;
   stop it, or use Option 2 instead.

   **Option 2: Native install.**

   1. To access the Postgres console, run `psql` from your terminal (if you get an error about a
      database not existing, use `psql postgres`). On Windows, if `psql` isn't found, use the "SQL
      Shell (psql)" app from the Start menu, or add PostgreSQL's `bin` folder to your PATH.
   1. Use the following command to create a default `folio_admin` user:

      ```sql
      CREATE USER
        folio_admin
      WITH
        PASSWORD 'folio_admin' SUPERUSER;
      ```

   1. Then, create the database:

      ```sql
      CREATE DATABASE
        okapi_modules;
      ```

   1. Now, postgres should be all setup! To test it, use the following (and enter password
      `folio_admin` when prompted):

      ```sh
      psql -U folio_admin -W okapi_modules
      ```

1. Now that everything is ready, one last step remains: telling the module about your database. In
   real deployments, the platform supplies this configuration (see [Eureka](../../docs/Eureka.md);
   formerly [Okapi](../../docs/Okapi.md)), with settings described in the module's descriptors. For
   local development, we use simple environment variables.

   1. The repository includes a template, `.env.sample`. Copy it to a file called `.env` in the
      root `folio-training-backend` directory:

      ```sh
      cp .env.sample .env
      ```

      (In PowerShell: `Copy-Item .env.sample .env`.) `.env` is ignored by Git, so your local
      settings are never committed.

   1. It already contains the settings that match the PostgreSQL setup above:

      ```ini
      DB_HOST=localhost
      DB_PORT=5432
      DB_USERNAME=folio_admin
      DB_PASSWORD=folio_admin
      DB_DATABASE=okapi_modules
      ```

1. After all this, you should be able to run the sample module! From the left sidebar, click the
   triangle icon to bring up the "Run and Debug" view; then, choose "Run API Server" at the top and
   click the triangle to start running.

   - After a few moments, the log should start to appear -- once you see
     `Started Application in #### seconds`, the application is running!

   - Run the following in your shell to initialize the application for the `diku` tenant:

     ```sh
     curl --request POST \
       --url http://localhost:8081/_/tenant \
       --header 'x-okapi-tenant: diku' \
       --header 'Content-Type: application/json' \
       --data '{"module_to":"mod-training-sample"}'
     ```

     _`x-okapi-tenant` is a header passed through FOLIO's backend saying which **tenant** a request
     belongs to (one installation can serve several libraries or universities, each a "tenant").
     Without it, the module rejects the request, since it doesn't know which tenant's data to use.
     The header kept its `okapi` name on the Eureka platform, so it's still correct today._

     _In a real deployment, the platform calls `/_/tenant` when a module is enabled for a tenant;
     locally, we call it ourselves._

     > **Windows:** these multi-line commands use Bash syntax. Run them in **Git Bash**, or paste them
     > into your REST client. In PowerShell, `curl` is an alias for a different command and `\` line
     > continuations don't work; if you must use PowerShell, type `curl.exe` and put the command on
     > one line.

   - Feel free to experiment with other requests, in your REST client or with `curl`. This module is a
     very basic book storage application.

     - Example: create a book

       ```sh
       curl --request POST \
         --url http://localhost:8081/books \
         --header 'x-okapi-tenant: diku' \
         --header 'Content-Type: application/json' \
         --data '{"name":"My cool book", "publishedDate":"2000-01-01"}'
       ```

     - Example: get all books

       ```sh
       curl --request GET \
         --url http://localhost:8081/books \
         --header 'x-okapi-tenant: diku'
       ```

1. Now that everything is up and running, you're ready to move on to writing code! See the next
   section, [01-openapi](01-openapi.md).
