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