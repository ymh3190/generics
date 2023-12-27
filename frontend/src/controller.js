import fetch from "node-fetch";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "./error-api";

class RootController {
  constructor() {
    this.views = {
      index: "index",
      signin: "signin",
      signup: "signup",
      watch: "watch",
      video: "video",
    };

    this.options = {
      index: { pageTitle: "Generics", images: null },
      signin: { pageTitle: "Sign in" },
      signup: { pageTitle: "Sign up" },
      watch: { pageTitle: null, video: null },
      video: { pageTitle: "Video", videos: null },
    };
  }

  async getIndex(req, res) {
    const response = await fetch("http://localhost:4000/api/v1/images");
    if (response.ok) {
      const data = await response.json();
      this.options.index.images = data;
    }
    this.options.index.user = {};
    res.status(200).render(this.views.index, this.options.index);
  }
}

// class AuthController {
//   async signup(req, res) {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       throw new BadRequestError("Provide username and password");
//     }

//     const existingUser = await User.selectOne({ username });
//     if (existingUser) {
//       throw new BadRequestError("User already exists");
//     }

//     const id = createId();
//     const hash = await bcrypt.hash(password, 10);
//     const role = (await User.select({})).length === 0 ? "admin" : "user";

//     await User.create({ id, username, password: hash, role });
//     res.status(201).end();
//   }

//   async signin(req, res) {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       throw new BadRequestError("Provide username and password");
//     }

//     const user = await User.selectOne({ username });
//     if (!user) {
//       throw new NotFoundError("User not found");
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       throw new BadRequestError("Password not match");
//     }

//     const tokenUser = createTokenUser(user);
//     let refreshToken = "";
//     const existingToken = await Token.selectOne({ user_id: user.id });
//     if (existingToken) {
//       const { is_valid } = existingToken;
//       if (!is_valid) {
//         throw new UnauthenticatedError("Authentication invalid");
//       }

//       refreshToken = existingToken.refresh_token;
//       attachCookiesToResponse({
//         res,
//         user: tokenUser,
//         refresh_token: refreshToken,
//       });
//       return res.status(200).end();
//     }

//     const id = createId();
//     const refresh_token = createToken();
//     const ip = req.ip;
//     const user_agent = req.headers["user-agent"];
//     const user_id = user.id;
//     await Token.create({ id, refresh_token, ip, user_agent, user_id });
//     attachCookiesToResponse({ res, user: tokenUser, refresh_token });
//     res.status(200).end();
//   }

//   async signout(req, res) {
//     await Token.delete({ user_id: req.user.user_id });

//     res.cookie("access_token", "logout", {
//       httpOnly: true,
//       expires: new Date(Date.now()),
//     });
//     res.cookie("refresh_token", "logout", {
//       httpOnly: true,
//       expires: new Date(Date.now()),
//     });
//     res.status(200).end();
//   }
// }

// class MonitorController {
//   memory(req, res) {
//     const data = memInfo.used;
//     res.status(200).json(data);
//   }
// }

const rootController = new RootController();
// const authController = new AuthController();
// const monitorController = new MonitorController();
export { rootController /* authController, monitorController */ };
