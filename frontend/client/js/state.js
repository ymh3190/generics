// import FetchAPI from "./fetch-api";

// const authDOM = document.getElementById("auth");

// (async () => {
//   const deviceId = localStorage.getItem("device-id");

//   let isExpired;
//   try {
//     const expiration = JSON.parse(deviceId).expiration;
//     isExpired = Date.now() > expiration;
//   } catch (error) {
//     const response = await FetchAPI.delete("/auth/signout");
//     if (response) {
//       localStorage.removeItem("device-id");
//       window.location.href = "/signin";
//     }
//     return;
//   }

//   if (deviceId && !isExpired) {
//     authDOM.innerHTML = `
//     <a href="/api/auth/signout" id="signout">
//     <i class="fa-solid fa-arrow-right-from-bracket"></i>
//     </a>
//     `;
//     return;
//   }

//   authDOM.innerHTML = `
//     <a href="/signin">
//     <i class="fa-solid fa-arrow-right-to-bracket"></i>
//     </a>
//     `;
// })();
