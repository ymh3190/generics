import crypto from "crypto";
import jwt from "jsonwebtoken";

class Util {
  attachCookiesToResponse({ res, user, refresh_token }) {
    const accessToken = this.#createJWT({ user });
    const refreshToken = this.#createJWT({ user, refresh_token });

    const shortExp = 1000 * 60 * 10;
    const longerExp = 1000 * 60 * 30;

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      signed: true,
      expires: new Date(Date.now() + shortExp),
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      signed: true,
      expires: new Date(Date.now() + longerExp),
    });
  }

  createId() {
    const id = crypto.randomUUID().replaceAll("-", "");
    return id;
  }

  createToken() {
    const hex = crypto.randomBytes(20).toString("hex");
    return hex;
  }

  createTokenUser(user) {
    return { username: user.username, user_id: user.id, role: user.role };
  }

  #createJWT(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET);
  }
}

const util = new Util();
export default util;
