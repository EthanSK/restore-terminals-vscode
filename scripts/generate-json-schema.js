const fs = require("fs");
const path = require("path");

const extensionRoot = path.resolve(__dirname, "..");
const manifestPath = path.join(extensionRoot, "package.json");
const schemaPath = path.join(
  extensionRoot,
  "schemas",
  "restore-terminals.schema.json"
);
const settingPrefix = "restoreTerminals.";

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const settingProperties = manifest.contributes.configuration.properties;
const properties = {};

for (const [settingName, settingSchema] of Object.entries(settingProperties)) {
  if (!settingName.startsWith(settingPrefix)) {
    throw new Error(`Unexpected Restore Terminals setting: ${settingName}`);
  }

  properties[settingName.slice(settingPrefix.length)] = settingSchema;
}

const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: manifest.contributes.configuration.title,
  type: "object",
  additionalProperties: false,
  properties,
};
const generatedSchema = `${JSON.stringify(schema, null, 2)}\n`;

if (process.argv.includes("--check")) {
  const currentSchema = fs.existsSync(schemaPath)
    ? fs.readFileSync(schemaPath, "utf8")
    : undefined;

  if (currentSchema !== generatedSchema) {
    throw new Error(
      "The Restore Terminals JSON schema is stale. Run npm run generate:schema."
    );
  }
} else {
  fs.mkdirSync(path.dirname(schemaPath), { recursive: true });
  fs.writeFileSync(schemaPath, generatedSchema);
}
