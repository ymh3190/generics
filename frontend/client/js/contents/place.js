import FetchAPI from "../fetch-api";

const workorderContainerDOMs = document.querySelectorAll("#workorderContainer");

workorderContainerDOMs.forEach(async (workorderContainerDOM) => {
  const id = workorderContainerDOM.dataset.client_id;
  const response = await FetchAPI.get(`/clients/${id}`);
  if (response) {
    const clientDOM = workorderContainerDOM.querySelector("#client");
    const data = await response.json();
    clientDOM.innerHTML = `
    <div>
    <span>${data.association}</span>
    </div>
    <div>
    <span>${data.name}</span>
    </div>
    
    `;
    return;
  }
});
