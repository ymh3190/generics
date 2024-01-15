import server from "./server";
import mysqlAPI from "./db";
// import "./ssh";

(async () => {
  try {
    await mysqlAPI.connect();
    server.listen();
  } catch (error) {
    console.log(error);
  }
})();
