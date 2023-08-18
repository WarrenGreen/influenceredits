import { sql } from '@vercel/postgres';
import { inngest } from "../inngest";

export default async function handle(req, res) {

  if (req.method == 'GET') {
    const query = req.query;
    const { projectId } = query;
    let { rows, fields } = await sql`SELECT "Media".id, "Media".name, "Media".url, "Media"."thumbnail", "Media"."userId" FROM "Media" inner join "ProjectMedia" on "Media".id="ProjectMedia"."mediaId" WHERE "ProjectMedia"."projectId" = ${projectId}`;
    console.log(rows)
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "testFromNext@example.com",
      },
    });
    res.json(rows);

  }
}