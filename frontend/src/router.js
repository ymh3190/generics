import express from "express";
import {
  authController,
  // monitorController
  rootController,
} from "./controller";

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
      index: "/",
      signin: "/signin",
      signup: "/signup",
      video: "/video",
      watch: "/watch/:id(\\d|\\w{32})",
    };

    this.controllers = {
      getIndex: rootController.getIndex.bind(rootController),
      getWatch: rootController.getWatch.bind(rootController),
      getSignin: rootController.getSignin.bind(rootController),
      // getSignup: rootController.getSignup.bind(rootController),
      // getVideo: rootController.getVideo.bind(rootController),
    };

    this.router.get(this.routes.index, this.controllers.getIndex);
    this.router.get(this.routes.signin, this.controllers.getSignin);
    this.router.get(this.routes.watch, this.controllers.getWatch);
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
      // signup: authController.signup,
      signin: authController.signin,
      signout: authController.signout,
    };

    // this.router.post(this.routes.signup, this.controllers.signup);
    this.router.post(this.routes.signin, this.controllers.signin);
    this.router.delete(this.routes.signout, this.controllers.signout);
  }
}

// class MonitorRouter extends Router {
//   constructor() {
//     super();

//     this.routes = {
//       root: "/api/monitor",
//       memory: "/memory",
//     };

//     this.controllers = {
//       memory: monitorController.memory,
//     };

//     this.router.get(this.routes.memory, this.controllers.memory);
//   }
// }

const rootRouter = new RootRouter();
const authRouter = new AuthRouter();
// const monitorRouter = new MonitorRouter();
export { rootRouter, authRouter /* , monitorRouter */ };
