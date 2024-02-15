const OPEN = 1;

class Orderer {
  #fields;

  constructor() {
    this.#fields = [];
  }

  /**
   *
   * @param {WebSocket} field
   */
  addField(field) {
    this.#fields.push(field);
  }

  /**
   *
   * @param {WebSocket} field
   */
  removeField(field) {
    return this.#fields.filter((ws) => ws !== field);
  }

  /**
   *
   * @param {string} event
   */
  notifyFields(event) {
    this.#fields.forEach((ws) => {
      if (ws.readyState === OPEN) {
        ws.send(event);
      }
    });
  }
}

const orderer = new Orderer();
export default orderer;

// class PlaceOrder {
//   #observers;

//   constructor(...observers) {
//     this.#observers = observers;
//     this.event = "";
//   }

//   addObserver(observer) {
//     this.#observers.push(observer);
//   }

//   removeObserver(observer) {
//     return this.#observers.filter((obs) => obs !== observer);
//   }

//   notifyObservers(event) {
//     this.event = event;
//     this.#observers.forEach((observer) => {
//       observer.notify(event);
//     });
//   }
// }

// class Field {
//   notify(event) {
//     console.log(event);
//   }
// }

// const field = new Field();
// const placeOrder = new PlaceOrder(field);
// export default placeOrder;
