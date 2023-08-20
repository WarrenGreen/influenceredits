import { createSegment, moveSegments } from '@/db/segment'


export default async function handle(req, res) {
  if (req.method === 'POST') {
    const segment = req.body;

    let rows = await createSegment(segment);

    res.json(rows);

  } else if (req.method === 'PUT') {
    const segments = req.body;

    let rows = await moveSegments(segments);

    res.json(rows);

  }

}