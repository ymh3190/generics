import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";

import { rootRouter } from "./router";
import { localsMiddleware } from "./middleware";

class Server {
  #app;
  #port;

  constructor() {
    this.#app = express();
    this.#port = process.env.PORT || 3000;
  }

  init() {
    this.#setConfig();
    this.#useMiddleware();
    this.#useRouter();
    return this;
  }

  listen() {
    this.#listen();
  }

  #setConfig() {
    this.#app.set("view engine", "ejs");
  }

  #useMiddleware() {
    this.#app.use(helmet({ contentSecurityPolicy: false }));
    this.#app.use(cors());
    this.#app.use(express.json());
    this.#app.use("/static", express.static("static"));
    this.#app.use("/public", express.static("public"));
    this.#app.use(localsMiddleware);
  }

  #useRouter() {
    this.#app.use(rootRouter.routes.root, rootRouter.router);
  }

  #listen() {
    this.#app.listen(this.#port, () => {
      console.log(`Server is listening port ${this.#port}`);
    });
  }
}

const server = new Server().init();
export default server;
