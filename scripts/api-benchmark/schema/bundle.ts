import parser from "@apidevtools/json-schema-ref-parser";

async function run(): Promise<void> {
  const schema = await parser.bundle(__dirname + "/base.json");
  console.log(JSON.stringify(schema));
}

run();