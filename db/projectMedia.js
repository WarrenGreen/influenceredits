import { sql } from '@vercel/postgres';


export async function insertProjectMedia(name, projectId, mediaId) {
  let { rows, fields } = await sql`INSERT INTO project_media ("name", "project_id", "media_id") VALUES (${name}, ${projectId}, ${mediaId}) RETURNING *;`;
  if (rows)
    return rows[0];
  else return null;
}