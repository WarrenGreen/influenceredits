


export async function getThumbnail(videoId) {

  const response = await fetch(process.env.NEXT_PUBLIC_HOST + '/api/thumbnail/' + videoId, {
    method: 'GET',
  });


  if (!response.ok) {
    throw new Error(`The request failed with status code ${response.status}`);
  }

  return await response.json();
}
