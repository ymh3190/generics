import express from "express";
import jwt from "jsonwebtoken";
import { apiController, rootController } from "./controller";
import { asyncWrapper, auth } from "./middleware";

/** @interface */
class Router {
  constructor(path) {
    this.router = express.Router();
    this.routes = { root: path };
    this.controllers = {};
  }

  /** @interface */
  #route() {}

  /** @interface */
  #get() {}

  /** @interface */
  #post() {}

  /** @interface */
  #patch() {}

  /** @interface */
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

    this.routes.signin = "/signin";
    this.controllers.getSignin = asyncWrapper(
      rootController.getSignin.bind(rootController)
    );

    this.routes.signup = "/signup";
    this.controllers.getSignup = asyncWrapper(
      rootController.getSignup.bind(rootController)
    );

    this.#get();
  }

  /** @implements */
  #get() {
    this.router.get(this.routes.root, auth, this.controllers.getIndex);
    this.router.get(this.routes.video, auth, this.controllers.getVideo);
    this.router.get(this.routes.watch, auth, this.controllers.getWatch);
    this.router.get(this.routes.signin, this.controllers.getSignin);
    this.router.get(this.routes.signup, this.controllers.getSignup);
  }
}

class ApiRouter extends Router {
  constructor(path) {
    super(path);
    this.routes.signin = "/signin";
    this.controllers.signin = asyncWrapper(
      apiController.signin.bind(apiController)
    );

    this.routes.memory = "/memory";
    this.controllers.memory = asyncWrapper(
      apiController.memory.bind(apiController)
    );

    this.#get();
    this.#post();
  }

  #get() {
    this.router.get(this.routes.memory, this.controllers.memory);
  }

  #post() {
    this.router.post(this.routes.signin, this.controllers.signin);
  }
}

export const rootRouter = new RootRouter("/");
export const apiRouter = new ApiRouter("/api");
