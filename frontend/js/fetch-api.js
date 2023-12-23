const catchResponseError = async (response) => {
  const isBadRequest = response?.status === 400;
  const isUnauthenticated = response?.status === 401;
  const isUnauthorized = response?.status === 403;
  const isNotFound = response?.status === 404;
  if (isBadRequest || isUnauthenticated || isUnauthorized || isNotFound) {
    const data = await response.json();
    return data.message;
  }

  if (!response) {
    return "Network response error";
  }
};

class FetchAPI {
  static async get(path) {
    try {
      const response = await fetch("/api" + path);
      if (response?.ok) {
        return response;
      }

      const message = await catchResponseError(response);
      if (message) {
        throw new Error(message);
      }
    } catch (error) {
      alert(error.message);
      return;
    }
  }

  static async post(path, data) {
    try {
      const response = await fetch("/api" + path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response?.ok) {
        return response;
      }

      const message = await catchResponseError(response);
      if (message) {
        throw new Error(message);
      }
    } catch (error) {
      alert(error.message);
      return;
    }
  }

  static async patch(path, data) {
    try {
      const response = await fetch("/api" + path, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response?.ok) {
        return response;
      }

      const message = await catchResponseError(response);
      if (message) {
        throw new Error(message);
      }
    } catch (error) {
      alert(error.message);
      return;
    }
  }

  static async delete(path) {
    try {
      const response = await fetch("/api" + path, {
        method: "DELETE",
      });
      if (response?.ok) {
        return response;
      }

      const message = await catchResponseError(response);
      if (message) {
        throw new Error(message);
      }
    } catch (error) {
      alert(error.message);
      return;
    }
  }
}

export default FetchAPI;
