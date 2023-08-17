
export async function requestThumbnail(source) {
  const response = await fetch('/api/thumbnail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: source,
    }),
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



export async function finishVideo(source) {
  const response = await fetch('/api/render', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: source,
    }),
  });

  const data = await response.json();
  const renderId = data.id
  const pollingEndpoint = `https://api.creatomate.com/v1/renders/${renderId}`
  const headers = {
    authorization: "Bearer aa28f3d303234478a8f35f5c4eb31d8d4a1492359409d600dbb9842aaff3c637082a56d953952601dcc58057104d21c0"
  } 
while (true) {
  const pollingResponse = await fetch(pollingEndpoint, {
    method: 'GET',
    headers: headers,
  });

  const renderResult = await pollingResponse.json()
  if (renderResult.status === 'succeeded') {
    return  renderResult;
  } else if (renderResult.status === 'error') {
    throw new Error(`Render failed: ${renderResult.error}`)
  } else {
    await new Promise((resolve) => setTimeout(resolve, 3000))
  }
}

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('No API key was provided. Please refer to the README.md for instructions.');
    } else {
      throw new Error(`The request failed with status code ${response.status}`);
    }
  }

  return await response.json();
}