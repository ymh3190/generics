import "dotenv/config";
import "./layer";
import express from "express";
import helmet from "helmet";
import cors from "cors";

import {
  authRouter,
  clientRouter,
  itemRouter,
  rootRouter,
  workDetailRouter,
  workOrderRouter,
} from "./router";
import middleware from "./middleware";
import socket from "./socket";

class Server {
  #app;
  #server;

  constructor() {
    this.#app = express();

    this.#setConfig();
    this.#useMiddleware();
    this.#useRouter();
    this.#errorHandler();
  }

  listen() {
    const port = process.env.PORT || 3000;
    // this.#app.listen(port, () => {
    //   console.log(`Server is listening port ${port}`);
    // });
    this.#server = this.#app.listen(port, () => {
      console.log(`Server is listening port ${port}`);
    });
    socket(this.#server);

    /**
     * status 426: upgrade required
     */
  }

  #setConfig() {
    this.#app.set("view engine", "ejs");
    this.#app.set("views", process.cwd() + "/views/contents");
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
    this.#app.use("/static", express.static("static"));
    this.#app.use("/public", express.static("public"));
    this.#app.use(middleware.locals);
  }

  #useRouter() {
    this.#app.use("/", rootRouter);
    this.#app.use("/api/v1/auth", authRouter);
    this.#app.use("/api/v1/work-orders", workOrderRouter);
    this.#app.use("/api/v1/work-details", workDetailRouter);
    this.#app.use("/api/v1/clients", clientRouter);
    this.#app.use("/api/v1/items", itemRouter);
  }

  #errorHandler() {
    this.#app.use(middleware.notFound);
    this.#app.use(middleware.errorHandler);
  }
}

const server = new Server();
export default server;
