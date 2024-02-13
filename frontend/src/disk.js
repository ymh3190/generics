import crypto from "crypto";
import { readdirSync, renameSync } from "fs";
import FetchAPI from "./fetch-api";
import fetch from "node-fetch";

const writeDiskAndDB = async ({ images, videoExts }) => {
  const url = `${process.env.REMOTE_ORIGIN}/api/v1/images`;

  for (let i = 0; i < images.length; i++) {
    const [name, imgExt] = images[i].split(".");
    const response = await fetch(url + `/${name}`);
    if (response?.ok) {
      continue;
    }

    const id = crypto.randomUUID().replaceAll("-", "");
    const imageBasePath = `static/images/`;
    const videoBasePath = `static/videos/`;
    const imagePath = "/" + imageBasePath + `${id}.${imgExt}`;
    const videoPath = "/" + videoBasePath + `${id}.${videoExts[i]}`;

    await FetchAPI.post("/images", { id, path: imagePath });
    await FetchAPI.post("/videos", { id, path: videoPath });

    const oldImagePath = imageBasePath + `${name}.${imgExt}`;
    const newImagePath = imageBasePath + `${id}.${imgExt}`;
    const oldVideoPath = videoBasePath + `${name}.${videoExts[i]}`;
    const newVideoPath = videoBasePath + `${id}.${videoExts[i]}`;
    renameSync(oldImagePath, newImagePath);
    renameSync(oldVideoPath, newVideoPath);
  }
};

function readDisk() {
  const images = readdirSync("static/images").filter((file) => {
    if (!file.includes(".DS_Store")) {
      return file;
    }
  });
  const videoExts = readdirSync("static/videos")
    .filter((file) => {
      if (!file.includes(".DS_Store")) {
        return file;
      }
    })
    .map((file) => file.split(".")[1]);
  return { images, videoExts };
}

(async () => {
  await writeDiskAndDB(readDisk());
})();
