export async function createSegment(segment) {


  const response = await fetch('http://localhost:8097/api/segment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(segment),
  });


  if (!response.ok) {
    throw new Error(`The request failed with status code ${response.status}`);
  }

  return await response.json();
}

export async function getProjectSegments(projectId) {

  const response = await fetch('http://localhost:8097/api/segment/' + projectId,
    {
      method: 'GET',
    }
  );


  return response.json();
}

export async function getSegments(projectMediaId) {

  const response = await fetch('http://localhost:8097/api/segment/' + projectMediaId, {
    method: 'GET',
  });


  if (!response.ok) {
    throw new Error(`The request failed with status code ${response.status}`);
  }

  return await response.json();
}


export async function moveSegments(segments) {

  const response = await fetch('http://localhost:8097/api/segment', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(segments),
  });


  if (!response.ok) {
    throw new Error(`The request failed with status code ${response.status}`);
  }

  return await response.json();
}


export async function deleteSegment(segmentId) {

  const response = await fetch('http://localhost:8097/api/segment/' + segmentId, {
    method: 'DELETE',
  });


  if (!response.ok) {
    throw new Error(`The request failed with status code ${response.status}`);
  }

  return await response.json();
}
