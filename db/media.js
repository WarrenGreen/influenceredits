import { sql } from '@vercel/postgres';

export async function insertMedia(id, name, url, userId = "88a53bfe-3cb1-11ee-9e27-6f236a9827dd") {
  let { rows, fields } = await sql`INSERT INTO media ("id", "name", "url", "user_id") VALUES (${id}, ${name}, ${url}, ${userId}) RETURNING *`;
  return rows, fields
}

export async function addThumbnail(id, thumbnailUrl) {
  let { rows, fields } = await sql`update media set "thumbnail"=${thumbnailUrl} WHERE id=${id} RETURNING *`;
  return rows
}

export async function getThumbnail(id) {
  let { rows, fields } = await sql`select thumbnail from  media  WHERE id=${id}`;

  if (rows.length > 0) return rows[0]['thumbnail']
  else return null;
}

