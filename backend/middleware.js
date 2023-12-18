import { Token } from "./db";
import jwt from "jsonwebtoken";

class Middleware {
  locals(req, res, next) {
    next();
  }

  async auth(req, res, next) {
    const { access_token, refresh_token } = req.signedCookies;
    try {
      if (access_token) {
        const payload = jwt.verify(access_token, process.env.JWT_SECRET);
        req.user = payload.user;
        return next();
      }
      const payload = jwt.verify(refresh_token, process.env.JWT_SECRET);
      const existingToken = await Token.selectOne({
        user_id: payload.user.user_id,
        refresh_token: payload.refresh_token,
      });

      if (!existingToken || !existingToken?.is_valid) {
        throw new Error("Authentication invalid");
      }

      const accessTokenJWT = jwt.sign(
        { user: payload.user },
        process.env.JWT_SECRET
      );
      const refreshTokenJWT = jwt.sign(
        {
          user: payload.user,
          refresh_token: payload.refresh_token,
        },
        process.env.JWT_SECRET
      );
      res.cookie("access_token", accessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });
      res.cookie("refresh_token", refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });
      req.user = payload.user;
      next();
    } catch (error) {
      res.redirect("/signin");
    }
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
    return res.end();
  }
}

export const { asyncWrapper, errorHandler, locals, notFound, auth } =
  new Middleware();
