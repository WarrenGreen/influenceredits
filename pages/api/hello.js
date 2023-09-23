
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegStatic);


// Create a simple async Next.js API route handler
export default async function handler(req, res) {
  // Send your event payload to Inngest
  let video = {
    id: "42c7bbf4-df41-49d2-8c92-894ffba36436",
    url: "https://influencer-edits.s3.amazonaws.com/videos/8ac80222-7d7e-4157-a9e0-208e995be674.mp4",
  }
  console.log("hit")
  ffmpeg.ffprobe(video.url, function (err, metadata) {
    //console.dir(metadata); // all metadata
    console.log(metadata.format.duration);
    res.status(200).json({ "width": metadata.streams[0].width, "height": metadata.streams[0].height });
  });



}