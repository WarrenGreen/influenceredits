import { v4 as uuid } from "uuid";


export async function createProject(supabase, name = "New Project", userId = "6a34be3e-6b08-4788-9be3-6c2c38025ea6") {
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
