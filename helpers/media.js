
export async function createMedia(supabase, video, projectId, userId) {
  const { error: mediaError } = await supabase
    .from('media')
    .insert([
      {
        id: video.id,
        name: video.name,
        url: video.url,
        user_id: userId,
      },
    ])
  if (mediaError) {
    console.error(mediaError)
    throw new Error('Error inserting data:', mediaError.message);
  }

  const { data: projectMediaData, error: projectMediaError } = await supabase
    .from('project_media')
    .insert([
      {
        name: video.name,
        media_id: video.id,
        project_id: projectId,
      },
    ])
    .select()
  if (projectMediaError) {
    console.error(projectMediaError)
    throw new Error('Error inserting data:', projectMediaError.message);
  }

  video.projectMediaId = projectMediaData[0].id

  const response = await fetch('/api/media', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      video: video,
      project_id: projectId,
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('No API key was provided. Please refer to the README.md for instructions.');
    } else {
      throw new Error(`The request failed with status code ${response.status}`);
    }
  }

  return video
}

export async function setResolution(supabase, mediaId, width, height) {
  const { error: mediaError } = await supabase
    .from('media')
    .update([
      {
        width: width,
        height: height,
      },
    ])
  .eq('id', mediaId)
  if (mediaError) {
    console.error(mediaError)
    throw new Error('Error inserting data:', mediaError.message);
  }

  const { data: projectMediaData, error: projectMediaError } = await supabase
    .from('project_media')
    .insert([
      {
        name: video.name,
        media_id: video.id,
        project_id: projectId,
      },
    ])
    .select()
  if (projectMediaError) {
    console.error(projectMediaError)
    throw new Error('Error inserting data:', projectMediaError.message);
  }

  video.projectMediaId = projectMediaData[0].id

  const response = await fetch('/api/media', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      video: video,
      project_id: projectId,
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('No API key was provided. Please refer to the README.md for instructions.');
    } else {
      throw new Error(`The request failed with status code ${response.status}`);
    }
  }

  return video
}

export async function getProjectMedia(supabase, projectId) {

  const { data, error } = await supabase
    .from('project_media')
    .select(
      `id,
       media (
        id,
        name,
        url,
        thumbnail,
        userId:user_id
      ),
      transcript (words)`
    )
    .eq('project_id', projectId);

  if (error) {
    console.log(error)
    throw new Error('Error fetching data:', error.message);
  }

  // TODO: Fix the json parsing
  const flatData = data.map((d) => {
    return { projectMediaId: d.id, words: d.transcript && d.transcript.length ? JSON.parse(d.transcript[0].words) : null, ...d.media }
  });

  return flatData;
}