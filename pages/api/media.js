import { Inngest } from 'inngest';

const inngest = new Inngest({ name: "AdEditor" });

export default async function handle(req, res) {
  if (req.method === 'POST') {
    const { video, projectId } = req.body;

    await inngest.send({
      name: "media/video.upload",
      data: {
        video: video,
        projectMediaId: projectId
      },
    });

    res.status(200).end();
  }

}