import { Token } from "./db";
import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "./error-api";
import { attachCookiesToResponse } from "./util";

class Middleware {
  asyncWrapper(fn) {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }

  async authenticateUser(req, res, next) {
    const { access_token, refresh_token } = req.signedCookies;

    try {
      if (access_token) {
        const payload = jwt.verify(access_token, process.env.JWT_SECRET);
        req.user = payload.user;
        return next();
      }

      const payload = jwt.verify(refresh_token, process.env.JWT_SECRET);
      const existingToken = await Token.selectOne({
        refresh_token: payload.refresh_token,
        user_id: payload.user.user_id,
      });
      if (!existingToken || !existingToken?.is_valid) {
        throw new UnauthenticatedError("Authentication invalid");
      }

      attachCookiesToResponse({
        res,
        user: payload.user,
        refresh_token: existingToken.refresh_token,
      });
      req.user = payload.user;
      next();
    } catch (error) {
      res.redirect("/signin");
    }
  }

  authorizePermissions(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        const message = "Unauthorized to access this route";
        return res.status(403).render("error", { pageTitle: "403", message });
      }
      next();
    };
  }

  notFound(req, res) {
    return res.status(404).json({ message: "Route not found" });
  }

  errorHandler(err, req, res, next) {
    console.log(err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something wrong";
    return res.status(statusCode).json({ message });
  }
}

const middleware = new Middleware();
export default middleware;
