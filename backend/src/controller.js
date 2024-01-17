import bcrypt from "bcrypt";
import {
  User,
  Token,
  Image,
  Video,
  WorkOrder,
  WorkDetail,
  Item,
  WorkLog,
  Client,
} from "./db";
import * as CustomError from "./error";
import memInfo from "./ssh";
import util from "./util";

class ClientController {
  async create(req, res) {
    const client = await Client.create(
      { id: util.createId(), creator_id: req.user.user_id, ...req.body },
      { new: true }
    );
    res.status(201).json({ client });
  }

  async select(req, res) {
    const clients = await Client.select({});
    res.status(200).json({ clients });
  }

  async selectById(req, res) {
    const { id } = req.params;

    const client = await Client.selectById(id);
    if (!client) {
      throw new CustomError.NotFoundError("Client not found");
    }
    res.status(200).json({ client });
  }

  async update(req, res) {
    const { id } = req.params;

    const client = await Client.selectByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ client });
  }
}

class WorkOrderController {
  async create(req, res) {
    const workOrder = await WorkOrder.create(
      { id: util.createId(), orderer_id: req.user.user_id },
      { new: true }
    );
    res.status(201).json({ workOrder });
  }

  async select(req, res) {
    const workOrders = await WorkOrder.select({});
    res.status(200).json({ workOrders });
  }

  async selectById(req, res) {
    const { id } = req.params;

    const workOrder = await WorkOrder.selectById(id);
    if (!workOrder) {
      throw new CustomError.NotFoundError("Work-order not found");
    }
    res.status(200).json({ workOrder });
  }

  async update(req, res) {
    const { id } = req.params;

    // TODO: 두 번째 업데이트에 end_date 반영하는 방법

    const workOrder = await WorkOrder.selectByIdAndUpdate(
      id,
      { worker_id: req.user.user_id },
      { new: true }
    );
    res.status(200).json({ workOrder });
  }

  async delete(req, res) {
    const { id } = req.params;

    await WorkOrder.selectByIdAndDelete(id);
    res.status(200).json({ message: "Delete success" });
  }
}

class WorkDetailController {
  async create(req, res) {
    const { work_order_id } = req.body;

    const workOrder = await WorkOrder.selectById(work_order_id);
    if (!workOrder) {
      throw CustomError.NotFoundError("Work-order not found");
    }

    const workDetail = await WorkDetail.create(
      { id: util.createId(), ...req.body },
      { new: true }
    );
    res.status(201).json({ workDetail });
  }

  async select(req, res) {
    const { work_order_id } = req.body;

    const workOrder = await WorkOrder.selectById(work_order_id);
    if (!workOrder) {
      throw new CustomError.NotFoundError("Work-order not found");
    }

    const workDetails = await WorkDetail.select({ work_order_id });
    res.status(200).json({ workDetails });
  }
}

class WorkLogController {
  async create(req, res) {
    const workLog = await WorkLog.create(
      { id: util.createId(), worker_id: req.user.user_id, ...req.body },
      { new: true }
    );
    res.status(201).json({ workLog });
  }

  async select(req, res) {
    const { work_order_id } = req.body;

    const workOrder = await WorkOrder.selectById(work_order_id);
    if (!workOrder) {
      throw new CustomError.NotFoundError("Work-order not found");
    }

    const workLogs = await WorkLog.select({ work_order_id });
    res.status(200).json({ workLogs });
  }
}

class ItemController {
  async create(req, res) {
    const { name } = req.body;

    if (!name) {
      throw new CustomError.BadRequestError("Provide name");
    }

    const existingItem = await Item.selectOne({ name });
    if (existingItem) {
      throw new CustomError.BadRequestError("Item name duplicate");
    }

    const item = await Item.create(
      { id: util.createId(), name },
      { new: true }
    );
    res.status(201).json({ item });
  }

  async select(req, res) {
    const items = await Item.select({});
    res.status(200).json({ items });
  }
}

class ImageController {
  async create(req, res) {
    const { id, path } = req.body;

    if (!id || !path) {
      throw new CustomError.BadRequestError("Provide id and path");
    }

    await Image.create({ id, path });
    res.status(201).end();
  }

  async select(req, res) {
    const images = await Image.select({});
    res.status(200).json({ images, user: req.user });
  }

  async selectOne(req, res) {
    const { id } = req.params;

    const image = await Image.selectOne({ id });
    if (!image) {
      throw new CustomError.NotFoundError("Image not found");
    }
    res.status(200).json({ image });
  }
}

class VideoController {
  async create(req, res) {
    const { id, path } = req.body;

    await Video.create({ id, path });
    res.status(201).end();
  }

  async select(req, res) {
    const videos = await Video.select({});
    res.status(200).json({ videos });
  }

  async selectOne(req, res) {
    const { id } = req.params;

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

    const id = util.createId();
    const hash = await bcrypt.hash(password, 10);
    const role = (await User.select({})).length === 0 ? "admin" : "user";

    await User.create({ id, username, password: hash, role });
    res.status(201).json({ message: "Signup success" });
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

    const tokenUser = util.createTokenUser(user);
    let refreshToken = "";
    const existingToken = await Token.selectOne({ user_id: user.id });
    if (existingToken) {
      const { is_valid } = existingToken;
      if (!is_valid) {
        throw new CustomError.UnauthenticatedError("Authentication invalid");
      }

      refreshToken = existingToken.refresh_token;
      util.attachCookiesToResponse({
        res,
        user: tokenUser,
        refresh_token: refreshToken,
      });
      return res.status(200).json({ user: tokenUser });
    }

    const id = util.createId();
    const refresh_token = util.createToken();
    const ip = req.ip;
    // const ip = req.headers["x-forwared-for"];
    // const ip = req.headers["host"];
    const user_agent = req.headers["user-agent"];
    const user_id = user.id;

    await Token.create({ id, refresh_token, ip, user_agent, user_id });

    util.attachCookiesToResponse({ res, user: tokenUser, refresh_token });
    res.status(200).json({ user: tokenUser });
  }

  async signout(req, res) {
    await Token.selectOneAndDelete({ user_id: req.user.user_id });

    res.cookie("access_token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.cookie("refresh_token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.status(200).json({ message: "Signout success" });
  }
}

class MonitorController {
  memory(req, res) {
    const data = memInfo.used;
    res.status(200).json(data);
  }
}

export const authController = new AuthController();
export const workOrderController = new WorkOrderController();
export const monitorController = new MonitorController();
export const imageController = new ImageController();
export const videoController = new VideoController();
export const workDetailController = new WorkDetailController();
export const workLogController = new WorkLogController();
export const itemController = new ItemController();
export const clientController = new ClientController();
