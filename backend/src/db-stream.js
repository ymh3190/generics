import { createReadStream, createWriteStream } from "fs";

let tables;

const readStream = createReadStream(process.cwd() + "/src/db.js");
readStream.on("data", (chunk) => {
  tables = chunk
    .toString()
    .match(/(\w+)\sextends/g)
    .map((str) => str.split(" ")[0]);
});

readStream.on("end", () => {
  const writeStream = createWriteStream(process.cwd() + "/src/db-stream.js");

  let statement = "import {";
  for (let i = 0; i < tables.length; i++) {
    if (i !== tables.length - 1) {
      statement = statement.concat(" ", tables[i], ",");
      continue;
    }
    statement = statement.concat(" ", tables[i], ' } from "./db.js";\n');
  }
  writeStream.write(statement);
  statement = "(async () => {";
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
  writeStream.write(statement);
  writeStream.end();
});
