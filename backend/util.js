import crypto from "crypto";
import jwt from "jsonwebtoken";

class Utils {
  attachCookiesToResponse({ res, user, refresh_token }) {
    const accessToken = createJWT({ user });
    const refreshToken = createJWT({ user, refresh_token });

    const oneDay = 1000 * 60 * 60 * 24;
    const thirtyDays = 1000 * 60 * 60 * 24 * 30;

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      signed: true,
      expires: new Date(Date.now() + oneDay),
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      signed: true,
      expires: new Date(Date.now() + thirtyDays),
    });
  }

  createId() {
    const hex = crypto.randomBytes(16).toString("hex");
    return hex;
  }

  createJWT(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET);
  }
}

export const { attachCookiesToResponse, createId, createJWT } = new Utils();
