import { WebSocketServer } from "ws";
import * as CustomError from "./error";
import util from "./util";
import placeOrder from "./alarm";

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
      ws.on("error", console.error);

      ws.on("message", (data) => {
        console.log(data.toString());
      });

      ws.on("close", () => {
        console.log("connection close");
      });

      setInterval(() => {
        if (placeOrder.event) {
          ws.send(placeOrder.event);
          placeOrder.event = "";
        }
      }, 5000);

      // TODO: authentication logic
      // try {
      //   const cookies = req.headers.cookie.split("; ");

      //   const access_token = cookies.find((e) => e.startsWith("access_token"));
      //   if (access_token) {
      //     const payload = util.parseToken(access_token);
      //     return;
      //   }

      //   const refresh_token = cookies.find((e) =>
      //     e.startsWith("refresh_token")
      //   );
      //   const payload = util.parseToken(refresh_token);
      // } catch (error) {
      //   ws.close();
      // }
    });
  }
}

const socket = new Socket();
export default socket;
