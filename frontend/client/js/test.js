import FetchAPI from "./fetch-api";

class Html {
  #dataset;

  async select() {
    const response = await FetchAPI.get("/items");
    if (response) {
      const data = await response.json();
      this.#dataset = Object.values(data);
    }
  }

  render(htmlFn) {
    let htmls = "";
    for (const data of this.#dataset) {
      htmls += htmlFn(data);
    }
    return htmls;
  }
}

const html = new Html();
export default html;
