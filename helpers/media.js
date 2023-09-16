import { Inngest } from 'inngest';

const inngest = new Inngest({ name: "InfluencerEdits", eventKey: "local" });

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

  inngest.send({
    name: "media/video.upload",
    data: {
      video: video,
      projectMediaId: projectMediaData[0].id
    },
  });

  video.projectMediaId = projectMediaData[0].id
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

  console.log(flatData)

  return flatData;
}