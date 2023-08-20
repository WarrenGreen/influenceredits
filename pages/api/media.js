import { insertMedia } from '@/db/media'
import { insertProjectMedia } from '@/db/projectMedia'

import { Inngest } from 'inngest';

const inngest = new Inngest({ name: "InfluencerEdits" });

export default async function handle(req, res) {
  if (req.method === 'POST') {
    const { video, projectId } = req.body;

    let { rows, fields } = await insertMedia(video.id, video.name, video.url);
    let projectMedia = await insertProjectMedia(video.name, projectId, video.id)
    inngest.send({
      name: "media/video.upload",
      data: {
        video: video,
        projectMediaId: projectMedia.id
      },
    });

    video.projectMediaId = projectMedia.id

    res.json(video);

  }

}