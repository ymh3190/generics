import "./db-sync";
import "./db-sub";

import "./layer";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import {
  authRouter,
  monitorRouter,
  workOrderRouter,
  workDetailRouter,
  workLogRouter,
  clientRouter,
  remnantDetailRouter,
  remnantZoneRouter,
  itemRouter,
  userRouter,
} from "./router";
import middleware from "./middleware";

class Server {
  #app;

  constructor() {
    this.#app = express();

    this.#setConfig();
    this.#useMiddleware();
    this.#useRouter();
    this.#errorHandler();
  }

  listen() {
    const port = process.env.PORT || 4000;
    this.#app.listen(port, () => {
      console.log(`Server is listening port ${port}`);
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
    this.#app.use("/api/v1/monitor", monitorRouter);
    this.#app.use("/api/v1/users", userRouter);
    this.#app.use("/api/v1/auth", authRouter);
    this.#app.use("/api/v1/clients", clientRouter);
    this.#app.use("/api/v1/items", itemRouter);
    this.#app.use("/api/v1/work-orders", workOrderRouter);
    this.#app.use("/api/v1/work-details", workDetailRouter);
    this.#app.use("/api/v1/work-logs", workLogRouter);
    this.#app.use("/api/v1/remnant-details", remnantDetailRouter);
    this.#app.use("/api/v1/remnant-zones", remnantZoneRouter);
  }

  #errorHandler() {
    this.#app.use(middleware.notFound);
    this.#app.use(middleware.errorHandler);
  }
}

const server = new Server();
export default server;
