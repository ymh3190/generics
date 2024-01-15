import FetchAPI from "../fetch-api";

const signinFormDOM = document.getElementById("signinForm");
const usernameDOM = document.getElementById("username");
const passwordDOM = document.getElementById("password");

signinFormDOM.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameDOM.value;
  const password = passwordDOM.value;

  if (!username || !password) {
    alert("Provide all values");
    return;
  }

  const response = await FetchAPI.post("/auth/signin", { username, password });
  // const response = await FetchAPI.post("/auth/test", { username, password });
  if (response) {
    window.location.href = "/";
  }
});
