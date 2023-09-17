import { v4 as uuid } from "uuid";


export async function createProject(supabase, userId, name = "Untitled Project") {
  const { data, error } = await supabase
    .from('project')
    .insert([
      {
        name: name,
        user_id: userId,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error inserting data:', error.message);
    return;
  }
  console.log("no error")
  return data
}

export async function updateProject(supabase, project) {
  const { data, error } = await supabase
    .from('project')
    .update(project)
    .eq('id', project.id)

  if (error) {
    console.error('Error inserting data:', error.message);
    return;
  }

  return data
}

export async function getProjects(supabase, userId) {
  const { data, error } = await supabase
    .from('project')
    .select()
    .eq('user_id', userId)

  if (error) {
    console.error('Error inserting data:', error.message);
    return;
  }

  return data
}

export async function getProject(supabase, projectId) {
  const { data, error } = await supabase
    .from('project')
    .select()
    .single()
    .eq('id', projectId)

  if (error) {
    console.error('Error inserting data:', error.message);
    return;
  }

  return data
}

export function getInitialSource(projectVideos, projectSegments) {
  let initialSource = {
    "output_format": "mp4",
    "width": 240,
    "height": 135,
    "elements": []
  }
  if (!projectVideos || projectVideos.length == 0 || !projectSegments || projectSegments.length == 0) return initialSource;

  initialSource["elements"] = projectSegments.map((segment) => {
    let url = ""
    let videos = projectVideos.filter((video) => {
      if (video.projectMediaId == segment.projectMediaId) return { ...video }
    })
    if (videos.length == 0) {
      console.log(segment.projectMediaId);
    } else {
      url = videos[0].url
    }
    return {
      "id": uuid(),
      "type": "video",
      "track": 1,
      "trim_start": Math.max(0, segment.timeStart) / 1000,
      "trim_duration": Math.max(0, Math.abs(segment.timeEnd - segment.timeStart)) / 1000,
      "source": url
    }
  });

  return initialSource;

}
