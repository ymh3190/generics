import { WebSocketServer } from "ws";

class Socket {
  constructor() {
    this.wss;
  }

  connect(server) {
    this.wss = new WebSocketServer({
      server,
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: 1024,
          memLevel: 7,
          level: 3,
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024,
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024,
      },
    });

    this.wss.on("connection", (ws, req) => {
      ws.on("message", (data) => {
        console.log(data.toString());
      });

      ws.on("error", console.error);

      ws.on("close", () => {
        console.log("connection close");
      });

      ws.send("from server hello");
    });
  }
}

const socket = new Socket();
export default socket;
