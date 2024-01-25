import FetchAPI from "../fetch-api";

const addDOM = document.getElementById("add");
const workDetailsDOM = document.getElementById("workDetails");

addDOM.addEventListener("click", () => {
  const html = `
  <div class='work-detail-row'>
    <div>
      <input type='text' id='itemName'>
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
      <button>delete</button>
    </div>
  </div>
  `;
  workDetailsDOM.innerHTML += html;
});
