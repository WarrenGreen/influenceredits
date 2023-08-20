import { insertProject } from '@/db/project';

export default async function handle(req, res) {
  if (req.method === 'POST') {
    const { name, userId } = req.body;
    let rows = await insertProject(name, userId);
    console.log(rows)
    res.json(rows);

  }

}