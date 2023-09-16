
export async function createTranscript(supabase, projectMediaId, text, words) {

  const { error } = await supabase
    .from("transcript")
    .insert({
      project_media_id: projectMediaId,
      text: text,
      words: words
    })

  if (error) {
    console.log(error)
    throw new Error('Error fetching data:', error.message);
  }
}
