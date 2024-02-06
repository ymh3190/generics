import { WebSocketServer } from "ws";

class Socket {
  connect(server) {
    const wss = new WebSocketServer({ server });
    wss.on("connection", (ws, req) => {
      ws.on("message", (data) => {
        console.log(data.toString());
      });

      ws.on("error", console.error);

      ws.on("close", () => {
        console.log("connection close");
      });
    });
  }
}

const socket = new Socket();
export default socket;
