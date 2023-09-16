
export async function addThumbnail(supabase, id, thumbnailUrl) {
  const { data, error } = await supabase
    .from("media")
    .update({ thumbnail: thumbnailUrl })
    .eq("id", id)
    .select()

  if (error) {
    console.log(error)
    throw new Error('Error fetching data:', error.message);
  }

  return data;
}

