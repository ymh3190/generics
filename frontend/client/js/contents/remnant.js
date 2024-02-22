import FetchAPI from "../fetch-api";
import * as htmls from "../html";

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

const navDOM = document.getElementById("nav");
const headerDOM = document.getElementById("header");

//#region update remnant-detail
const updateRemnantInfoFormDOM = document.getElementById(
  "updateRemnantInfoForm"
);
const updateRemnantInfoPopupDOM = document.getElementById(
  "updateRemnantInfoPopup"
);
const closeUpdateRemnantInfoPopupDOM = document.getElementById(
  "closeUpdateRemnantInfoPopup"
);
const updatedQuantityDOM = document.getElementById("updatedQuantity");
const updatedZoneDOM = document.getElementById("updatedZone");
//#endregion remnant-detail

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
    if (remnantDetailDOM) {
      const zoneDOM = remnantDetailDOM.querySelector("#zone");
      zoneDOM.value = data.remnantZone.name;
      zoneDOM.dataset.id = data.remnantZone.id;
      zonesPopupDOM.classList.add("hidden");
      return;
    }
    updatedZoneDOM.value = data.remnantZone.name;
    updatedZoneDOM.dataset.id = data.remnantZone.id;
    updateRemnantInfoPopupDOM.classList.remove("hidden");
    zonesPopupDOM.classList.add("hidden");
  }
}

function rightHandler() {
  const embeddedDOMs = contentDOM.querySelectorAll("#embedded");
  const embeddedDOM = this.querySelector("#embedded");
  embeddedDOMs.forEach((dom) => {
    if (dom !== embeddedDOM) {
      dom.classList.add("hidden");
      return;
    }
    embeddedDOM.classList.remove("hidden");
  });
}

async function updateHandler(event) {
  event.stopPropagation();

  const embeddedDOMs = contentDOM.querySelectorAll("#embedded");
  embeddedDOMs.forEach((embeddedDOM) => {
    embeddedDOM.classList.add("hidden");
  });

  popupDOM.classList.remove("hidden");
  updateRemnantInfoPopupDOM.classList.remove("hidden");
  popupDOM.classList.add("transparent");

  updatedQuantityDOM.value = this.dataset.quantity;
  const remnant_zone_id = this.dataset.zone_id;
  const [zoneRes, zonesRes] = await Promise.all([
    FetchAPI.get(`/remnant-zones/${remnant_zone_id}`),
    FetchAPI.get("/remnant-zones"),
  ]);
  if (zoneRes) {
    const data = await zoneRes.json();
    const remnantZone = data.remnantZone;
    updatedZoneDOM.value = remnantZone.name;
    updateRemnantInfoFormDOM.dataset.id = this.dataset.id;
  }

  if (zonesRes) {
    const data = await zonesRes.json();
    let html = "";
    const remnantZones = data.remnantZones;
    for (const zone of remnantZones) {
      html += htmls.remnantZoneList(zone);
    }
    zonesDOM.textContent = "";
    zonesDOM.insertAdjacentHTML("beforeend", html);

    const zoneDOMs = zonesDOM.querySelectorAll("#zone");
    for (const zoneDOM of zoneDOMs) {
      zoneDOM.addEventListener("click", clickZoneHandler);
    }
  }
}

async function deleteHandler() {
  if (!confirm("Delete Forever?")) {
    return;
  }

  const remnantDetailId = this.dataset.id;
  const response = await FetchAPI.delete(`/remnant-details/${remnantDetailId}`);
  if (response) {
    remnantContainerDOMs.forEach((remnantContainerDOM) => {
      const id = remnantContainerDOM.dataset.id;
      if (remnantDetailId === id) {
        remnantContainerDOM.remove();
      }
    });
  }
}

const addHandler = async () => {
  itemsPopupDOM.classList.remove("hidden");
  searchZonePopupDOM.classList.remove("hidden");
  searchZonesDOM.value = "";

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

  const html = htmls.remnantDetailList();
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
      html += htmls.remnantZoneList(zone);
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

    let item;
    let response = await FetchAPI.get(`/items/${item_id}`);
    if (response) {
      const data = await response.json();
      item = data.item;
    }
    if (!item) {
      return;
    }

    let remnantZone;
    response = await FetchAPI.get(`/remnant-zones/${remnant_zone_id}`);
    if (response) {
      const data = await response.json();
      remnantZone = data.remnantZone;
    }
    if (!remnantZone) {
      return;
    }

    let remnantDetail;
    response = await FetchAPI.post("/remnant-details", {
      item_id,
      depth,
      width,
      length,
      quantity,
      remnant_zone_id,
    });
    if (response) {
      const data = await response.json();
      remnantDetail = data.remnantDetail;
    }
    if (!remnantDetail) {
      return;
    }

    let creator;
    response = await FetchAPI.get(`/users/${remnantDetail.creator_id}`);
    if (response) {
      const data = await response.json();
      creator = data.user.username;
    }
    if (!creator) {
      return;
    }

    const html = htmls.remnantList(remnantDetail, item, remnantZone, creator);
    contentDOM.insertAdjacentHTML("afterbegin", html);

    popupDOM.classList.add("hidden");
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
    const html = htmls.remnantZoneList(data.remnantZone);
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
  const lastRemnantDetailDOM = remnantDetailsDOM.querySelector(
    "#remnantDetail:last-child"
  );
  lastRemnantDetailDOM.remove();
};

