import { Inngest } from "inngest";
import { serve } from "inngest/next";
import { requestThumbnail } from "@/helpers/thumbnail"
import { addThumbnail } from '@/db/media'

// Create a client to send and receive events
export const inngest = new Inngest({ name: "InfluencerEdits" });


const videoUpload = inngest.createFunction(
  { name: "Video Upload" },
  { event: "media/video.upload" },
  async ({ event, step }) => {
    thumbnailUrl = await requestThumbnail(video.url)
    console.log(event)
    console.log(event.data)
    console.log(thumbnailUrl)
    addThumbnail(event.data.video.id, thumbnailUrl)
    return { event, body: "Hello, World!" };
  }
);

// Create an API that serves zero functions
export default serve(inngest, [
  videoUpload
]);
