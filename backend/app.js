import mysqlClient from "./db";
import server from "./server";

const start = async () => {
  try {
    await mysqlClient.connect();
    server.listen();
  } catch (error) {
    console.log(error);
  }
};
start();
