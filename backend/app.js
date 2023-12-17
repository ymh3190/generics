import server from "./server";
import { mysqlClient } from "./db";
import "./ssh";

// (async () => {
//   try {
//     await mysqlClient.connect();
//     server.listen();
//   } catch (error) {
//     console.log(error);
//   }
// })();

const start = async () => {
  try {
    await mysqlClient.connect();
    server.listen();
  } catch (error) {
    console.log(error);
  }
};
start();
