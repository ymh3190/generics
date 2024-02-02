const itemList = (item) => {
  return `
    <div data-id=${item.id} id='item' class='item-container'>
      <span id='name'>${item.name}</span>
    </div>
    `;
};

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

const workInfoList = (workInfo) => {
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

const workOrderList = (workOrder, client) => {
  return `
    <div class="work-order-container" id="workOrderContainer"
    data-client_id="${workOrder.client_id}"
    data-is_complete="${workOrder.is_complete}"
    data-is_urgent="${workOrder.is_urgent}">
        <div class="preview">
            <div class="preview-top">
                <div>
                <span>${workOrder.is_complete ? "complete" : "resolving"}</span>
                </div>
                <div>
                <span>${workOrder.is_urgent ? "urgent" : ""}</span>
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
                <div>
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

const workDetailList = () => {
  return `
    <div class='work-detail' id='workDetail'>
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
        <input type='text' id='remnant'>
      </div>
      <div>
        <button id='delete'>delete</button>
      </div>
    </div>
    `;
};

const zoneList = (zone) => {
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

const remnantList = (remnantDetail) => {
  return `
  <div class="remnant-container" id="remnantContainer"
  data-id="${remnantDetail.id}" data-item_id="${remnantDetail.item_id}"
  data-zone_id="${remnantDetail.remnant_zone_id}"
  data-creator_id="${remnantDetail.creator_id}">
      <div id="item"></div>
      <div>
          <div>
              <span>depth</span>
              <span>
                  ${remnantDetail.depth}
              </span>
          </div>
          <div>
              <span>size</span>
              <div>
                  <span>
                      ${remnantDetail.width}
                  </span>
                  <span>x</span>
                  <span>
                      ${remnantDetail.length}
                  </span>
              </div>
          </div>
          <div>
              <span>quantity</span>
              <span>
                  ${remnantDetail.quantity}
              </span>
          </div>
      </div>
      <div>
          <div id="zone"></div>
          <div id="creator"></div>
      </div>
  </div>
  `;
};

export {
  itemList,
  clientList,
  workInfoList,
  workOrderList,
  workDetailList,
  zoneList,
  remnantList,
};
