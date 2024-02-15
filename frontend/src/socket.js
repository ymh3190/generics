import { WebSocketServer } from "ws";
import orderer from "./alarm";

class Socket {
  #wss;

  connect(server) {
    this.#wss = new WebSocketServer({ server });

    this.#wss.on("connection", (ws, req) => {
      orderer.addField(ws);

      ws.on("error", console.error);

      ws.on("message", (data) => {
        console.log(data.toString());
      });

      ws.on("close", () => {
        orderer.removeField(ws);
      });
    });
  }
}

const socket = new Socket();
export default socket;
