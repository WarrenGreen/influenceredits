import { getSegmentByProject, deleteSegment } from '@/db/segment'

export default async function handle(req, res) {

  if (req.method == 'GET') {
    const query = req.query;
    const { segmentId } = query;

    let segment = await getSegmentByProject(segmentId);
    res.status(200).json(segment);

  } else if (req.method == 'DELETE') {
    const query = req.query;
    const { segmentId } = query;

    let segment = await deleteSegment(segmentId);
    res.status(200).json(segment);
  } else {
    res.status(404).end();
    resolve();
  }
}
