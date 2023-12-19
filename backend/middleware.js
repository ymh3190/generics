import { Token } from "./db";
import jwt from "jsonwebtoken";

class Middleware {
  authenticateUser(req, res, next) {}

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
    return res.end();
  }
}

export const { asyncWrapper, errorHandler, notFound } = new Middleware();
