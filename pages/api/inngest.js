import { Inngest } from "inngest";
import { serve } from "inngest/next";
import { requestThumbnail, requestTranscription } from "./util"
import { addThumbnail } from '@/db/media'
import { createTranscript } from '@/db/transcript'

// Create a client to send and receive events
export const inngest = new Inngest({ name: "AdEditor" });
import { createClient } from '@supabase/supabase-js'
import { updateMedia } from "../../helpers/media";

const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegStatic);

// Use a custom domain as the supabase URL
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)


const videoUpload = inngest.createFunction(
  { name: "Video Upload" },
  { event: "media/video.upload" },
  async ({ event, step }) => {

    let videoWidth = null;
    let videoHeight = null;

    ffmpeg.ffprobe(event.data.video.url, async function (err, metadata) {
      if (err) {
        console.error(err)
      } else {
        console.log(metadata.format.duration);
        console.log(metadata.streams[0].width)
        metadata.streams.map((stream) => {
          if (stream.width && stream.height) {
            videoWidth = stream.width;
            videoHeight = stream.height;
          }
        })

        if (!videoWidth || !videoHeight)
          throw Error("No dimensions found for video")

        let thumbnailUrl = (await requestThumbnail(event.data.video.url, videoWidth, videoHeight))[0].url
        let video = await addThumbnail(supabase, event.data.video.id, thumbnailUrl)
        video.width = videoWidth;
        video.height = videoHeight;
        video = updateMedia(supabase, video)

        let transcribedWords = await requestTranscription({ "uploadUrl": event.data.video.url });
        let transcript = await createTranscript(supabase, event.data.video.projectMediaId, transcribedWords.text, JSON.stringify(transcribedWords.words))

        return { event, body: { video: video, transcript: transcript } };

      }
    });

  }
);

// Create an API that serves zero functions
export default serve(inngest, [
  videoUpload,
]);
