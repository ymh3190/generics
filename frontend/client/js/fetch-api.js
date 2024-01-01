const catchResponseError = async (response) => {
  const is400 = response?.status === 400;
  const is401 = response?.status === 401;
  const is403 = response?.status === 403;
  const is404 = response?.status === 404;
  const is500 = response?.status === 500;

  if (is400 || is401 || is403 || is404 || is500) {
    const data = await response.json();
    alert(data.message);
    return;
  }

  if (!response) {
    alert("Network response error");
    return;
  }
};

class FetchAPI {
  static async get(path) {
    const response = await fetch("/api/v1" + path);
    if (response?.ok) {
      return response;
    }
    await catchResponseError(response);
  }

  static async post(path, data) {
    const response = await fetch("/api/v1" + path, {
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

  static async patch(path, data) {
    const response = await fetch("/api/v1" + path, {
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

  static async delete(path) {
    const response = await fetch("/api/v1" + path, {
      method: "DELETE",
    });
    if (response?.ok) {
      return response;
    }
    await catchResponseError(response);
  }
}

export default FetchAPI;
