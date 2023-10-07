import { Inngest } from "inngest";
import { serve } from "inngest/next";
import { requestThumbnail, requestTranscription } from "./util"
import { addThumbnail } from '@/db/media'
import { createTranscript } from '@/db/transcript'

// Create a client to send and receive events
export const inngest = new Inngest({ name: "AdEditor" });
import { createClient } from '@supabase/supabase-js'
import { updateMedia } from "../../helpers/media";
import { finishVideo } from "../../helpers/finishVideo";

const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegStatic);

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

import { Client, RenderOutputFormat } from 'creatomate';

export const config = {
  maxDuration: 300,
};


const client = new Client(process.env.CREATOMATE_API_KEY);


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


const renderVideo = inngest.createFunction(
  { name: "Render Video" },
  { event: "render/video" },
  async ({ event, step }) => {
    const source = event.data.source
    const projectId = event.data.projectId
    const renderId = event.data.renderId

    console.log("render id: " + renderId)

    if (!process.env.CREATOMATE_API_KEY) {
      res.status(401).end();
      resolve();
      return;
    }

    const options = {
      // outputFormat: 'mp4' as RenderOutputFormat,
      source: source,
    };

    let renderResult = await client.startRender(options)
    await inngest.send({
      name: "render/retrieve",
      data: {
        "renderId": renderId,
        "creatomateRenderId": renderResult[0].id
      },
    });
    return { event, body: { renderResult: renderResult } };
  }
);


const retrieveRender = inngest.createFunction(
  {
    name: "Retrieve Render",
    retries: 1000,
  },
  { event: "render/retrieve" },
  async ({ event, step }) => {
    const renderId = event.data.renderId
    const creatomateRenderId = event.data.creatomateRenderId

    console.log("render id: " + renderId)

    if (!process.env.CREATOMATE_API_KEY) {
      res.status(401).end();
      resolve();
      return;
    }

    const renderResult = await client.fetchRender(creatomateRenderId)
    console.log(renderResult)

    if (renderResult.status != "succeeded") {
      throw new Error("Render: " + creatomateRenderId + " is status: " + renderResult.status);
    }

    const { data, error } = await supabase
      .from("render")
      .update({ url: renderResult.url, status: "complete" })
      .eq("id", renderId)
      .select()

    console.log(data)
    console.log(error)
    return { event, body: { renderResult: renderResult } };
  }
);


// Create an API that serves zero functions
export default serve(inngest, [
  videoUpload,
  renderVideo,
  retrieveRender
]);
