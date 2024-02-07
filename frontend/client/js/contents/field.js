const webSocket = new WebSocket(`ws://${window.location.host}/field`);
webSocket.onopen = () => {
  console.log("connection success");

  webSocket.onmessage = (event) => {
    console.log(event.data);
  };

  webSocket.onclose = () => {
    console.log("connection close");
  };
};
