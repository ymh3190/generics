const ws = new WebSocket(`ws://${window.location.host}/field`);
ws.onopen = () => {
  console.log("connection success");

  ws.onmessage = (event) => {
    console.log(event.data);
  };

  ws.onclose = () => {
    console.log("connection close");
  };
};
