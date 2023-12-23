import express from "express";
import {
  monitorController,
  authController,
  rootController,
} from "./controller";
import middleware from "./middleware";

/** @interface */
class Router {
  constructor(path) {
    this.router = express.Router();
    this.routes = { root: path };
    this.controllers = {};
  }
}

class RootRouter extends Router {
  constructor(path) {
    super(path);
    this.controllers.getIndex = rootController.getIndex.bind(rootController);

    this.routes.signin = "/signin";
    this.controllers.getSignin = rootController.getSignin.bind(rootController);

    this.routes.signup = "/signup";
    this.controllers.getSignup = rootController.getSignup.bind(rootController);

    this.routes.video = "/video";
    this.controllers.getVideo = rootController.getVideo.bind(rootController);

    this.routes.watch = "/watch/:id(\\d|\\w{32})";
    this.controllers.getWatch = rootController.getWatch.bind(rootController);

    this.#get();
  }

  #get() {
    this.router.get(
      this.routes.root,
      [middleware.authenticateUser, middleware.authorizePermissions("admin")],
      this.controllers.getIndex
    );

    this.router.get(this.routes.signin, this.controllers.getSignin);

    this.router.get(this.routes.signup, this.controllers.getSignup);

    this.router.get(
      this.routes.video,
      [middleware.authenticateUser, middleware.authorizePermissions("admin")],
      this.controllers.getVideo
    );

    this.router.get(
      this.routes.watch,
      [middleware.authenticateUser, middleware.authorizePermissions("admin")],
      this.controllers.getWatch
    );
  }
}

class AuthRouter extends Router {
  constructor(path) {
    super(path);

    this.routes.signin = "/signin";
    this.controllers.signin = middleware.asyncWrapper(
      authController.signin.bind(authController)
    );

    this.routes.signout = "/signout";
    this.controllers.signout = authController.signout.bind(authController);

    this.routes.signup = "/signup";
    this.controllers.signup = middleware.asyncWrapper(
      authController.signup.bind(authController)
    );

    this.#post();
    this.#delete();
  }

  #post() {
    this.router.post(this.routes.signin, this.controllers.signin);
    this.router.post(this.routes.signup, this.controllers.signup);
  }

  #delete() {
    this.router.delete(
      this.routes.signout,
      middleware.authenticateUser,
      this.controllers.signout
    );
  }
}

class MonitorRouter extends Router {
  constructor(path) {
    super(path);

    this.routes.memory = "/memory";
    this.controllers.memory = monitorController.memory.bind(monitorController);

    this.#get();
  }

  #get() {
    this.router.get(this.routes.memory, this.controllers.memory);
  }
}

const rootRouter = new RootRouter("/");
const authRouter = new AuthRouter("/api/auth");
const monitorRouter = new MonitorRouter("/api/monitor");
export { rootRouter, authRouter, monitorRouter };
