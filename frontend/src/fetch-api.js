import crypto from "crypto";
import { readdirSync, renameSync } from "fs";
import fetch from "node-fetch";
import * as CustomError from "./error";

const catchResponseError = async (response) => {
  if (response?.status === 400) {
    const data = await response.json();
    throw new CustomError.BadRequestError(data.message);
  }

  if (response?.status === 401) {
    const data = await response.json();
    throw new CustomError.UnauthenticatedError(data.message);
  }

  if (response?.status === 403) {
    const data = await response.json();
    throw new CustomError.UnauthorizedError(data.message);
  }

  if (response?.status === 404) {
    const data = await response.json();
    throw new CustomError.NotFoundError(data.message);
  }

  if (!response) {
    throw new Error("Network response error");
  }

  throw new Error("Undefined response error");
};

class FetchAPI {
  static #url = `${process.env.REMOTE_ORIGIN}/api/v1`;

  /**
   *
   * @param {string} path
   * @param {{}} options
   * @returns
   */
  static async get(path, options) {
    if (options) {
      const response = await fetch(FetchAPI.#url + path, {
        headers: { cookie: options.cookie },
      });
      if (response?.ok) {
        return response;
      }
      return await catchResponseError(response);
    }

    const response = await fetch(FetchAPI.#url + path);
    if (response?.ok) {
      return response;
    }
    await catchResponseError(response);
  }

  /**
   *
   * @param {string} path
   * @param {{}} data
   * @param {{}} options
   * @returns
   */
  static async post(path, data, options) {
    if (options) {
      const headers = {
        "Content-Type": "application/json",
      };
      if (options.ip) {
        headers["X-Forwared-For"] = options.ip;
      }
      if (options.userAgent) {
        headers["User-Agent"] = options.userAgent;
      }
      if (options.cookie) {
        headers.cookie = options.cookie;
      }
      const response = await fetch(FetchAPI.#url + path, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      if (response?.ok) {
        return response;
      }
      return await catchResponseError(response);
    }

    const response = await fetch(FetchAPI.#url + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response?.ok) {
      return response;
    }
    await catchResponseError(response);
  }

  /**
   *
   * @param {string} path
   * @param {{}} data
   * @returns
   */
  static async patch(path, data) {
    const response = await fetch(FetchAPI.#url + path, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response?.ok) {
      return response;
    }
    await catchResponseError(response);
  }

  /**
   *
   * @param {string} path
   * @param {{}} options
   * @returns
   */
  static async delete(path, options) {
    if (options) {
      const response = await fetch(FetchAPI.#url + path, {
        method: "DELETE",
        headers: { cookie: options.cookie },
      });
      if (response?.ok) {
        return response;
      }
      return await catchResponseError(response);
    }

    const response = await fetch(FetchAPI.#url + path, {
      method: "DELETE",
    });
    if (response?.ok) {
      return response;
    }
    await catchResponseError(response);
  }
}

const writeDiskAndDB = async ({ images, videoExts }) => {
  const url = `${process.env.REMOTE_ORIGIN}/api/v1/images`;

  for (let i = 0; i < images.length; i++) {
    const [name, imgExt] = images[i].split(".");
    const response = await fetch(url + `/${name}`);
    if (response?.ok) {
      continue;
    }

    const id = crypto.randomUUID().replaceAll("-", "");
    const imageBasePath = `static/images/`;
    const videoBasePath = `static/videos/`;
    const imagePath = "/" + imageBasePath + `${id}.${imgExt}`;
    const videoPath = "/" + videoBasePath + `${id}.${videoExts[i]}`;

    await FetchAPI.post("/images", { id, path: imagePath });
    await FetchAPI.post("/videos", { id, path: videoPath });

    const oldImagePath = imageBasePath + `${name}.${imgExt}`;
    const newImagePath = imageBasePath + `${id}.${imgExt}`;
    const oldVideoPath = videoBasePath + `${name}.${videoExts[i]}`;
    const newVideoPath = videoBasePath + `${id}.${videoExts[i]}`;
    renameSync(oldImagePath, newImagePath);
    renameSync(oldVideoPath, newVideoPath);
  }
};

function readDisk() {
  const images = readdirSync("static/images").filter((file) => {
    if (!file.includes(".DS_Store")) {
      return file;
    }
  });
  const videoExts = readdirSync("static/videos")
    .filter((file) => {
      if (!file.includes(".DS_Store")) {
        return file;
      }
    })
    .map((file) => file.split(".")[1]);
  return { images, videoExts };
}

(async () => {
  await writeDiskAndDB(readDisk());
})();

export default FetchAPI;
