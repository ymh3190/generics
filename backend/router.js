import express from "express";
import { rootController } from "./controller";
import { asyncWrapper } from "./middleware";

/**
 * @abstract
 */
class Router {
  constructor(path) {
    this.router = express.Router();
    this.routes = { root: path };
    this.controllers = {};
  }

  init() {
    this.get();
    this.post();
    this.patch();
    this.delete();
    return this;
  }

  /**
   * @abstract
   */
  get() {}

  /**
   * @abstract
   */
  post() {}

  /**
   * @abstract
   */
  patch() {}

  /**
   * @abstract
   */
  delete() {}
}

class RootRouter extends Router {
  constructor(path) {
    super(path);
    this.controllers.getIndex = asyncWrapper(
      rootController.getIndex.bind(rootController)
    );
  }

  get() {
    this.router.get(this.routes.root, this.controllers.getIndex);
  }
}

export const rootRouter = new RootRouter("/").init();
