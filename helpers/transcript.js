




export async function getTranscript(projectMediaId) {

  const response = await fetch('http://localhost:8097/api/transcript/' + projectMediaId, {
    method: 'GET',
  });


  if (!response.ok) {
    throw new Error(`The request failed with status code ${response.status}`);
  }

  return await response.json();
}
