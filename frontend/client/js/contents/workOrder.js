import FetchAPI from "../fetch-api";

const workOrderContainerDOMs = document.querySelectorAll("#workorderContainer");
const clientsDOM = document.getElementById("clients");
const searchClientsDOM = document.getElementById("searchClients");
const secondaryDOM = document.getElementById("secondary");
const selectedClientDOM = document.getElementById("selectedClient");
const closeDOM = secondaryDOM.querySelector("#close");
const searchClientDOM = document.getElementById("searchClient");

const clientList = (client) => {
  return `
  <div data-id=${client.id} id='client'>
    <span>${client.association}</span>
    <span>${client.name}</span>
    <span>${client.telephone}</span>
  </div>
  `;
};

const searchClientFormDOM = document.getElementById("searchClientForm");
searchClientFormDOM.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchClient = searchClientDOM.value;
  const regExp = new RegExp(searchClient);

  const response = await FetchAPI.get("/clients");
  if (response) {
    const data = await response.json();
    let html = "";

    for (const client of data.clients) {
      const isAssociation = regExp.test(client.association);
      if (isAssociation) {
        html += clientList(client);
        continue;
      }

      const isName = regExp.test(client.name);
      if (isName) {
        html += clientList(client);
        continue;
      }

      const isTelephone = regExp.test(client.telephone);
      if (isTelephone) {
        html += clientList(client);
        continue;
      }
    }

    clientsDOM.innerHTML = html;

    const clientDOMs = clientsDOM.querySelectorAll("#client");
    for (const clientDOM of clientDOMs) {
      clientDOM.addEventListener("click", async () => {
        const id = clientDOM.dataset.id;
        const response = await FetchAPI.get(`/clients/${id}`);
        if (response) {
          const data = await response.json();
          selectedClientDOM.value = data.client.association;
          secondaryDOM.classList.add("hidden");
        }
      });
    }
  }
});

closeDOM.addEventListener("click", () => {
  secondaryDOM.classList.add("hidden");
});

searchClientsDOM.addEventListener("click", async () => {
  secondaryDOM.classList.remove("hidden");

  const response = await FetchAPI.get("/clients");
  if (response) {
    const data = await response.json();
    let html = "";

    for (const client of data.clients) {
      html += clientList(client);
    }
    clientsDOM.innerHTML = html;
  }

  const clientDOMs = clientsDOM.querySelectorAll("#client");
  for (const clientDOM of clientDOMs) {
    clientDOM.addEventListener("click", async () => {
      const id = clientDOM.dataset.id;
      const response = await FetchAPI.get(`/clients/${id}`);
      if (response) {
        const data = await response.json();
        selectedClientDOM.value = data.client.association;
        secondaryDOM.classList.add("hidden");
      }
    });
  }
});

(async () => {
  for (const workorderContainerDOM of workOrderContainerDOMs) {
    const id = workorderContainerDOM.dataset.client_id;

    const response = await FetchAPI.get(`/clients/${id}`);
    if (response) {
      const clientDOM = workorderContainerDOM.querySelector("#client");
      const data = await response.json();
      clientDOM.innerHTML = `
      <div>
        <span>${data.client.association}</span>
      </div>
      <div>
        <span>${data.client.name}</span>
      </div>
      `;
    }
  }
})();
