import "dotenv/config";
import "./layer";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { authRouter, monitorRouter, imageRouter, videoRouter } from "./router";
import middleware from "./middleware";

class Server {
  #app;
  #port;

  constructor() {
    this.#app = express();
    this.#port = process.env.PORT || 3000;

    this.#setConfig();
    this.#useMiddleware();
    this.#useRouter();
    this.#errorHandler();
  }

  listen() {
    this.#app.listen(this.#port, () => {
      console.log(`Server is listening port ${this.#port}`);
    });
  }

  #setConfig() {
    this.#app.set("trust proxy", 1);
  }

  #useMiddleware() {
    this.#app.use(
      helmet({
        contentSecurityPolicy: process.env.NODE_ENV === "production",
        crossOriginOpenerPolicy: process.env.NODE_ENV === "production",
        originAgentCluster: process.env.NODE_ENV === "production",
      })
    );
    this.#app.use(cors());
    this.#app.use(express.json());
    this.#app.use(cookieParser(process.env.JWT_SECRET));
  }

  #useRouter() {
    this.#app.use("/api/v1/auth", authRouter);
    this.#app.use("/api/v1/monitor", monitorRouter);
    this.#app.use("/api/v1/images", imageRouter);
    this.#app.use("/api/v1/videos", videoRouter);
  }

  #errorHandler() {
    this.#app.use(middleware.notFound);
    this.#app.use(middleware.errorHandler);
  }
}

const server = new Server();
export default server;