const closeZonesPopupHandler = () => {
  zonesPopupDOM.classList.add("hidden");
  const lastRemnantDetailDOM = remnantDetailsDOM.querySelector(
    "#remnantDetail:last-child"
  );
  lastRemnantDetailDOM.remove();
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

const docsHandler = (event) => {
  const isESC = event.key === "Escape";
  if (isESC) {
    // bodyDOM.removeEventListener("click", bodyHandler);
    popupDOM.classList.remove("blur");
    // workDetailPopupDOM.classList.remove("blur");
    navDOM.classList.remove("blur");
    headerDOM.classList.remove("blur");
    popupDOM.classList.add("hidden");
    zonesPopupDOM.classList.add("hidden");
    // workDetailPopupDOM.classList.add("hidden");
    itemsPopupDOM.classList.add("hidden");
    // clientsPopupDOM.classList.add("hidden");
  }
};

const updateRemnantInfoFormHandler = async (event) => {
  event.preventDefault();

  const zone = updatedZoneDOM.value;
  if (!zone) {
    alert("Zone not found");
    updatedZoneDOM.focus();
    return;
  }

  const quantity = updatedQuantityDOM.value;
  if (!quantity) {
    alert("Quantity not found");
    updatedQuantityDOM.focus();
    return;
  }

  const data = { quantity };
  const remnant_zone_id = updatedZoneDOM.dataset.id;
  let remnantZone;
  if (remnant_zone_id) {
    data.remnant_zone_id = remnant_zone_id;
    const response = await FetchAPI.get(`/remnant-zones/${remnant_zone_id}`);
    if (response) {
      const data = await response.json();
      remnantZone = data.remnantZone;
    }
  }
  const remnantDetailId = updateRemnantInfoFormDOM.dataset.id;
  const response = await FetchAPI.patch(
    `/remnant-details/${remnantDetailId}`,
    data
  );
  if (response) {
    const data = await response.json();
    const remnantDetail = data.remnantDetail;

    const remnantDetailId = updateRemnantInfoFormDOM.dataset.id;
    remnantContainerDOMs.forEach(async (remnantContainerDOM) => {
      const id = remnantContainerDOM.dataset.id;
      if (remnantDetailId === id) {
        const quantityDOM = remnantContainerDOM.querySelector("#quantity");
        quantityDOM.textContent = remnantDetail.quantity;
        const updateDOM = remnantContainerDOM.querySelector("#update");
        updateDOM.dataset.quantity = remnantDetail.quantity;
        const nameDOM = remnantContainerDOM.querySelector("#zone #name");
        nameDOM.textContent = remnantZone.name;
      }
    });

    popupDOM.classList.remove("transparent");
    popupDOM.classList.add("hidden");
    updateRemnantInfoPopupDOM.classList.add("hidden");
  }
};

const closeUpdateRemnantInfoPopupHandler = () => {
  popupDOM.classList.remove("transparent");
  updateRemnantInfoPopupDOM.classList.add("hidden");
  popupDOM.classList.add("hidden");
};

const updatedZoneHandler = () => {
  zonesPopupDOM.classList.remove("hidden");
  updateRemnantInfoPopupDOM.classList.add("hidden");
};

updatedZoneDOM.addEventListener("focus", updatedZoneHandler);
closeUpdateRemnantInfoPopupDOM.addEventListener(
  "click",
  closeUpdateRemnantInfoPopupHandler
);
updateRemnantInfoFormDOM.addEventListener(
  "submit",
  updateRemnantInfoFormHandler
);
document.addEventListener("keydown", docsHandler);
searchZonesFormDOM.addEventListener("submit", searchZonesFormHandler);
closeZonesPopupDOM.addEventListener("click", closeZonesPopupHandler);
closeItemsPopupDOM.addEventListener("click", closeItemsPopupHandler);
createZoneFormDOM.addEventListener("submit", createZoneFormHandler);
newZoneDOM.addEventListener("click", newZoneHandler);
saveDOM.addEventListener("click", saveHandler);
addDOM.addEventListener("click", addHandler);

(async () => {
  remnantContainerDOMs.forEach(async (remnantContainerDOM) => {
    const item_id = remnantContainerDOM.dataset.item_id;
    const remnant_zone_id = remnantContainerDOM.dataset.zone_id;
    const creator_id = remnantContainerDOM.dataset.creator_id;

    const rightDOM = remnantContainerDOM.querySelector("#right");
    rightDOM.addEventListener("click", rightHandler);
    const updateDOM = remnantContainerDOM.querySelector("#update");
    updateDOM.addEventListener("click", updateHandler);
    const deleteDOM = remnantContainerDOM.querySelector("#delete");
    deleteDOM.addEventListener("click", deleteHandler);

    const [itemRes, ZoneRes, userRes] = await Promise.all([
      FetchAPI.get(`/items/${item_id}`),
      FetchAPI.get(`/remnant-zones/${remnant_zone_id}`),
      FetchAPI.get(`/users/${creator_id}`),
    ]);

    let data = await itemRes.json();
    const itemHtml = htmls.itemList(data.item);
    const itemDOM = remnantContainerDOM.querySelector("#item");
    itemDOM.insertAdjacentHTML("beforeend", itemHtml);

    data = await ZoneRes.json();
    const zoneHtml = htmls.remnantPreview(data.remnantZone);
    const zoneDOM = remnantContainerDOM.querySelector("#zone");
    zoneDOM.insertAdjacentHTML("beforeend", zoneHtml);

    data = await userRes.json();
    const creatorHtml = htmls.creatorList(data.user.username);
    const creatorDOM = remnantContainerDOM.querySelector("#creator");
    creatorDOM.insertAdjacentHTML("beforeend", creatorHtml);
  });
})();
