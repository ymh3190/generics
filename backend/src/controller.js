import bcrypt from "bcrypt";
import {
  User,
  Token,
  Image,
  Video,
  WorkOrder,
  WorkDetail,
  WorkLog,
  Client,
  Item,
  RemnantDetail,
  RemnantZone,
} from "./db";
import * as CustomError from "./error";
import memInfo from "./ssh";
import util from "./util";

class ImageController {
  async create(req, res) {
    const { id, path } = req.body;

    if (!id || !path) {
      throw new CustomError.BadRequestError("Provide id and path");
    }

    await Image.createByManualId({ id, path });
    res.status(201).end();
  }

  async select(req, res) {
    const images = await Image.select({}, "desc");
    // TODO: sort ORM 구현
    // const images = (await Image.select({})).toSorted((a, b) => {
    //   return b.created_at - a.created_at;
    // });

    res.status(200).json({ images });
  }

  async selectById(req, res) {
    const { id } = req.params;

    const image = await Image.selectById(id);
    if (!image) {
      throw new CustomError.NotFoundError("Image not found");
    }
    res.status(200).json({ image });
  }
}

class VideoController {
  async create(req, res) {
    const { id, path } = req.body;

    await Video.createByManualId({ id, path });
    res.status(201).end();
  }

  async select(req, res) {
    const videos = await Video.select({});
    res.status(200).json({ videos });
  }

  async selectById(req, res) {
    const { id } = req.params;

    const video = await Video.selectById(id);
    if (!video) {
      throw new CustomError.NotFoundError("video not found");
    }
    res.status(200).json({ video });
  }
}

class MonitorController {
  memory(req, res) {
    const data = memInfo.used;
    res.status(200).json(data);
  }
}

class UserController {
  async select(req, res) {
    // sol #1
    // const users = (await User.select({})).map((user) => {
    //   delete user.password;
    //   return user;
    // });

    // sol #2 mongoose
    // const users = await User.select({}).filter('-password')

    // sol #3
    const users = await User.select({}, "-password");
    res.status(201).json({ users });
  }

  async selectById(req, res) {
    const { id } = req.params;

    const user = await User.selectById(id, "-password");
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }
    res.status(200).json({ user });
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

    const hash = await bcrypt.hash(password, 10);
    const role = (await User.select({})).length === 0 ? "admin" : "user";

    await User.create({ username, password: hash, role });
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

    const refresh_token = util.createToken();
    const ip = req.headers["x-forwared-for"];
    const user_agent = req.headers["user-agent"];
    const user_id = user.id;

    await Token.create({ refresh_token, ip, user_agent, user_id });

    util.attachCookiesToResponse({ res, user: tokenUser, refresh_token });
    res.status(200).json({ user: tokenUser });
  }

  async signout(req, res) {
    await Token.selectOneAndDelete({ user_id: req.user.user_id });

    res.cookie("access_token", "signout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.cookie("refresh_token", "signout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.status(200).json({ message: "Signout success" });
  }
}

class ItemController {
  async create(req, res) {
    const item = await Item.create(req.body, { new: true });
    res.status(201).json({ item });
  }

  async select(req, res) {
    const items = await Item.select({});
    res.status(200).json({ items });
  }

  async selectById(req, res) {
    const { id } = req.params;

    const item = await Item.selectById(id);
    if (!item) {
      throw new CustomError.NotFoundError("Item not found");
    }
    res.status(200).json({ item });
  }

  async update(req, res) {
    const { id } = req.params;

    const item = await Item.selectByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ item });
  }

  async delete(req, res) {
    const { id } = req.params;

    await Item.selectByIdAndDelete(id);
    res.status(200).json({ message: "Delete success" });
  }
}

class WorkOrderController {
  async create(req, res) {
    req.body.orderer_id = req.user.user_id;
    const workOrder = await WorkOrder.create(req.body, { new: true });
    res.status(201).json({ workOrder });
  }

