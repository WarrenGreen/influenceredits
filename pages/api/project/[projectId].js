import { getProjectMedia } from '@/db/projectMedia'

export default async function handle(req, res) {

  if (req.method == 'GET') {
    const query = req.query;
    const { projectId } = query;
    let rows = await getProjectMedia(projectId);
    res.json(rows);

  }
}