import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { authRouter, monitorRouter, imageRouter } from "./router";
import middleware from "./middleware";

class Server {
  #app;
  #port;

  constructor() {
    this.#app = express();
    this.#port = process.env.PORT || 3000;

    this.#useMiddleware();
    this.#useRouter();
    this.#errorHandler();
  }

  listen() {
    this.#app.listen(this.#port, () => {
      console.log(`Server is listening port ${this.#port}`);
    });
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
    this.#app.use(authRouter.routes.root, authRouter.router);
    this.#app.use(monitorRouter.routes.root, monitorRouter.router);
    this.#app.use(imageRouter.routes.root, imageRouter.router);
  }

  #errorHandler() {
    this.#app.use(middleware.notFound);
    this.#app.use(middleware.errorHandler);
  }
}

const server = new Server();
export default server;
