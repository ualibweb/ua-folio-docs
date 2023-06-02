# Backend Training — Prerequisites

## Objective

After completing this section, you should have everything necessary installed and
`folio-training-backend` ready for use.

## Deliverables

A working IDE environment, with the sample module running locally.

## Steps

First, be sure you have accounts created/access to the necessary repositories as specified in the
[onboarding document](../00-onboarding.md).

1. Download and install:

   - [OpenJDK](https://adoptium.net/temurin/releases/?version=17). Be sure to get version 17 or
     higher (and choose the `.pkg` or `.msi`, if multiple options are available for your OS)
   - [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - [PostgreSQL](https://www.postgresql.org/download/)
   - A database client, I recommend [DBeaver](https://dbeaver.io/) (it's ugly, but it works well)
   - Apache Maven. You can [install this manually](https://maven.apache.org/install.html), however,
     it requires a lot of path manipulation and configuration -- it is not for the faint of heart.
     There are easier ways:

     - Windows: `choco install maven`.

     - Mac: `brew install maven`.

     If everything succeeds, you should be able to run `mvn -v` (be sure the Java version is at
     least 17)! Please note, you may need to restart your shell for this to work.

1. It may be a good idea to reboot after this point, to ensure everything is fully installed
1. Now, you should be able to get started with our example code. Open up your terminal in a
   directory of your choice (I recommend creating a folder to contain all your FOLIO repositories,
   but you can use anywhere) and run the following:

   - `git clone git@github.com:ualibweb/folio-training-backend.git`

     This will download the repository from GitHub -- if you setup SSH authentication for GitHub,
     this will also allow you to seamlessly commit and push changes. If you are not using SSH
     authentication (not recommended), use `https://github.com/ualibweb/folio-training-backend.git`
     instead.

   - `mvn test`

     This will ensure that everything is working on your local machine. If this fails, ensure you
     have: Maven, Java (17 or higher), and Docker (running).

   - `git checkout -b your-name-or-username-master`

     This will create a new branch, `your-name-or-username-master`, for you to base your changes off
     of. Normally we would use the primary `master`, however, for demonstration purposes we'll use
     this branch as the basis for your changes.

   - `git push origin`

     This will push your new branch to GitHub; you should see something like:

     ```
     Total 0 (delta 0), reused 0 (delta 0), pack-reused 0
     remote:
     remote: Create a pull request for 'ncovercash-master' on GitHub by visiting:
     remote:      https://github.com/ualibweb/folio-training-backend/pull/new/ncovercash-master
     remote:
     To github.com:ualibweb/folio-training-backend
      * [new branch]      ncovercash-master -> ncovercash-master
     ```

1. Now that your local repository is setup, let's get your environment ready. First, open the
   `folio-training-backend` folder in VS Code.
   - Upon opening it, you should a popup in the bottom-right saying "Opening Java Projects", and
     eventually the status bar should show `{} Java` to indicate that everything is ready
   - If you get any errors at this stage, be sure to resolve those before continuing. This is most
     likely an issue with your JVM configuration; ensure that the appropriate JDK is installed. You
     should be able to run `java --version` from the command line and see OpenJDK 17 or later.
1. Once you've gotten it open, try opening
   `src/main/java/org/folio/sample/controller/BookController.java`. You should be able to hover over
   classes, variables, and methods to see information about them -- if you do, then everything is
   setup and intellisense is working! :tada:
1. Now, you'll need to setup Postgres. Postgres is the database server used by FOLIO modules, and
   we'll need to create the initial user and database:

   1. To access the Postgres console, run `psql` from your terminal (if you get an error about a
      database not existing, use `psql postgres`)
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
      psql --user folio_admin --pass okapi_modules
      ```

1. Now that everything is ready, one last step remains -- telling VS Code about your database
   configuration! In real deployments, FOLIO has a whole system for managing this called Okapi (and
   its configuration is defined in "module descriptors"), however, when locally developing, we'll
   use simple environment variables.

   1. First, create the file to hold the environment variables. This file should be called `.env`
      and exist in the root `folio-training-backend` directory
   1. Then, put the following contents:

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

   - Run the following in your shell to initialize the application:

     ```sh
     curl --request POST \
       --url http://localhost:8081/_/tenant \
       --header 'x-okapi-tenant: diku' \
       --data '{"module_to":"sample"}'
     ```

     _`x-okapi-tenant` is a header passed through FOLIO's backend, indicating what "tenant" this
     request came from (installations can run multiple libraries/universities, called "tenants").
     Without this header, the module will not accept the request, since it won't know what
     installation/databases to use._

   - If you would like to experiment with these more, feel free to try some other requests (I
     recommend in Insomnia). This module currently is a very basic book storage application.

     - Example: create a book

       ```sh
       curl --request POST \
         --url http://localhost:8081/books \
         --header 'x-okapi-tenant: diku' \
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
