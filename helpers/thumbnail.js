


export async function getThumbnail(videoId) {

  const response = await fetch('http://localhost:8097/api/thumbnail/' + videoId, {
    method: 'GET',
  });


  if (!response.ok) {
    throw new Error(`The request failed with status code ${response.status}`);
  }

  return await response.json();
}
