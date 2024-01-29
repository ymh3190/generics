import FetchAPI from "../fetch-api";

const remnantContainerDOMs = document.querySelectorAll("#remnantContainer");
const addDOM = document.getElementById("add");
const itemsPopupDOM = document.getElementById("itemsPopup");
const remnantDetailsDOM = document.getElementById("remnantDetails");
const itemsDOM = document.getElementById("items");
const zonesPopupDOM = document.getElementById("zonesPopup");
const zonesDOM = document.getElementById("zones");
const saveDOM = document.getElementById("save");
const popupDOM = document.getElementById("popup");
const contentDOM = document.getElementById("content");

const itemList = (item) => {
  return `
  <div data-id=${item.id} id='item'>
    <span>${item.name}</span>
  </div>
  `;
};

const zoneList = (zone) => {
  return `
  <div data-id=${zone.id} id='zone' style="display: grid; grid-template-columns: repeat(2, 1fr);">
    <div>
      <span>${zone.name}</span>
    </div>
    <div>
      <span>${zone.comment}</span>
    </div>
  </div>
  `;
};

async function clickItemHandler() {
  const id = this.dataset.id;

  const response = await FetchAPI.get(`/items/${id}`);
  if (response) {
    const data = await response.json();
    const remnantDetailDOMs =
      remnantDetailsDOM.querySelectorAll("#remnantDetail");
    for (let i = 0; i < remnantDetailDOMs.length; i++) {
      if (i === remnantDetailDOMs.length - 1) {
        const inputDOMs = remnantDetailDOMs[i].querySelectorAll("input");
        const itemIdDOM = inputDOMs[0];
        itemIdDOM.value = data.item.name;
        itemIdDOM.dataset.id = data.item.id;
      }
    }
    itemsPopupDOM.classList.add("hidden");
    zonesPopupDOM.classList.remove("hidden");
  }
}

async function clickZoneHandler() {
  const id = this.dataset.id;

  const response = await FetchAPI.get(`/remnant-zones/${id}`);
  if (response) {
    const data = await response.json();
    const remnantDetailDOMs =
      remnantDetailsDOM.querySelectorAll("#remnantDetail");
    for (let i = 0; i < remnantDetailDOMs.length; i++) {
      if (i === remnantDetailDOMs.length - 1) {
        const inputDOMs = remnantDetailDOMs[i].querySelectorAll("input");
        const zoneIdDOM = inputDOMs[inputDOMs.length - 1];
        zoneIdDOM.value = data.remnantZone.name;
        zoneIdDOM.dataset.id = data.remnantZone.id;
      }
    }
    zonesPopupDOM.classList.add("hidden");
  }
}

const addHandler = async () => {
  itemsPopupDOM.classList.remove("hidden");

  const html = `
  <div class='remnant-detail' id='remnantDetail'>
    <div>
      <input type='text' name='itemId'>
    </div>
    <div>
      <input type='text' name='depth'>
    </div>
    <div style="display: flex;">
      <div>
        <input type='text' name='width'>
      </div>
      <div>
        <span>x</span>
      </div>
      <div>
        <input type='text' name='length'>
      </div>
    </div>
    <div>
      <input type='text' name='quantity'>
    </div>
    <div>
      <input type='text' name='zoneId'>
    </div>
    <div></div>
  </div>
  `;

  remnantDetailsDOM.insertAdjacentHTML("beforeend", html);
  // const newRemnantDetailDOMs =
  //   remnantDetailsDOM.querySelectorAll("#remnantDetail");
  // for (let i = 0; i < newRemnantDetailDOMs.length; i++) {
  //   if (i === newRemnantDetailDOMs.length - 1) {
  //     const deleteDOM = newRemnantDetailDOMs[i].querySelector("#delete");
  //     deleteDOM.addEventListener("click", () => {
  //       newRemnantDetailDOMs[i].remove();
  //     });
  //   }
  // }

  let response = await FetchAPI.get("/items");
  if (response) {
    const data = await response.json();
    let html = "";

    for (const item of data.items) {
      html += itemList(item);
    }
    itemsDOM.textContent = "";
    itemsDOM.insertAdjacentHTML("beforeend", html);

    const itemDOMs = itemsDOM.querySelectorAll("#item");
    for (const itemDOM of itemDOMs) {
      itemDOM.addEventListener("click", clickItemHandler);
    }
  }

  response = await FetchAPI.get("/remnant-zones");
  if (response) {
    const data = await response.json();
    let html = "";
    const remnantZones = data.remnantZones;
    for (const zone of remnantZones) {
      html += zoneList(zone);
    }
    zonesDOM.textContent = "";
    zonesDOM.insertAdjacentHTML("beforeend", html);

    const zoneDOMs = zonesDOM.querySelectorAll("#zone");
    for (const zoneDOM of zoneDOMs) {
      zoneDOM.addEventListener("click", clickZoneHandler);
    }
  }
};

