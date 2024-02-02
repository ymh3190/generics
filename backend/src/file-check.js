import { writeFileSync, existsSync } from "fs";
if (!existsSync(process.cwd() + "/src/init-db.js")) {
  writeFileSync(process.cwd() + "/src/init-db.js", "");
}
