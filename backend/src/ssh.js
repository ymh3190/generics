import { readFileSync } from "fs";
import { homedir } from "os";
import { Client } from "ssh2";
import { createWriteStream } from "fs";

// const writeStream = createWriteStream("./test.log", { flags: "a" });
const memInfo = {};

const options = {
  enb: {
    host: process.env.SSH_HOST,
    username: process.env.SSH_USER,
    port: process.env.SSH_PORT,
    privateKey: readFileSync(`${homedir()}/.ssh/id_rsa`),
  },
  home: {
    host: "localhost",
    port: 22,
    username: "yoo",
    privateKey: readFileSync(`${homedir()}/.ssh/id_rsa`),
  },
};

const ssh = new Client();
ssh.on("ready", () => {
  ssh.shell((error, stream) => {
    if (error) throw error;
    stream
      .on("close", () => {
        ssh.end();
      })
      .on("data", (data) => {
        if (/Mem/.test(data)) {
          let result = "";
          result += data;
          result = result.split("\r\n");

          const memTotal = result[0].match(/\d+/).join("");
          const memAvailable = result[2].match(/\d+/).join("");
          memInfo.used = Number(
            100 * ((memTotal - memAvailable) / memTotal)
          ).toFixed(1);
        }
      });
    stream.write("cat /proc/meminfo\n");
    // setInterval(() => {}, 1000);
  });
});

// ssh.connect(options.enb);

export default memInfo;
