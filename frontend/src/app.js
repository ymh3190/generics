import server from "./server";

(async () => {
  try {
    server.listen();
  } catch (error) {
    console.log(error);
  }
})();

import crypto from "crypto";
import { readdirSync, renameSync } from "fs";
import fetch from "node-fetch";

async function isExistsFile(files) {
  const backendOrigin = process.env.BACKEND_ORIGIN;
  let response;
  for (let file of files) {
    try {
      response = await fetch(`${backendOrigin}/api/v1/images/${file}`);
      if (response.ok) {
        continue;
      }
    } catch (error) {
      console.log(error);
      return;
    }

    if (response.status === 404) {
      try {
        const hex = crypto.randomBytes(16).toString("hex");
        let url = "static/images";
        let path = `/${url}/${hex}.png`;
        response = await fetch(`${backendOrigin}/api/v1/images`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: hex, path }),
        });

        url = "static/videos";
        path = `/${url}/${hex}.mov`;
        response = await fetch(`${backendOrigin}/api/v1/videos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: hex, path }),
        });
        renameSync(`${url}/${file}.png`, `${url}/${hex}.png`);
        renameSync(`${url}/${file}.mov`, `${url}/${hex}.mov`);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

function readLocalStorage() {
  const files = readdirSync("static/videos")
    .filter((file) => {
      if (!file.includes(".DS_Store")) return file;
    })
    .map((file) => file.split(".")[0]);
  return files;
}

(async () => {
  await isExistsFile(readLocalStorage());
})();
