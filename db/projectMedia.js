import { sql } from '@vercel/postgres';


export async function insertProjectMedia(name, projectId, mediaId) {
  let { rows, fields } = await sql`INSERT INTO public."ProjectMedia" ("name", "projectId", "mediaId") VALUES (${name}, ${projectId}, ${mediaId}) `;
  return rows, fields;
}