import { Server } from "ws";

export default (server) => {
  const wss = new Server({ server });
  wss.on("connection", (ws, req) => {
    ws.on("message", (data) => {
      console.log(data.toString());
    });

    ws.on("error", console.error);

    ws.on("close", () => {
      console.log("connection close");
    });
  });
};
