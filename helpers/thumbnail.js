


export async function getThumbnail(supabase, videoId) {

  const { data, error } = await supabase
    .from('media')
    .select(
      `thumbnail`
    )
    .eq('id', videoId);

  if (error) {
    console.log(error)
    throw new Error('Error fetching data:', error.message);
  }

  return data;
}
