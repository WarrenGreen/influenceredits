import { getThumbnail } from '@/db/media'

export default async function handle(req, res) {

  if (req.method == 'GET') {
    const query = req.query;
    const { mediaId } = query;

    let thumbnailUrl = await getThumbnail(mediaId);
    res.status(200).json(thumbnailUrl || "");

  } else {
    res.status(404).end();
    resolve();
  }
}
