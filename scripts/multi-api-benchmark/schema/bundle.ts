import parser from "@apidevtools/json-schema-ref-parser";
import path from "path";

async function run(): Promise<void> {
  const schema = await parser.bundle(path.resolve(__dirname, "base.json"));
  console.log(JSON.stringify(schema));
}

run();
