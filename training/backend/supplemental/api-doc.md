# Using `api-doc`

## Objective

After completing this section, you should be able to use
[`api-doc`](https://github.com/folio-org/folio-tools/tree/master/api-doc) to generate OpenAPI
documentation, like we see for
[mod-calendar](https://s3.amazonaws.com/foliodocs/api/mod-calendar/s/calendar.html).

## Deliverables

- Pretty HTML documentation for your OpenAPI spec

## Notes

Both Python and Node are required to use this tool.

This is the tool I use to make documentation for https://ualibweb.github.io/ua-folio-docs; it makes
a great reference for when we're developing modules. FOLIO uses this for their
[API documentation](https://dev.folio.org/reference/api/) as a whole, too (OpenAPI ones are for ones
labeled "view-4").

## Steps

1. First, clone [`folio-tools`](https://github.com/folio-org/folio-tools) somewhere convenient
   (**not in `folio-training-backend`**):

   ```sh
   git clone git@github.com:folio-org/folio-tools.git
   ```

1. `cd` into `folio-tools/api-doc`.
1. Install the Python (3) portion of the tool:

   ```sh
   # one of these should work...
   python3 -m pip install -r requirements.txt
   python -m pip install -r requirements.txt
   pip3 install -r requirements.txt
   pip install -r requirements.txt
   ```

1. Install the Node portion of the tool (if you do not have `node`/`npm` installed, install it
   first):

   ```sh
   npm install
   ```

1. Now, cd back into your module and run:

   ```sh
   ~/absolute/path/to/folio-tools/api-doc/api_doc.py -d src/main/resources/api/ -t OAS -o docs
   ```

1. You should now have a `docs` folder inside `folio-training-backend` with a
   `folio-training-backend/index.html` — opening this in a browser should display the pretty API
   docs!
