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

  if (response?.status === 500) {
    const data = await response.json();
    throw new CustomError.InternalServerError(data.message);
  }

  if (!response) {
    throw new Error("Network response error");
  }
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
      const response = await fetch(FetchAPI.#url + path, options);
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
      const response = await fetch(FetchAPI.#url + path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwared-For": options.ip,
          "User-Agent": options.userAgent,
        },
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
      const response = await fetch(FetchAPI.#url + path, options);
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

const writeDiskAndDB = async (files) => {
  const url = `${process.env.REMOTE_ORIGIN}/api/v1/images`;

  for (const file of files) {
    const response = await fetch(url + `/${file}`);
    if (response.ok) {
      continue;
    }

    const id = crypto.randomUUID().replaceAll("-", "");
    let path = `/static/images/${id}.png`;
    await FetchAPI.post("/images", { id, path });
    renameSync(`static/images/${file}.png`, `static/images/${id}.png`);

    path = `/static/videos/${id}.mov`;
    await FetchAPI.post("/videos", { id, path });
    renameSync(`static/videos/${file}.mov`, `static/videos/${id}.mov`);
  }
};

function readDisk() {
  const files = readdirSync("static/images")
    .filter((file) => {
      if (!file.includes(".DS_Store")) {
        return file;
      }
    })
    .map((file) => file.split(".")[0]);
  return files;
}

(async () => {
  await writeDiskAndDB(readDisk());
})();

export default FetchAPI;
