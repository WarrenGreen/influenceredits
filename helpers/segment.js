export async function createSegment(supabase, segment) {
  const { data, error } = await supabase
    .from("segment")
    .insert({
      start_index: segment.start,
      end_index: segment.end,
      start_time: segment.timeStart,
      end_time: segment.timeEnd,
      color: segment.color,
      text: segment.text,
      index: segment.index,
      project_media_id: segment.projectMediaId
    })
    .select()

  if (error) {
    console.log(error)
    throw new Error('Error fetching data:', error.message);
  }

  return data
}

export async function getProjectSegments(supabase, projectId) {

  const { data, error } = await supabase
    .from('segment')
    .select(
      `
        id,
        start:start_index,
        end:end_index,
        timeStart:start_time,
        timeEnd:end_time,
        color,
        index,
        text,
        projectMediaId:project_media_id,
        project_media!inner(project_id)
      `
    )
    .eq('project_media.project_id', projectId)
    .order('index');
  console.log(projectId)
  console.log(data)

  if (error) {
    console.log(error)
    throw new Error('Error fetching data:', error.message);
  }

  return data
}

export async function getSegments(supabase, projectMediaId) {

  const { data, error } = await supabase
    .from("segment")
    .select(`
    id,
    start:start_index,
    end:end_index,
    timeStart:start_time,
    timeEnd:end_time,
    color,
    index,
    text,
    projectMediaId:project_media_id,
    project_media (project_id)
    `)
    .eq("project_media_id", projectMediaId)

  if (error) {
    console.log(error)
    throw new Error('Error fetching data:', error.message);
  }

  return data
}


export async function editSegments(supabase, segments) {
  segments.map(async (segment) => {
    const { error } = await supabase
      .from("segment")
      .update({
        start_index: segment.start,
        end_index: segment.end,
        start_time: segment.timeStart,
        end_time: segment.timeEnd,
        color: segment.color,
        text: segment.text,
        index: segment.index,
        project_media_id: segment.projectMediaId
      })
      .eq("id", segment.id)

    if (error) {
      console.log(error)
      throw new Error('Error updating data:', error.message);
    }
  });
}


export async function deleteSegment(supabase, segmentId) {

  const { data, error } = await supabase
    .from("segment")
    .delete()
    .eq("id", segmentId)

  if (error) {
    console.log(error)
    throw new Error('Error fetching data:', error.message);
  }

  return data
}


export const updateSegments = (supabase, segment, setSegments) => {
  setSegments((oldSegments) => {
    let updatedSegments = oldSegments.map((oldSegment) => {
      if (oldSegment.id == segment.id) {
        return { ...segment };
      } else {
        return { ...oldSegment };
      }
    })
    editSegments(supabase, updatedSegments);
    return updatedSegments;
  })
}