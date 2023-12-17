import { Token } from "./db";
import jwt from "jsonwebtoken";

class Middleware {
  locals(req, res, next) {
    next();
  }

  async auth(req, res, next) {
    const { accessToken, refreshToken } = req.signedCookies;
    try {
      if (accessToken) {
        const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
        console.log(payload);
        req.user = payload.user;
        return next();
      }

      // const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
      // console.log(payload);
      // return;
      // const existingToken = await Token.selectOne({
      //   user_id: payload.user.userId,
      //   refresh_token: payload.refreshToken,
      // });

      // if (!existingToken || !existingToken?.is_valid) {
      //   throw new Error("Authenication invalid");
      // }

      // const accessToken = jwt.sign(
      //   { user: payload.user },
      //   process.env.JWT_SECRET
      // );
      // const refreshToken = jwt.sign(
      //   {
      //     user: payload.user,
      //     refreshToken: existingToken.refresh_token,
      //   },
      //   process.env.JWT_SECRET
      // );
      // res.cookie("accessToken", accessToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   signed: true,
      //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      // });

      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   signed: true,
      //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      // });
      // req.user = payload.user;
      // next();
    } catch (error) {
      throw new Error("Authentication invalid");
      return;
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
