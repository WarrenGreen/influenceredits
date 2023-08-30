import { sql } from '@vercel/postgres';


export async function insertProjectMedia(name, projectId, mediaId) {
  let { rows, fields } = await sql`INSERT INTO project_media ("name", "project_id", "media_id") VALUES (${name}, ${projectId}, ${mediaId}) RETURNING *;`;
  if (rows)
    return rows[0];
  else return null;
}


export async function getProjectMedia(projectId) {
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
  return rows

}