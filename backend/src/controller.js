import bcrypt from "bcrypt";
import { User, Token, Image, Video } from "./db";
import * as CustomError from "./error";
import memInfo from "./ssh";
import {
  attachCookiesToResponse,
  createId,
  createToken,
  createTokenUser,
} from "./util";

class ImageController {
  async createImage(req, res) {
    const { id, path } = req.body;

    if (!id || !path) {
      throw new CustomError.BadRequestError("Provide id and path");
    }

    await Image.create({ id, path });
    res.status(201).end();
  }

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async getImages(req, res) {
    const images = await Image.select({});
    res.status(200).json({ images, user: req.user });
  }

  async getImage(req, res) {
    const { id } = req.params;

    if (!id) {
      throw new CustomError.BadRequestError("Provide id");
    }

    const image = await Image.selectOne({ id });
    if (!image) {
      throw new CustomError.NotFoundError("Image not found");
    }
    res.status(200).json({ image });
  }
}

class VideoController {
  async createVideo(req, res) {
    const { id, path } = req.body;

    await Video.create({ id, path });
    res.status(201).end();
  }

  async getVideos(req, res) {
    const videos = await Video.select({});
    res.status(200).json({ videos });
  }

  async getVideo(req, res) {
    const { id } = req.params;

    if (!id) {
      throw new CustomError.BadRequestError("Provide id");
    }

    const video = await Video.selectOne({ id });
    if (!video) {
      throw new CustomError.NotFoundError("video not found");
    }
    res.status(200).json({ video, user: req.user });
  }
}

class AuthController {
  async signup(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new CustomError.BadRequestError("Provide username and password");
    }

    const existingUser = await User.selectOne({ username });
    if (existingUser) {
      throw new CustomError.BadRequestError("User already exists");
    }

    const id = createId();
    const hash = await bcrypt.hash(password, 10);
    const role = (await User.select({})).length === 0 ? "admin" : "user";

    await User.create({ id, username, password: hash, role });
    res.status(201).end();
  }

  async signin(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new CustomError.BadRequestError("Provide username and password");
    }

    const user = await User.selectOne({ username });
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new CustomError.BadRequestError("Password not match");
    }

    const tokenUser = createTokenUser(user);
    let refreshToken = "";
    const existingToken = await Token.selectOne({ user_id: user.id });
    if (existingToken) {
      const { is_valid } = existingToken;
      if (!is_valid) {
        throw new CustomError.UnauthenticatedError("Authentication invalid");
      }

      refreshToken = existingToken.refresh_token;
      attachCookiesToResponse({
        res,
        user: tokenUser,
        refresh_token: refreshToken,
      });
      return res.status(200).end();
    }

    const id = createId();
    const refresh_token = createToken();
    const ip = req.headers["x-forwared-for"];
    const user_agent = req.headers["user-agent"];
    const user_id = user.id;

    await Token.create({ id, refresh_token, ip, user_agent, user_id });

    attachCookiesToResponse({ res, user: tokenUser, refresh_token });
    res.status(200).end();
  }

  async signout(req, res) {
    await Token.delete({ user_id: req.user.user_id });

    res.cookie("access_token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.cookie("refresh_token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.status(200).end();
  }
}

class MonitorController {
  memory(req, res) {
    const data = memInfo.used;
    res.status(200).json(data);
  }
}

const authController = new AuthController();
const monitorController = new MonitorController();
const imageController = new ImageController();
const videoController = new VideoController();
export { authController, monitorController, imageController, videoController };
