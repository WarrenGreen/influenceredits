import { sql } from '@vercel/postgres';

export async function insertProject(supabase, name, userId) {
  const { data, error } = await supabase
    .from('project')
    .insert([
      {
        name: name,
        user_id: userId,
      },
    ])
    .returning('*');

  if (error) {
    console.error('Error inserting data:', error.message);
    return;
  }

  return data[0]
}

export async function getUserEmail(projectId) {
  let { rows, fields } = await sql`SELECT email from public."user" inner join project on public."user".id=project.user_id where project.id=${projectId}`;
  return rows[0]
}