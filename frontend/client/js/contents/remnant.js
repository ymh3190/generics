import FetchAPI from "../fetch-api";
import * as htmls from "../htmls";
import perf from "../perf";

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

const newZoneDOM = document.getElementById("newZone");
const createZoneFormDOM = document.getElementById("createZoneForm");
const createZonePopupDOM = document.getElementById("createZonePopup");
const searchZonePopupDOM = document.getElementById("searchZonePopup");
const searchZonesFormDOM = document.getElementById("searchZonesForm");
const nameDOM = document.getElementById("name");
const commentDOM = document.getElementById("comment");
const closeItemsPopupDOM = document.getElementById("closeItemsPopup");
const closeZonesPopupDOM = document.getElementById("closeZonesPopup");

const searchZonesDOM = document.getElementById("searchZones");

async function clickItemHandler() {
  const id = this.dataset.id;

  const response = await FetchAPI.get(`/items/${id}`);
  if (response) {
    const data = await response.json();
    const remnantDetailDOM = remnantDetailsDOM.querySelector(
      "#remnantDetail:last-child"
    );
    const itemDOM = remnantDetailDOM.querySelector("#item");
    itemDOM.value = data.item.name;
    itemDOM.dataset.id = data.item.id;
    itemsPopupDOM.classList.add("hidden");
    zonesPopupDOM.classList.remove("hidden");
  }
}

async function clickZoneHandler() {
  const id = this.dataset.id;

  const response = await FetchAPI.get(`/remnant-zones/${id}`);
  if (response) {
    const data = await response.json();
    const remnantDetailDOM = remnantDetailsDOM.querySelector(
      "#remnantDetail:last-child"
    );
    const zoneDOM = remnantDetailDOM.querySelector("#zone");
    zoneDOM.value = data.remnantZone.name;
    zoneDOM.dataset.id = data.remnantZone.id;
    zonesPopupDOM.classList.add("hidden");
  }
}

const addHandler = async () => {
  itemsPopupDOM.classList.remove("hidden");
  searchZonePopupDOM.classList.remove("hidden");
  const icon = newZoneDOM.querySelector("i");
  icon.className = icon.className.replace("solid", "regular");
  createZonePopupDOM.classList.add("hidden");

  const remnantDetailDOM = remnantDetailsDOM.querySelector(
    "#remnantDetail:last-child"
  );
  if (remnantDetailDOM) {
    const itemDOM = remnantDetailDOM.querySelector("#item");
    const zoneDOM = remnantDetailDOM.querySelector("#zone");
    if (!itemDOM.value) {
      alert("Provide item");
      return;
    }

    if (!zoneDOM.value) {
      itemsPopupDOM.classList.add("hidden");
      zonesPopupDOM.classList.remove("hidden");
      alert("Provide zone");
      return;
    }
  }

  const html = `
  <div class='remnant-detail' id='remnantDetail'>
    <div>
      <input type='text' id='item'>
    </div>
    <div>
      <input type='text' id='depth'>
    </div>
    <div>
      <input type='text' id='width'>
    </div>
    <div>
      <input type='text' id='length'>
    </div>
    <div>
      <input type='text' id='quantity'>
    </div>
    <div>
      <input type='text' id='zone'>
    </div>
    <div>
      <button id='delete'>delete</button>
    </div>
  </div>
  `;
  remnantDetailsDOM.insertAdjacentHTML("beforeend", html);

  const newRemnantDetailDOM = remnantDetailsDOM.querySelector(
    "#remnantDetail:last-child"
  );
  const deleteDOM = newRemnantDetailDOM.querySelector("#delete");
  deleteDOM.addEventListener("click", () => {
    newRemnantDetailDOM.remove();
    itemsPopupDOM.classList.add("hidden");
    zonesPopupDOM.classList.add("hidden");
  });

  let response = await FetchAPI.get("/items");
  if (response) {
    const data = await response.json();
    let html = "";

    for (const item of data.items) {
      html += htmls.itemList(item);
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
      html += htmls.zoneList(zone);
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
    const item_id = remnantDetailDOM.querySelector("#item").dataset.id;
    const depth = remnantDetailDOM.querySelector("#depth").value;
    const width = remnantDetailDOM.querySelector("#width").value;
    const length = remnantDetailDOM.querySelector("#length").value;
    const quantity = remnantDetailDOM.querySelector("#quantity").value;
    const remnant_zone_id = remnantDetailDOM.querySelector("#zone").dataset.id;

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
      const html = htmls.remnantList(data.remnantDetail);
      contentDOM.insertAdjacentHTML("afterbegin", html);

      popupDOM.classList.add("hidden");
      const createRemnantDOM = document.getElementById("createRemnant");
      const icon = createRemnantDOM.querySelector("i");
      icon.className = icon.className.replace("solid", "regular");
    }
  }
};

