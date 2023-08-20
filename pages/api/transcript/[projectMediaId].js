import { getTranscript } from '@/db/transcript'

export default async function handle(req, res) {

  if (req.method == 'GET') {
    const query = req.query;
    const { projectMediaId } = query;
    let rows = await getTranscript(projectMediaId)
    res.json(rows);

  }
}