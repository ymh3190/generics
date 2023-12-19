import express from "express";
import jwt from "jsonwebtoken";
import { apiController, authController, rootController } from "./controller";
import {} from "./middleware";

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
    this.controllers.getIndex = rootController.getIndex.bind(rootController);

    this.routes.video = "/video";
    this.controllers.getVideo = rootController.getVideo.bind(rootController);

    this.routes.watch = "/watch/:id(\\d|\\w{32})";
    this.controllers.getWatch = rootController.getWatch.bind(rootController);

    this.routes.signin = "/signin";
    this.controllers.getSignin = rootController.getSignin.bind(rootController);

    this.routes.signup = "/signup";
    this.controllers.getSignup = rootController.getSignup.bind(rootController);

    this.#get();
  }

  /** @implements */
  #get() {
    this.router.get(this.routes.root, this.controllers.getIndex);
    this.router.get(this.routes.video, this.controllers.getVideo);
    this.router.get(this.routes.watch, this.controllers.getWatch);
    this.router.get(this.routes.signin, this.controllers.getSignin);
    this.router.get(this.routes.signup, this.controllers.getSignup);
  }
}

class ApiRouter extends Router {
  constructor(path) {
    super(path);

    this.routes.memory = "/memory";
    this.controllers.memory = apiController.memory.bind(apiController);

    this.#get();
  }

  #get() {
    this.router.get(this.routes.memory, this.controllers.memory);
  }
}

class AuthRouter extends ApiRouter {
  constructor(path) {
    super(path);

    this.routes.signin = "/signin";
    this.controllers.signin = authController.signin.bind(authController);

    this.routes.signout = "/signout";
    this.controllers.signout = authController.signout.bind(authController);

    this.#post();
    this.#delete();
  }

  #post() {
    this.router.post(this.routes.signin, this.controllers.signin);
  }

  #delete() {
    this.router.delete(this.routes.signout, this.controllers.signout);
  }
}

export const rootRouter = new RootRouter("/");
export const apiRouter = new ApiRouter("/asdf");
export const authRouter = new AuthRouter("/api/auth");
