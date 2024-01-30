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

  getDateTime() {
    const dateTime = new Date();
    const years = dateTime.getFullYear();
    const months = String(dateTime.getMonth() + 1).padStart(2, "0");
    const dates = String(dateTime.getDate()).padStart(2, "0");
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");
    const seconds = String(dateTime.getSeconds()).padStart(2, "0");
    return { years, months, dates, hours, minutes, seconds };
  }

  #createJWT(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET);
  }
}

const util = new Util();
export default util;
