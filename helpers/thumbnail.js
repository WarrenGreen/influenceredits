import { Client } from 'creatomate';

const client = new Client(process.env.CREATOMATE_API_KEY);

export async function requestThumbnail(videoUrl) {

  let thumbnailSource = {
    "output_format": "jpg",
    "snapshot_time": 0,
    "width": 150,
    "height": 150,
    "elements": [
      {
        "type": "video",
        "source": videoUrl
      }
    ]
  }
  return new Promise((resolve) => {
    const options = {
      source: thumbnailSource,
    };

    client
      .render(options)
      .then((renders) => {
        resolve();
        return renders[0].url
      })
      .catch(() => {
      });
  });
}