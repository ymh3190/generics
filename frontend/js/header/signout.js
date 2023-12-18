const signoutDOM = document.getElementById("signout");

signoutDOM.addEventListener("click", async (event) => {
  event.preventDefault();

  let response;
  try {
    response = await fetch("/api/signout", { method: "DELETE" });
    if (!response) throw new Error("Network response error");
  } catch (error) {
    console.log(error);
    return;
  }

  if (response.ok) {
    window.location.href = "/";
  }
});
