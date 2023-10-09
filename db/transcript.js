
export async function createTranscript(supabase, projectMediaId, text, words) {

  const { data, error } = await supabase
    .from("transcript")
    .insert({
      project_media_id: projectMediaId,
      text: text,
      words: words
    })
    .select()

  if (error) {
    console.log(error)
    throw new Error('Error fetching data:', error.message);
  }

  return data
}
