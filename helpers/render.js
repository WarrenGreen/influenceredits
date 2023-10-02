
export async function render(source, projectId) {
  console.log("1")

  const response = await fetch('/api/render', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: source,
      project_id: projectId,
    }),
  });
  console.log(2)

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('No API key was provided. Please refer to the README.md for instructions.');
    } else {
      throw new Error(`The request failed with status code ${response.status}`);
    }
  }

  return response.json()
}
