import express from "express";
import {
  monitorController,
  authController,
  rootController,
} from "./controller";
import middleware from "./middleware";

class Router {
  constructor() {
    this.router = express.Router();
  }
}

class RootRouter extends Router {
  constructor() {
    super();

    this.routes = {
      root: "/",
      signin: "/signin",
      signup: "/signup",
      video: "/video",
      watch: "/watch/:id(\\d|\\w{32})",
    };

    this.controllers = {
      getIndex: rootController.getIndex.bind(rootController),
      getSignin: rootController.getSignin.bind(rootController),
      getSignup: rootController.getSignup.bind(rootController),
      getVideo: rootController.getVideo.bind(rootController),
      getWatch: rootController.getWatch.bind(rootController),
    };

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
  constructor() {
    super();

    this.routes = {
      root: "/api/auth",
      signup: "/signup",
      signin: "/signin",
      signout: "/signout",
    };

    this.controllers = {
      signout: authController.signout,
      signin: middleware.asyncWrapper(authController.signin),
      signup: middleware.asyncWrapper(authController.signup),
    };

    this.#post();
    this.#delete();
  }

  #post() {
    this.router.post(this.routes.signup, this.controllers.signup);
    this.router.post(this.routes.signin, this.controllers.signin);
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
  constructor() {
    super();

    this.routes = {
      root: "/api/monitor",
      memory: "/memory",
    };

    this.controllers = {
      memory: monitorController.memory.bind(monitorController),
    };

    this.#get();
  }

  #get() {
    this.router.get(this.routes.memory, this.controllers.memory);
  }
}

const rootRouter = new RootRouter();
const authRouter = new AuthRouter();
const monitorRouter = new MonitorRouter();
export { rootRouter, authRouter, monitorRouter };
