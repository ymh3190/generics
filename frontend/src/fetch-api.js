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

  throw new Error("Undefined response error");
};

class FetchAPI {
  static #url = `${process.env.REMOTE_ORIGIN}/api/v1`;

  /**
   *
   * @param {string} path remote_origin + /api/v1 + path
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
   * @param {string} path remote_origin + /api/v1 + path
   * @param {{}} data
   * @param {{}} options
   * @returns
   */
  static async post(path, data, options) {
    if (options) {
      const headers = {
        "Content-Type": "application/json",
        cookie: options.cookie,
      };
      if (options.ip) {
        headers["X-Forwared-For"] = options.ip;
        headers["User-Agent"] = options.userAgent;
      }
      // if (options.cookie) {
      //   headers.cookie = options.cookie;
      // }
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
   * @param {string} path remote_origin + /api/v1 + path
   * @param {{}} data
   * @param {{}} options
   * @returns
   */
  static async patch(path, data, options) {
    if (options) {
      const response = await fetch(FetchAPI.#url + path, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          cookie: options.cookie,
        },
        body: JSON.stringify(data),
      });
      if (response?.ok) {
        return response;
      }
      return await catchResponseError(response);
    }

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
   * @param {string} path remote_origin + /api/v1 + path
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

export default FetchAPI;
