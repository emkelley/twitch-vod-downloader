const fs = require("fs");
const shortid = require("shortid");
const twitch = require("twitch-m3u8");
const m3u8stream = require("m3u8stream");
const { performance } = require("perf_hooks");

var timerStart, timerEnd;

const beginFetch = () => {
  timerStart = performance.now();
  downloadVOD("1025088691");
};

const downloadVOD = (vodID) => {
  // Get VOD M3U8 playlist and save it
  // Strap in, this is gonna take a while
  twitch
    .getVod(vodID)
    .then((data) => {
      /*
        data[0] = source quality
        data[1] = usually 720p for testing
        data[2] = usually 480p for testing
        data[4] = usually 360p for testing
      */
      m3u8stream(data[4].url).pipe(
        fs
          .createWriteStream(`vod-${shortid()}.mp4`)
          .on("pipe", () => {
            console.log("Successfully fetched M3U8 playlist");
            console.log("Starting to pipe data to MP4 file...");
            console.log("This could take some time...");
          })
          .on("finish", finishedWriting)
      );
    })
    .catch((err) => console.error(err));
};

const finishedWriting = () => {
  timerEnd = performance.now();
  console.log(
    "Done. Took " + ((timerEnd - timerStart) / 60000).toFixed(2) + " minutes."
  );
};

beginFetch();
