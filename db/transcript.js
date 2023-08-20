import { sql } from '@vercel/postgres';


export async function createTranscript(projectMediaId, text, words) {
  let { rows, fields } = await sql`INSERT INTO transcript ("project_media_id", "text", "words") VALUES (${projectMediaId}, ${text}, ${words}) `;
  return rows, fields;
}

export async function getTranscript(projectMediaId) {
  let { rows, fields } = await sql`SELECT * FROM transcript WHERE project_media_id = ${projectMediaId}`;
  return rows;
}