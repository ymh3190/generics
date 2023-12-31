import FetchAPI from "../fetch-api";

const signinFormDOM = document.getElementById("signinForm");
const usernameDOM = document.getElementById("username");
const passwordDOM = document.getElementById("password");

if (signinFormDOM) {
  signinFormDOM.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = usernameDOM.value;
    const password = passwordDOM.value;

    if (!username || !password) {
      alert("Provide all values");
      return;
    }

    await FetchAPI.post("/auth/signin", {
      username,
      password,
    });
    window.location.href = "/";
  });
}
