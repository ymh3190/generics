import express from "express";
import { authController, rootController } from "./controller";
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
      rootController.getIndex
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

const { router: rootRouter } = new RootRouter();
const { router: authRouter } = new AuthRouter();
export { rootRouter, authRouter };
