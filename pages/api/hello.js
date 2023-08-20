import { inngest } from "./inngest";
import { getThumbnail } from '@/db/media'
import { requestThumbnail } from "@/helpers/thumbnail";


// Create a simple async Next.js API route handler
export default async function handler(req, res) {
  // Send your event payload to Inngest
  let video = {
    id: "42c7bbf4-df41-49d2-8c92-894ffba36436",
    url: "https://influencer-edits.s3.amazonaws.com/videos/42c7bbf4-df41-49d2-8c92-894ffba36436.mp4",
  }

  let thumbnailUrl = await getThumbnail(video.id);

  res.status(200).json(thumbnailUrl);

}