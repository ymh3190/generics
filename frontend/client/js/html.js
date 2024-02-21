//#region item
/**
 * @param {{}} item
 * @returns text/html
 */
const itemList = (item) => {
  return `
  <div data-id=${item.id} id='item' class='item-container'>
    <span id='name'>${item.name}</span>
  </div>
  `;
};
//#endregion item

//#region client
/**
 *
 * @param {{}} client
 * @returns text/html
 */
const clientList = (client) => {
  return `
  <div data-id=${client.id} id='client' class='client-container'>
    <div class='top'>
      <div class='left'>
        <span id='association'>${client.association}</span>
      </div>
      <div>
        <span id='name'>${client.name}</span>
      </div>
    </div>
    <div class='bottom'>
        <span id='telephone'>${client.telephone}</span>
    </div>
  </div>
  `;
};

const clientContainer = (client) => {
  return `
  <div class="client-container highlight cursor-default" id="clientContainer" data-id="${client.id}">
      <div class="preview">
          <div class="preview-top">
              <div class='left'>
                  <span id='association'>
                      ${client.association}
                  </span>
              </div>
              <div>
                  <span id='name'>
                      ${client.name}
                  </span>
              </div>
          </div>
          <div class="preview-bottom">
              <span id='telephone'>
                  ${client.telephone}
              </span>
          </div>
      </div>
      <div class="metadata">
          <div class="datetime">
              <span>
                  ${client.created_at}
              </span>
          </div>
      </div>
  </div>
  `;
};

const clientWorkInfoList = (workOrder) => {
  return `
  <div class="info-container client-work-info" id='clientWorkInfoContainer'
  data-id='${workOrder.id}'>
      <div class="top">
          <div>
              <div id="completeInfo" class="complete-info">
                <span>${workOrder.is_complete ? "complete" : "resolving"}</span>
              </div>
              <div id="endDate" class="end-date">
                <span>${workOrder.end_date ? workOrder.end_date : ""}</span>
              </div>
          </div>
          <div id="urgentInfo" class="urgent-info">
            <span>${workOrder.is_urgent ? "urgent" : ""}</span>
          </div>
      </div>
      <div class="bottom">
          <span>${workOrder.comment ? workOrder.comment : ""}</span>
      </div>
      <div id="worker" class="worker-info">
        <span>${workOrder.worker_id ? workOrder.worker_id : ""}</span>
      </div>
      <div class="datetime">
        <span>${workOrder.created_at}</span>
      </div>
  </div>
  `;
};

const clientPreview = (client) => {
  return `
  <div class='left'>
    <span id='association'>${client.association}</span>
  </div>
  <div class='right'>
    <span id='name'>${client.name}</span>
  </div>
  `;
};
//#endregion client

// TODO: rename function
const detailInfoList = (workInfo) => {
  return `
    <div id='workInfo' class='work-info'>
      <div class='top'>
        <span>${workInfo.item.name}</span>
      </div>
      <div class='bottom'>
        <div class='detail'>
          <div>
            <span>depth</span>
          </div>
          <div>
            <span>width</span>
          </div>
          <div>
            <span>length</span>
          </div>
          <div>
            <span>quantity</span>
          </div>
          <div>
            <span>remnant</span>
          </div>
        </div>
        <div class='values'>
          <div>
            <span>${workInfo.workDetail.depth}</span>
          </div>
          <div>
            <span>${workInfo.workDetail.width}</span>
          </div>
          <div>
            <span>${workInfo.workDetail.length}</span>
          </div>
          <div>
            <span>${workInfo.workDetail.quantity}</span>
          </div>
          <div>
            <span>${workInfo.workDetail.remnant}</span>
          </div>
        </div>
      </div>
    </div>
    `;
};

/**
 *
 * @param {{}} workInfo { item, workDetail }
 * @returns text/html
 */
const workInfoList = (workInfo) => {
  return `
  <div id='workInfo' class='work-info'
  data-work_detail_id='${workInfo.workDetail.id}'
  data-work_order_id='${workInfo.workDetail.work_order_id}' 
  data-item_id='${workInfo.item.id}'>
    <div class='top'>
      <span id='item'>${workInfo.item.name}</span>
    </div>
    <div class='bottom'>
      <div class='detail'>
        <div>
          <span>depth</span>
        </div>
        <div>
          <span>width</span>
        </div>
        <div>
          <span>length</span>
        </div>
        <div>
          <span>quantity</span>
        </div>
        <div>
          <span>remnant</span>
        </div>
      </div>
      <div class='values'>
        <div>
          <span id='depth'>${workInfo.workDetail.depth}</span>
        </div>
        <div>
          <span id='width'>${workInfo.workDetail.width}</span>
        </div>
        <div>
          <span id='length'>${workInfo.workDetail.length}</span>
        </div>
        <div>
          <span id='quantity'>${workInfo.workDetail.quantity}</span>
        </div>
        <div>
          <span>${workInfo.workDetail.remnant}</span>
        </div>
      </div>
    </div>
  </div>
  `;
};

/**
 *
 * @param {{}} workOrder
 * @param {{}} client
 * @returns text/html
 */
