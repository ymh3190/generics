import "../scss/styles.scss";

(async () => {
  let data;
  let response;
  try {
    response = await fetch("/api/memory");
    data = await response.json();
  } catch (error) {
    console.log(error);
    return;
  }

  if (response.ok) {
    console.log(data);
  }
})();
