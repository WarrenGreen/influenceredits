import { sql } from '@vercel/postgres';

export async function insertMedia(id, name, url, userId = "88a53bfe-3cb1-11ee-9e27-6f236a9827dd") {
  let { rows, fields } = await sql`INSERT INTO public."Media" ("id", "name", "url", "userId") VALUES (${id}, ${name}, ${url}, ${userId}) `;
  return rows, fields
}

export async function addThumbnail(id, thumbnailUrl) {
  let { rows, fields } = await sql`update "Media" set "thumbnail" ='${thumbnailUrl}' WHERE id='${id}' `;
  return rows, fields
}

