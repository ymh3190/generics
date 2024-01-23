import express from "express";
import {
  authController,
  clientController,
  rootController,
  workOrderController,
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

    this.router.get(
      "/",
      middleware.refreshTokenExists,
      rootController.getWorkOrder
    );

    this.router.get(
      "/images",
      middleware.refreshTokenExists,
      rootController.getImage
    );

    this.router.get(
      "/signin",
      middleware.refreshTokenNotExists,
      rootController.getSignin
    );

    this.router.get(
      "/signup",
      middleware.refreshTokenNotExists,
      rootController.getSignup
    );

    this.router.get(
      "/watch/:id(\\d|\\w{32})",
      middleware.refreshTokenExists,
      rootController.getWatch
    );
  }
}

class AuthRouter extends Router {
  constructor() {
    super();

    this.router.post("/signup", authController.signup);

    this.router.post("/signin", authController.signin);

    this.router.delete(
      "/signout",
      middleware.refreshTokenExists,
      authController.signout
    );

    this.router.post("/test", authController.testSession);
  }
}

class ClientRouter extends Router {
  constructor() {
    super();

    this.router.route("/:id(\\d|\\w{32})").get(clientController.selectById);
  }
}

class WorkOrderRouter extends Router {
  constructor() {
    super();
  }
}

export const { router: rootRouter } = new RootRouter();
export const { router: authRouter } = new AuthRouter();
export const { router: workOrderRouter } = new WorkOrderRouter();
export const { router: clientRouter } = new ClientRouter();
