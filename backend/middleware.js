import { Token } from "./db";
import jwt from "jsonwebtoken";
import { attachCookiesToResponse } from "./util";

class Middleware {
  async authenticateUser(req, res, next) {
    const { access_token, refresh_token } = req.signedCookies;
  }

  asyncWrapper(fn) {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }

  notFound(req, res) {
    return res.status(404).render("error", { pageTitle: "Route not found" });
  }

  errorHandler(err, req, res, next) {
    console.log(err);
    const customError = {
      statusCode: err.statusCode || 500,
      message: err.message || "Something wrong",
    };
    res.status(customError.statusCode).json({ msg: customError.message });
  }
}

export const { asyncWrapper, errorHandler, notFound, authenticateUser } =
  new Middleware();
