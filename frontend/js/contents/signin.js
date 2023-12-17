const signinFormDOM = document.getElementById("signinForm");
const usernameDOM = document.getElementById("username");
const passwordDOM = document.getElementById("password");

signinFormDOM.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameDOM.value;
  const password = passwordDOM.value;

  let data;
  let response;
  try {
    response = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response) {
      throw new Error("Network response error");
    }
    data = await response.json();
  } catch (error) {
    console.log(error);
    return;
  }

  if (response.status === 401) {
    return;
  }

  if (response.ok) {
    window.location.href = "/";
  }
});
