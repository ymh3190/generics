import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { apiRouter, authRouter, rootRouter } from "./router";
import { errorHandler, notFound } from "./middleware";

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
    this.#app.set("view engine", "ejs");
    this.#app.set("views", process.cwd() + "/views/contents/index");
  }

  #useMiddleware() {
    this.#app.use(helmet({ contentSecurityPolicy: false }));
    this.#app.use(cors());
    this.#app.use(express.json());
    this.#app.use(cookieParser(process.env.JWT_SECRET));
    this.#app.use("/static", express.static("static"));
    this.#app.use("/public", express.static("public"));
  }

  #useRouter() {
    this.#app.use(rootRouter.routes.root, rootRouter.router);
    this.#app.use(apiRouter.routes.root, apiRouter.router);
    this.#app.use(authRouter.routes.root, authRouter.router);
  }

  #errorHandler() {
    this.#app.use(notFound);
    this.#app.use(errorHandler);
  }
}

const server = new Server();
export default server;
