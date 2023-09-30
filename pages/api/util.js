import { Client } from 'creatomate'
import axios from "axios";


const client = new Client(process.env.CREATOMATE_API_KEY);

export async function requestThumbnail(videoUrl, width, height) {

  let thumbnailSource = {
    "output_format": "jpg",
    "snapshot_time": 0,
    "width": width,
    "height": height,
    "elements": [
      {
        "type": "video",
        "source": videoUrl
      }
    ]
  }
  const options = {
    source: thumbnailSource,
  };

  return client.render(options)
}



export async function requestTranscription({ uploadUrl }) {
  const baseUrl = 'https://api.assemblyai.com/v2'

  const headers = {
    authorization: 'ae372dd628344debb66d9312fe7adc7d'
  }

  const data = {
    audio_url: uploadUrl
  }

  const url = `${baseUrl}/transcript`
  const response = await axios.post(url, data, { headers: headers })

  const transcriptId = response.data.id
  const pollingEndpoint = `${baseUrl}/transcript/${transcriptId}`

  while (true) {
    const pollingResponse = await axios.get(pollingEndpoint, {
      headers: headers
    })
    const transcriptionResult = pollingResponse.data

    if (transcriptionResult.status === 'completed') {
      return transcriptionResult;
    } else if (transcriptionResult.status === 'error') {
      throw new Error(`Transcription failed: ${transcriptionResult.error}`)
    } else {
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }
  }

}