const saveHandler = async () => {
  const remnantDetailDOMs =
    remnantDetailsDOM.querySelectorAll("#remnantDetail");
  for (const remnantDetailDOM of remnantDetailDOMs) {
    const inputDOMs = remnantDetailDOM.querySelectorAll("input");
    const item_id = inputDOMs[0].dataset.id;
    const depth = inputDOMs[1].value;
    const width = inputDOMs[2].value;
    const length = inputDOMs[3].value;
    const quantity = inputDOMs[4].value;
    const remnant_zone_id = inputDOMs[5].dataset.id;

    if (!item_id || !remnant_zone_id) {
      alert("Provide item and zone");
      return;
    }

    if (!depth || !width || !length || !quantity) {
      alert("Provide all values");
      return;
    }

    const response = await FetchAPI.post("/remnant-details", {
      item_id,
      depth,
      width,
      length,
      quantity,
      remnant_zone_id,
    });
    if (response) {
      const data = await response.json();
      const html = `
      <div class="remnant-container" id="remnantContainer" data-id="${data.remnantDetail.id}"
          data-item_id="${data.remnantDetail.item_id}" data-zone_id="${data.remnantDetail.remnant_zone_id}"
          data-creator_id="${data.remnantDetail.creator_id}">
          <div id="item">
      </div>
          <div>
              <div>
                  <span>depth</span>
                  <span>
                      ${data.remnantDetail.depth}
                  </span>
              </div>
              <div>
                  <span>size</span>
                  <div>
                      <span>
                          ${data.remnantDetail.width}
                      </span>
                      <span>x</span>
                      <span>
                          ${data.remnantDetail.length}
                      </span>
                  </div>
              </div>
              <div>
                  <span>quantity</span>
                  <span>
                      ${data.remnantDetail.quantity}
                  </span>
              </div>
          </div>
          <div>
              <div id="zone"></div>
              <div id="creator"></div>
          </div>
      </div>
      `;
      contentDOM.insertAdjacentHTML("afterbegin", html);
    }
  }

  popupDOM.classList.add("hidden");
  const createRemnantDOM = document.getElementById("createRemnant");
  const icon = createRemnantDOM.querySelector("i");
  icon.className = icon.className.replace("solid", "regular");
};

saveDOM.addEventListener("click", saveHandler);
addDOM.addEventListener("click", addHandler);

(async () => {
  for (const remnantContainerDOM of remnantContainerDOMs) {
    let id = remnantContainerDOM.dataset.item_id;

    let response = await FetchAPI.get(`/items/${id}`);
    if (response) {
      const data = await response.json();
      const html = `
      <span>${data.item.name}</span>
      `;
      const itemDOM = remnantContainerDOM.querySelector("#item");
      itemDOM.insertAdjacentHTML("beforeend", html);
    }

    id = remnantContainerDOM.dataset.zone_id;
    response = await FetchAPI.get(`/remnant-zones/${id}`);
    if (response) {
      const data = await response.json();
      const html = `
      <div>
        <span>${data.remnantZone.name}</span>
      </div>
      <div>
        <span>${data.remnantZone.comment}</span>
      </div>
      `;
      const zoneDOM = remnantContainerDOM.querySelector("#zone");
      zoneDOM.insertAdjacentHTML("beforeend", html);
    }

    id = remnantContainerDOM.dataset.creator_id;
    response = await FetchAPI.get(`/users/${id}`);
    if (response) {
      const data = await response.json();
      const html = `<span>${data.user.username}</span>`;
      const creatorDOM = remnantContainerDOM.querySelector("#creator");
      creatorDOM.insertAdjacentHTML("beforeend", html);
    }
  }
})();
