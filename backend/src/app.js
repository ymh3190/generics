import mysqlAPI from "./db";
import server from "./server";
// import "./ssh";

(async () => {
  try {
    await mysqlAPI.connect();
    server.listen();
  } catch (error) {
    console.log(error);
  }
})();
