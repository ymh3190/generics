import { Token } from "./db";
import jwt from "jsonwebtoken";
import * as CustomError from "./error";
import util from "./util";

class Middleware {
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
        throw new CustomError.UnauthenticatedError("Authentication invalid");
      }

      util.attachCookiesToResponse({
        res,
        user: payload.user,
        refresh_token: existingToken.refresh_token,
      });
      req.user = payload.user;
      next();
    } catch (error) {
      throw new CustomError.UnauthenticatedError("Authentication invalid");
    }
  }

  authorizePermissions(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        throw new CustomError.UnauthorizedError(
          "Unauthorized to access this route"
        );
      }
      next();
    };
  }

  notFound(req, res) {
    return res.status(404).json({ message: "Route not found" });
  }

  async errorHandler(err, req, res, next) {
    console.log(err);
    const error = {
      statusCode: err.statusCode || 500,
      message: err.message || "Something wrong",
    };
    if (err.errno === 1062) {
      error.statusCode = 400;
    }
    if (err.errno === 1366) {
      error.statusCode = 400;
    }
    return res.status(error.statusCode).json({ message: error.message });
  }
}

const middleware = new Middleware();
export default middleware;
