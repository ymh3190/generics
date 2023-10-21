import "../scss/styles.scss";

class DOM {
  constructor(doms) {
    this.doms = [];
    for (const dom of doms) {
      this.doms.push(document.getElementById(dom));
    }
  }
}

class Handler {
  constructor() {}
}

class Event {
  constructor() {}
}

export { DOM, Handler, Event };
