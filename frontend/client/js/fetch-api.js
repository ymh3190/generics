const catchResponseError = async (response) => {
  if (response?.status > 399) {
    const data = await response.json();
    alert(data.message);
    return;
  }

  if (!response) {
    alert("Network response error");
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
