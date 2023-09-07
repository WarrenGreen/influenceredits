import { v4 as uuid } from "uuid";


export async function createProject(name = "New Project", userId = "88a53bfe-3cb1-11ee-9e27-6f236a9827dd") {
  const response = await fetch('/api/project', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "name": name,
      "userId": userId
    }),
  });


  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('No API key was provided. Please refer to the README.md for instructions.');
    } else {
      throw new Error(`The request failed with status code ${response.status}`);
    }
  }

  return response.json();
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
      "trim_start": Math.max(0, segment.timeStart)/ 1000,
      "trim_duration": Math.max(0, Math.abs(segment.timeEnd - segment.timeStart)) / 1000,
      "source": url
    }
  });

  return initialSource;

}

export async function getProjectUserEmail(projectId) {
  const response = await fetch(process.env.NEXT_PUBLIC_HOST + '/api/project/' + projectId +'/user', {
    method: 'GET',
  });


  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('No API key was provided. Please refer to the README.md for instructions.');
    } else {
      throw new Error(`The request failed with status code ${response.status}`);
    }
  }

  return await response.json();
}
