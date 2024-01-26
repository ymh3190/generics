import FetchAPI from "../fetch-api";

const signoutDOM = document.getElementById("signout");

signoutDOM.addEventListener("click", async (event) => {
  event.preventDefault();

  const response = await FetchAPI.delete("/auth/signout");
  // TODO: 사파리에서 로그아웃시 /signin redirect 안되는 버그
  if (response) {
    window.location.href = "/signin";
  }
});
