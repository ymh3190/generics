const signinFormDOM = document.getElementById("signinForm");
const usernameDOM = document.getElementById("username");
const passwordDOM = document.getElementById("password");

signinFormDOM.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameDOM.value;
  const password = passwordDOM.value;

  if (!username || !password) {
    // TODO: throw error
    return;
  }

  let response;
  try {
    response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (response.status === 400) {
      // TODO: throw error
    } else if (response.status === 404) {
      // TODO: throw error
    } else if (!response) {
      throw new Error("Network response error");
    }
  } catch (error) {
    console.log(error);
    return;
  }

  if (response.ok) {
    window.location.href = "/";
  }
});
