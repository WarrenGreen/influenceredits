
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegStatic);


// Create a simple async Next.js API route handler
export default async function handler(req, res) {
  // Send your event payload to Inngest
  let video = {
    id: "42c7bbf4-df41-49d2-8c92-894ffba36436",
    url: "https://influencer-edits.s3.amazonaws.com/videos/f1d94779-bb8d-4819-815a-982f85163708.mp4",
  }
  console.log("hit")
  ffmpeg.ffprobe(video.url, function (err, metadata) {
    //console.dir(metadata); // all metadata
    console.log(metadata.format.duration);
    metadata.streams.map((stream) => {
      if (stream.width && stream.height) {
        res.status(200).json({ "width": stream.width, "height": stream.height });
      }
    })

    res.status(504).json({ "error": "No dimensions found for video" })

  });



}