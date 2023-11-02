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

  /**
   * @abstract
   */
  #route() {}

  /**
   * @abstract
   */
  #get() {}

  /**
   * @abstract
   */
  #post() {}

  /**
   * @abstract
   */
  #patch() {}

  /**
   * @abstract
   */
  #delete() {}
}

class RootRouter extends Router {
  constructor(path) {
    super(path);
    this.controllers.getIndex = asyncWrapper(
      rootController.getIndex.bind(rootController)
    );

    this.#get();
  }

  #get() {
    this.router.get(this.routes.root, this.controllers.getIndex);
  }
}

const rootRouter = new RootRouter("/");
export { rootRouter };
