import { sql } from '@vercel/postgres';

export async function insertProject(name, userId) {
  let { rows, fields } = await sql`INSERT INTO project ("name", "user_id") VALUES (${name}, ${userId}) RETURNING *`;
  return rows
}

export async function getUserEmail(projectId) {
  let { rows, fields } = await sql`SELECT email from user inner join project on user.id=project.user_id where project.id=${projectId}`;
  return rows[0]
}