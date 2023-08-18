import { insertMedia } from '@/db/media'
import { insertProjectMedia } from '@/db/projectMedia'
import { requestThumbnail } from '@/helpers/thumbnail'

import { Inngest } from 'inngest';

const inngest = new Inngest({ name: "InfluencerEdits" });
export default async function handle(req, res) {
  if (req.method === 'POST') {
    const { video, projectId } = req.body;

    let { rows, fields } = await insertMedia(video.id, video.name, video.url);
    console.log(rows)
    console.log(fields)
    let { rows2, fields2 } = await insertProjectMedia(video.name, projectId, video.id)
    console.log(rows2)
    console.log(fields2)
    await inngest.send({
      // The event name
      name: "media/video.upload",
      // The event's data
      data: {
        "video": video,
      }
    });
    res.json(rows);

  }

}