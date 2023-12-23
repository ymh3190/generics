import FetchAPI from "../fetch-api";

const signoutDOM = document.getElementById("signout");

if (signoutDOM) {
  signoutDOM.addEventListener("click", async (event) => {
    event.preventDefault();

    const result = await FetchAPI.delete("/auth/signout");
    if (result) {
      window.location.href = "/signin";
    }
  });
}
