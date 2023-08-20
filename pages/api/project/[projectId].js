import { sql } from '@vercel/postgres';

export default async function handle(req, res) {

  if (req.method == 'GET') {
    const query = req.query;
    const { projectId } = query;
    let { rows, fields } = await sql`
    SELECT 
      media.id, 
      project_media.id as "projectMediaId", 
      media.name, 
      media.url, 
      media.thumbnail, 
      media.user_id,
      transcript.words 
    FROM (media 
      inner join 
      project_media on media.id=project_media.media_id )
      left outer join transcript on project_media.id=transcript.project_media_id
    WHERE project_media.project_id=${projectId}`;
    res.json(rows);

  }
}