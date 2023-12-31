import server from "./server";
import "./fetch-api";

(async () => {
  try {
    server.listen();
  } catch (error) {
    console.log(error);
  }
})();
