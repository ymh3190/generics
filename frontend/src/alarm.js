class Orderer {
  #fields;

  constructor() {
    this.#fields = [];
  }

  addField(field) {
    this.#fields.push(field);
  }

  removeField(field) {
    return this.#fields.filter((ws) => ws !== field);
  }

  notifyFields(event) {
    this.#fields.forEach((ws) => {
      ws.send(event);
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
