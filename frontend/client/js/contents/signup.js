import FetchAPI from "../fetch-api";

const signupFormDOM = document.getElementById("signupForm");
const usernameDOM = document.getElementById("username");
const passwordDOM = document.getElementById("password");
const rePasswordDOM = document.getElementById("rePassword");

signupFormDOM.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameDOM.value;
  const password = passwordDOM.value;
  const rePassword = rePasswordDOM.value;
  if (!username || !password || !rePassword) {
    alert("Provide all values");
    return;
  }

  if (password !== rePassword) {
    alert("Password not match");
    return;
  }

  const response = await FetchAPI.post("/auth/signup", {
    username,
    password,
  });
  if (response) {
    window.location.href = "/signin";
  }
});
