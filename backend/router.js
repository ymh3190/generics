import express from "express";
import { rootController } from "./controller";
import { asyncWrapper } from "./middleware";

class Router {
  constructor(path) {
    this.router = express.Router();
    this.routes = { root: path };
    this.controllers = {};
  }

  /** @abstract */
  #route() {}

  /** @abstract */
  #get() {}

  /** @abstract */
  #post() {}

  /** @abstract */
  #patch() {}

  /** @abstract */
  #delete() {}
}

class RootRouter extends Router {
  constructor(path) {
    super(path);
    this.controllers.getIndex = asyncWrapper(
      rootController.getIndex.bind(rootController)
    );

    this.routes.video = "/video";
    this.controllers.getVideo = asyncWrapper(
      rootController.getVideo.bind(rootController)
    );

    this.routes.watch = "/watch/:id(\\d|\\w{32})";
    this.controllers.getWatch = asyncWrapper(
      rootController.getWatch.bind(rootController)
    );

    this.#get();
  }

  /** @implements */
  #get() {
    this.router.get(this.routes.root, this.controllers.getIndex);
    this.router.get(this.routes.video, this.controllers.getVideo);
    this.router.get(this.routes.watch, this.controllers.getWatch);
  }
}

export const rootRouter = new RootRouter("/");
