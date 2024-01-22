import FetchAPI from "../fetch-api";

const signoutDOM = document.getElementById("signout");

if (signoutDOM) {
  signoutDOM.addEventListener("click", async (event) => {
    event.preventDefault();

    const response = await FetchAPI.delete("/auth/signout");
    if (response) {
      localStorage.removeItem("device-id");
      window.location.href = "/signin";
    }
  });
}
