import { Inngest } from "inngest";
import { serve } from "inngest/next";
import { requestThumbnail, requestTranscription } from "./util"
import { addThumbnail } from '@/db/media'
import { createTranscript } from '@/db/transcript'

// Create a client to send and receive events
export const inngest = new Inngest({ name: "AdEditor" });
import { createClient } from '@supabase/supabase-js'
import { setResolution } from "../../helpers/media";

const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegStatic);

// Use a custom domain as the supabase URL
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)


const videoUpload = inngest.createFunction(
  { name: "Video Upload" },
  { event: "media/video.upload" },
  async ({ event, step }) => {

    let thumbnailUrl = (await requestThumbnail(event.data.video.url))[0].url
    let video = await addThumbnail(supabase, event.data.video.id, thumbnailUrl)


    ffmpeg.ffprobe(event.data.video.url, function (err, metadata) {
      //console.dir(metadata); // all metadata
      logger.info(metadata.format.duration);
      setResolution(supabase, event.data.video.id, width = metadata.streams[0].width, height = metadata.streams[0].height)
      video.width = metadata.streams[0].width;
      video.height = metadata.streams[0].height;
    });
    let transcribedWords = await requestTranscription({ "uploadUrl": event.data.video.url });
    let transcript = await createTranscript(supabase, event.data.video.projectMediaId, transcribedWords.text, JSON.stringify(transcribedWords.words))

    return { event, body: { video: video, transcript: transcript } };
  }
);

// Create an API that serves zero functions
export default serve(inngest, [
  videoUpload,
]);
