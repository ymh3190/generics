import Server from "./server";
import { mysqlClient } from "./db";
const server = new Server().init();

const start = async () => {
  try {
    await mysqlClient.connect();
    server.listen();
  } catch (error) {
    console.log(error);
  }
};
start();
