import { sql } from '@vercel/postgres';

export default async function handle(req, res) {
  if (req.method === 'POST') {
    const { video, thumbnailUrl, projectId } = req.body;

    let { rows, fields } = await sql`INSERT INTO public."Media" ("id", "name", "thumbnail", "url", "userId") VALUES (${video.id}, ${video.name}, ${thumbnailUrl}, ${video.url}, ${"88a53bfe-3cb1-11ee-9e27-6f236a9827dd"}) `;
    console.log(rows)
    console.log(fields)
    let { rows2, fields2 } = await sql`INSERT INTO public."ProjectMedia" ("id", "name", "projectId", "mediaId") VALUES (${video.id}, ${video.name}, ${projectId}, ${video.id}) `;
    console.log(rows2)
    console.log(fields2)
    res.json(rows);
  }

}