




export async function getTranscript(supabase, projectMediaId) {

  const { data, error } = await supabase
    .from('transcript')
    .select('*')
    .eq('project_media_id', projectMediaId);

  if (error) {
    console.log(error)
    throw new Error('Error fetching data:', error.message);
  }

  console.log(data)

  return data;
}
