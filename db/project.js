import { sql } from '@vercel/postgres';

export async function insertProject(name, userId) {
  let { rows, fields } = await sql`INSERT INTO project ("name", "user_id") VALUES (${name}, ${userId}) RETURNING *`;
  return rows
}

export async function getUserEmail(projectId) {
  let { rows, fields } = await sql`SELECT email from public."user" inner join project on public."user".id=project.user_id where project.id=${projectId}`;
  return rows[0]
}