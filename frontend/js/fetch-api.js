const catchResponseError = async (response) => {
  const is400 = response?.status === 400;
  const is401 = response?.status === 401;
  const is403 = response?.status === 403;
  const is404 = response?.status === 404;
  const is500 = response?.status === 500;
  if (is400 || is401 || is403 || is404 || is500) {
    const data = await response.json();
    return data.message;
  }

  if (!response) {
    return "Network response error";
  }

  return "Undefined error";
};

class FetchAPI {
  static async get(path) {
    try {
      const response = await fetch("/api" + path);
      if (response?.ok) {
        return response;
      }

      const message = await catchResponseError(response);
      alert(message);
    } catch (error) {}
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
      alert(message);
    } catch (error) {}
  }

  static async patch(path, data) {
    try {
      const response = await fetch("/api" + path, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response?.ok) {
        return response;
      }

      const message = await catchResponseError(response);
      alert(message);
    } catch (error) {}
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
      alert(message);
    } catch (error) {}
  }
}

export default FetchAPI;