  async select(req, res) {
    // const workOrders = await WorkOrder.select({});
    const workOrders = await WorkOrder.select({}, "desc");
    // TODO: sort ORM 구현
    // workOrders.sort((a, b) => {
    //   return b.created_at - a.created_at;
    // });
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

    req.body.worker_id = req.user.user_id;
    const workOrder = await WorkOrder.selectByIdAndUpdate(id, req.body, {
      new: true,
    });
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
    const workDetail = await WorkDetail.create(req.body, { new: true });
    res.status(201).json({ workDetail });
  }

  async selectByWorkOrderId(req, res) {
    const { id: work_order_id } = req.params;

    const workDetails = await WorkDetail.select({ work_order_id });
    res.status(200).json({ workDetails });
  }

  async update(req, res) {
    const { id } = req.params;

    const workDetail = await WorkDetail.selectByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ workDetail });
  }

  async delete(req, res) {
    const { id } = req.params;

    await WorkDetail.selectByIdAndDelete(id);
    res.status(200).json({ message: "Delete success" });
  }
}

class WorkLogController {
  async create(req, res) {
    req.body.worker_id = req.user.user_id;
    const workLog = await WorkLog.create(req.body, { new: true });
    res.status(201).json({ workLog });
  }

  async selectByWorkOrderId(req, res) {
    const { id: work_order_id } = req.params;

    const workLogs = await WorkLog.select({ work_order_id });
    res.status(200).json({ workLogs });
  }
}

class ClientController {
  async create(req, res) {
    req.body.creator_id = req.user.user_id;
    const client = await Client.create(req.body, { new: true });
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

  async delete(req, res) {
    const { id } = req.params;

    await Client.selectByIdAndDelete(id);
    res.status(200).json({ message: "Delete success" });
  }
}

class RemnantZoneController {
  async create(req, res) {
    const remnantZone = await RemnantZone.create(req.body, { new: true });
    res.status(201).json({ remnantZone });
  }

  async select(req, res) {
    const remnantZones = await RemnantZone.select({});
    res.status(200).json({ remnantZones });
  }

  async selectById(req, res) {
    const { id } = req.params;

    const remnantZone = await RemnantZone.selectById(id);
    if (!remnantZone) {
      throw new CustomError.NotFoundError("Remnant-Zone not found");
    }
    res.status(200).json({ remnantZone });
  }

  async update(req, res) {
    const { id } = req.params;

    const remnantZone = await RemnantZone.selectByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ remnantZone });
  }

  async delete(req, res) {
    const { id } = req.params;

    await RemnantZone.selectByIdAndDelete(id);
    res.status(200).json({ message: "Delete success" });
  }
}

class RemnantDetailController {
  async create(req, res) {
    req.body.creator_id = req.user.user_id;
    const remnantDetail = await RemnantDetail.create(req.body, { new: true });
    res.status(201).json({ remnantDetail });
  }

  async select(req, res) {
    const remnantDetails = await RemnantDetail.select({});
    res.status(200).json({ remnantDetails });
  }

  async selectById(req, res) {
    const { id } = req.params;

    const remnantDetail = await RemnantDetail.selectById(id);
    if (!remnantDetail) {
      throw new CustomError.NotFoundError("Remnant-Detail not found");
    }
    res.status(200).json({ remnantDetail });
  }

  async update(req, res) {
    const { id } = req.params;

    const remnantDetail = await RemnantDetail.selectByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json({ remnantDetail });
  }

  async delete(req, res) {
    const { id } = req.params;

    await RemnantDetail.selectByIdAndDelete(id);
    res.status(200).json({ message: "Delete success" });
  }
}

export const imageController = new ImageController();
export const videoController = new VideoController();
export const monitorController = new MonitorController();
export const authController = new AuthController();
export const itemController = new ItemController();
export const workOrderController = new WorkOrderController();
export const workDetailController = new WorkDetailController();
export const workLogController = new WorkLogController();
export const clientController = new ClientController();
export const userController = new UserController();
export const remnantZoneController = new RemnantZoneController();
export const remnantDetailController = new RemnantDetailController();
