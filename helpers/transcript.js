




export async function getTranscript(projectMediaId) {

  const response = await fetch(process.env.NEXT_PUBLIC_HOST + '/api/transcript/' + projectMediaId, {
    method: 'GET',
  });


  if (!response.ok) {
    throw new Error(`The request failed with status code ${response.status}`);
  }

  return await response.json();
}
