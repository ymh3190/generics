class Util {
  getDateTime() {
    const dateTime = new Date();
    const years = dateTime.getFullYear();
    const months = String(dateTime.getMonth() + 1).padStart(2, "0");
    const dates = String(dateTime.getDate()).padStart(2, "0");
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");
    const seconds = String(dateTime.getSeconds()).padStart(2, "0");
    return { years, months, dates, hours, minutes, seconds };
  }
}

const util = new Util();
export default util;
