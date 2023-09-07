import { getUserEmail } from '@/db/project'

export default async function handle(req, res) {

  if (req.method == 'GET') {
    const query = req.query;
    const { projectId } = query;
    let rows = await getUserEmail(projectId);
    res.json(rows);

  }
}