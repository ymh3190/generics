import { readFileSync, writeFileSync } from "fs";

const tables = readFileSync(process.cwd() + "/src/db.js")
  .toString()
  .match(/(\w+)\sextends/g)
  .map((str) => str.split(" ")[0]);

let statement = "import {";
for (let i = 0; i < tables.length; i++) {
  if (i !== tables.length - 1) {
    statement = statement.concat(" ", tables[i], ",");
    continue;
  }
  statement = statement.concat(" ", tables[i], ' } from "./db.js";\n');
}

statement += "(async () => {";
for (let i = 0; i < tables.length; i++) {
  if (i !== tables.length - 1) {
    statement = statement.concat("\n", `${tables[i]}.table =`);
    statement = statement.concat(" ", `${tables[i]}.getTable();`);
    statement = statement.concat("\n", `${tables[i]}.dateFormat =`);
    statement = statement.concat(" await ", `${tables[i]}.formatDate();`);
    continue;
  }
  statement = statement.concat("\n", `${tables[i]}.table =`);
  statement = statement.concat(" ", `${tables[i]}.getTable();`);
  statement = statement.concat("\n", `${tables[i]}.dateFormat =`);
  statement = statement.concat(" await ", `${tables[i]}.formatDate();`);
  statement = statement.concat("\n", "})();");
}

writeFileSync(process.cwd() + "/src/db-sub.js", statement);