const newZoneHandler = () => {
  if (createZonePopupDOM.classList.contains("hidden")) {
    createZonePopupDOM.classList.remove("hidden");
    searchZonePopupDOM.classList.add("hidden");
    const icon = newZoneDOM.querySelector("i");
    icon.className = icon.className.replace("regular", "solid");
    return;
  }

  createZonePopupDOM.classList.add("hidden");
  searchZonePopupDOM.classList.remove("hidden");
  const icon = newZoneDOM.querySelector("i");
  icon.className = icon.className.replace("solid", "regular");
};

const createZoneFormHandler = async (event) => {
  event.preventDefault();

  const name = nameDOM.value;
  const comment = commentDOM.value;

  if (!name || !comment) {
    alert("Provide all values");
    return;
  }

  const response = await FetchAPI.post("/remnant-zones", { name, comment });
  if (response) {
    const data = await response.json();
    const html = htmls.zoneList(data.remnantZone);
    zonesDOM.insertAdjacentHTML("beforeend", html);

    const zoneDOM = zonesDOM.querySelector("#zone:last-child");
    zoneDOM.addEventListener("click", clickZoneHandler);
    createZonePopupDOM.classList.add("hidden");
    searchZonePopupDOM.classList.remove("hidden");
    const icon = newZoneDOM.querySelector("i");
    icon.className = icon.className.replace("solid", "regular");
  }
};

const closeItemsPopupHandler = () => {
  itemsPopupDOM.classList.add("hidden");
};

const closeZonesPopupHandler = () => {
  zonesPopupDOM.classList.add("hidden");
};

const searchZonesFormHandler = (event) => {
  event.preventDefault();

  const zone = searchZonesDOM.value;
  const regExp = new RegExp(zone, "i");

  const zoneDOMs = zonesDOM.querySelectorAll("#zone");
  for (const zoneDOM of zoneDOMs) {
    const name = zoneDOM.querySelector("#name").textContent;
    const isName = regExp.test(name);
    if (isName) {
      zoneDOM.classList.remove("hidden");
      continue;
    }
    zoneDOM.classList.add("hidden");
  }
};

searchZonesFormDOM.addEventListener("submit", searchZonesFormHandler);
closeZonesPopupDOM.addEventListener("click", closeZonesPopupHandler);
closeItemsPopupDOM.addEventListener("click", closeItemsPopupHandler);
createZoneFormDOM.addEventListener("submit", createZoneFormHandler);
newZoneDOM.addEventListener("click", newZoneHandler);
saveDOM.addEventListener("click", saveHandler);
addDOM.addEventListener("click", addHandler);

(async () => {
  for (const remnantContainerDOM of remnantContainerDOMs) {
    let id = remnantContainerDOM.dataset.item_id;

    let response = await FetchAPI.get(`/items/${id}`);
    if (response) {
      const data = await response.json();
      const html = htmls.itemList(data.item);
      const itemDOM = remnantContainerDOM.querySelector("#item");
      itemDOM.insertAdjacentHTML("beforeend", html);
    }

    id = remnantContainerDOM.dataset.zone_id;
    response = await FetchAPI.get(`/remnant-zones/${id}`);
    if (response) {
      const data = await response.json();
      const html = htmls.zoneList(data.remnantZone);
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