const workOrderList = (workOrder, client) => {
  return `
    <div class="work-order-container" id="workOrderContainer"
    data-id="${workOrder.id}" data-client_id="${workOrder.client_id}"
    data-is_complete="${workOrder.is_complete}"
    data-is_urgent="${workOrder.is_urgent}">
        <div class="preview">
            <div class="preview-top">
                <div class="left">
                <div>
                    ${
                      !workOrder.is_complet
                        ? '<span id="complete">resolving</span>'
                        : `<span>complete</span><div><span>${workOrder.end_date}</span></div>`
                    }
                </div>
                <div>
                    ${
                      workOrder.is_urgent
                        ? '<span id="urgent">urgent</span>'
                        : '<span id="urgent"></span>'
                    }
                </div>
            </div>
            <div class="right" id="right">
                <a id="ellipsis">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </a>
                <div class="embedded hidden" id="embedded">
                    <div class="primary">
                        <div class="embedded-list">
                            <a class="endpoint__update" id="update" data-id="${
                              workOrder.id
                            }"
                                data-client_id="${workOrder.client_id}">
                                <i class="fa-solid fa-scissors"></i>
                                <span>update</span>
                            </a>
                        </div>
                        <div class="embedded-list">
                            <a class="endpoint__delete" id="delete" data-id="${
                              workOrder.id
                            }">
                                <i class="fa-regular fa-trash-can"></i>
                                <span>delete</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <div class="preview-bottom">
                <span>
                    ${workOrder.comment}
                </span>
            </div>
        </div>
        <div class="metadata">
            <div id="client" class="client">
                <div class='left'>
                  <span>${client.association}</span>
                </div>
                <div>
                  <span>${client.name}</span>
                </div>
            </div>
            <div class="datetime">
                <span>
                    ${workOrder.created_at}
                </span>
            </div>
        </div>
    </div>
    `;
};

/**
 *
 * @returns text/html
 */
const workDetailList = () => {
  return `
    <div class='work-detail' id='workDetail'>
      <div>
        <input type='text' id='item' readonly>
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
        <input type='text' id='remnant'>
      </div>
      <div>
        <button id='delete'>delete</button>
      </div>
    </div>
    `;
};

//#region remnant
const remnantZoneList = (zone) => {
  return `
  <div data-id=${zone.id} id='zone' class='zone-container'>
    <div>
      <span id='name'>${zone.name}</span>
    </div>
    <div>
      <span>${zone.comment}</span>
    </div>
  </div>
  `;
};
//#endregion remnant

//#region remnant preview
const remnantPreview = (zone) => {
  return `
  <div data-id=${zone.id} id='zone' class='zone-container'>
    <div>
      <span id='name'>${zone.name}</span>
    </div>
  </div>
  `;
};
//#endregion remnant preview

/**
 *
 * @param {{}} remnantDetail
 * @param {{}} item
 * @param {{}} remnantZone
 * @param {string} creator
 * @returns text/html
 */
const remnantList = (remnantDetail, item, remnantZone, creator) => {
  return `
  <div class="remnant-container" id="remnantContainer"
  data-id="${remnantDetail.id}" data-item_id="${remnantDetail.item_id}"
  data-zone_id="${remnantDetail.remnant_zone_id}"
      data-creator_id="${remnantDetail.creator_id}">
      <div class="preview">
          <div class="preview-top">
              <div class="left">
                <div id="item">${itemList(item)}</div>
                <div id="zone">${remnantPreview(remnantZone)}</div>
              </div>
              <div class="right" id="right">
                <a id="ellipsis">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </a>
                <div class="embedded hidden" id="embedded">
                  <div class="primary">
                    <div class="embedded-list">
                        <a class="endpoint__update" id="update" data-id="${
                          remnantDetail.id
                        }"
                            data-client_id="${remnantDetail.client_id}">
                            <i class="fa-solid fa-scissors"></i>
                            <span>update</span>
                        </a>
                    </div>
                    <div class="embedded-list">
                        <a class="endpoint__delete" id="delete" data-id="${
                          remnantDetail.id
                        }">
                            <i class="fa-regular fa-trash-can"></i>
                            <span>delete</span>
                        </a>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div class="preview-bottom">
              <div>
                  <span>depth</span>
                  <div>
                      <span>
                          ${remnantDetail.depth}
                      </span>
                  </div>
              </div>
              <div>
                  <span>width</span>
                  <div>
                      <span>
                          ${remnantDetail.width}
                      </span>
                  </div>
              </div>
              <div>
                  <span>length</span>
                  <div>
                      <span>
                          ${remnantDetail.length}
                      </span>
                  </div>
              </div>
              <div>
                  <span>quantity</span>
                  <div>
                      <span>
                          ${remnantDetail.quantity}
                      </span>
                  </div>
              </div>
          </div>
      </div>
      <div class="metadata">
          <div id="creator">${creator}</div>
          <div>
            <span>${remnantDetail.created_at}</span>
          </div>
      </div>
  </div>
  `;
};

const remnantDetailList = () => {
  return `
  <div class='remnant-detail' id='remnantDetail'>
    <div>
      <input type='text' id='item' readonly>
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
      <input type='text' id='zone' readonly>
    </div>
    <div>
      <button id='delete'>delete</button>
    </div>
  </div>
  `;
};
//#endregion remnant

//#region creator
const creatorList = (creator) => {
  return `
  <span>${creator}</span>
  `;
};
//#endregion creator

const embeddedList = () => {};

export {
  itemList,
  clientList,
  workInfoList,
  workOrderList,
  workDetailList,
  remnantZoneList,
  remnantList,
  remnantDetailList,
  creatorList,
  clientContainer,
  clientWorkInfoList,
  detailInfoList,
  clientPreview,
  remnantPreview,
};
