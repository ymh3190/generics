import { writeFileSync, existsSync } from "fs";
if (!existsSync(process.cwd() + "/src/db-sub.js")) {
  writeFileSync(process.cwd() + "/src/db-sub.js", "");
}

import server from "./server";
import mysqlAPI from "./db";
import "./db-sync";
import "./db-sub";
// import "./ssh";

(async () => {
  try {
    await mysqlAPI.connect();
    server.listen();
  } catch (error) {
    console.log(error);
  }
})();
