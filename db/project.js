import { sql } from '@vercel/postgres';

export async function insertProject(name, userId) {
  let { rows, fields } = await sql`INSERT INTO project ("name", "user_id") VALUES (${name}, ${userId}) RETURNING *`;
  return rows
}