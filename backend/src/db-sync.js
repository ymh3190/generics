import { readFileSync, writeFileSync } from "fs";

const tables = readFileSync(process.cwd() + "/src/db.js")
  .toString()
  .match(/(\w+)\sextends/g)
  .map((str) => str.split(" ")[0]);

let statement = "import {";
for (let i = 0; i < tables.length; i++) {
  if (i !== tables.length - 1) {
    statement += ` ${tables[i]},`;
    continue;
  }
  statement += ` ${tables[i]} } from "./db.js";\n(async () => {`;
}

for (let i = 0; i < tables.length; i++) {
  if (i !== tables.length - 1) {
    statement += `\n${tables[i]}.table = ${tables[i]}.getTable();`;
    statement += `\n${tables[i]}.dateFormat = await ${tables[i]}.formatDate();`;
    continue;
  }
  statement += `\n${tables[i]}.table = ${tables[i]}.getTable();`;
  statement += `\n${tables[i]}.dateFormat = await ${tables[i]}.formatDate();`;
  statement += "\n})();";
}
writeFileSync(process.cwd() + "/src/db-sub.js", statement);
