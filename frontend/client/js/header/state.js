const deviceId = localStorage.getItem("device-id");

const authDOM = document.getElementById("auth");

if (deviceId) {
  authDOM.innerHTML = `
  <a href="/api/auth/signout" id="signout">
  <i class="fa-solid fa-arrow-right-from-bracket"></i>
  </a>
  `;
} else {
  authDOM.innerHTML = `
  <a href="/signin">
  <i class="fa-solid fa-arrow-right-to-bracket"></i>
  </a>
  `;
}

// <% if (user) {%>
//     <a href="/api/auth/signout" id="signout">
//         <i class="fa-solid fa-arrow-right-from-bracket"></i>
//     </a>
//     <%} else {%>
//         <a href="/signin">
//             <i class="fa-solid fa-arrow-right-to-bracket"></i>
//         </a>
//         <%}%>
