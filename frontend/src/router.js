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

    this.router.get("/", rootController.getIndex);
    this.router.get("/signin", rootController.getSignin);
    this.router.get("/signup", rootController.getSignup);
    this.router.get("/watch/:id(\\d|\\w{32})", rootController.getWatch);
  }
}

class AuthRouter extends Router {
  constructor() {
    super();

    this.router.post("/signup", authController.signup);
    this.router.post("/signin", authController.signin);
    this.router.delete("/signout", authController.signout);
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

const { router: rootRouter } = new RootRouter();
const { router: authRouter } = new AuthRouter();
export { rootRouter, authRouter /* , monitorRouter */ };
