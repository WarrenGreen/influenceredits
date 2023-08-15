import { useEffect, useRef, useState } from 'react'
import TextBlock from '../components/TextBlock'
import VideoBlock from '../components/VideoBlock'
import Timeline from '../components/timeline/Timeline'
import {requestThumbnail} from '../helpers/finishVideo'
import Layout from '../components/Layout'
import { requestTranscription, defaultWords, defaultVideos, VideoComponent } from '../helpers/utils'

import ProcessStatus from '@/components/process_status/ProcessStatus'
import PreviewModal from '@/components/PreviewModal'
import RenderModal from '@/components/RenderModal'
import { Flex, Button } from '@radix-ui/themes';
import styles from '../styles/selection.module.css'
import UploadVideo from '../components/Upload'
import {v4 as uuid} from 'uuid';
import MyPreview from '@/components/MyPreview'
import {Oval} from 'react-loader-spinner';


export default function Editor({dev = false}) {
  let wordsDefault = []
  let videosDefault = []
  let playerRef = useRef();
  if (dev) {
    wordsDefault = defaultWords;
    videosDefault = defaultVideos;
  }
  let [words, setWords] = useState(wordsDefault);
  let [videos, setVideos] = useState(videosDefault);
  let [selectedVideo, setSelectedVideo] = useState(videos.length ==0? null: videos[0].id);
  const [segments, setSegments] = useState([]);
  const defaultSource = {
    "output_format": "mp4",
    "width": 240,
    "height": 135,
    "elements": [
      {
        "id": defaultVideos[0].id,
        "type": "video",
        "track": 1,
        "trim_start": 0,
        "trim_duration":47,
        "source": defaultVideos[0].url
      },
    ]
  }
  const [source, setSource] = useState(defaultSource);


  useEffect(() => {
    const newSource = {...defaultSource};
    newSource["elements"] = segments.map((segment) => {
      const start = segment.timeStart / 1000;
      const end = segment.timeEnd / 1000;
      return {
        "id": uuid(),
        "type": "video",
        "track": 1,
        "trim_start": Math.max(0, start),
        "trim_duration":Math.max(0, end-start),
        "source": videos[0].url
      }
    })

    setSource(newSource);

  }, [segments]);


  const seekVideo = (time) => {
    playerRef.current.currentTime=Math.round(time/1000);
  }


  const uploadFinishedCallback = (video) => {
    
    setVideos(videos => videos.map((currentVideo) => {
      if (currentVideo.id == video.id) {
        return {...video, status:"transcribing"};
      }else{
        return {...currentVideo};
      }
    }));
    setSelectedVideo(video.id)
    playerRef.current.src=video.url;

    let thumbnailSource = {
      "output_format": "jpg",
      "snapshot_time": 0,
      "width": 50,
      "height": 50,
      "elements": [
        {
          "type": "video",
          "source": video.url
        }
      ]
    }
    requestThumbnail(thumbnailSource).then((data) => {
      setVideos((oldVideos) => 
        oldVideos.map(currentVideo => {
          if (currentVideo.id == video.id) {
            return {...currentVideo, thumbnail: data.url};
          }else{
            return {...currentVideo};
          }
        })
      );
    });

    setSource({
      "output_format": "mp4",
      "width": 2400,
      "height": 1350,
      "duration": "47 s",
      "elements": [
        {
          "id": video.id,
          "type": "video",
          "track": 1,
          "trim_start": 0,
          "trim_duration":47,
          "source": video.url
        },
      ]
    })

    async function request() {
      let transcribedWords = await requestTranscription({"uploadUrl": video.url});
      setVideos(oldVideos => oldVideos.map((currVideo) => {
        if (currVideo.id == video.id) {
          return {...currVideo, status:"loaded", loading: false};
        }else{
          return {...currVideo};
        }
      }));
      setWords(transcribedWords);
        
      }
      console.log("requested")
      request();

  }

  const uploadStartedCallback = (video) => {
    setVideos(videos => [...videos, video]);
    setSelectedVideo(video.id);

  }

  let currentVideo = null;
  for (let index in videos) {
    if (selectedVideo == videos[index].id) {
      currentVideo = videos[index]
    }
  }


  return (
    <>
    <Layout>
      <ProcessStatus style={{top:"0", height: "3.5rem"}} />
    <Flex direction="row" position="fixed" style={{top:"3.5rem", bottom:"3.5rem"}} width="100%">
      <div className="sidebar"> 
        {currentVideo != null ? <video controls ref={playerRef} src={dev?defaultVideos[0].url:null} width="100%"></video> :<div style={{height:"250px", width: "100%", backgroundColor:"gray"}}></div>}
        <UploadVideo uploadStartedCallback={uploadStartedCallback} uploadFinishedCallback={uploadFinishedCallback} />
        <PreviewModal source={source}/>
        <RenderModal source={source} />
        <div className="video-set">
          {videos.map((video) => {
              return <VideoBlock key={uuid()} video={video} selected={video.id == currentVideo.id} />
          })}
        </div>
		  </div>

      
      {currentVideo && currentVideo.loading ? 
        <div className="content-loading">
        <Oval
        height={50}
        width={50}
        color="#BEADFA"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor=""
        strokeWidth={4}
        strokeWidthSecondary={4}
      
      /><div>{currentVideo.status}</div>
      </div>
        :
        <TextBlock words={words} seekVideo={seekVideo} segments={segments} setSegments={setSegments} />
      }
      
    </Flex>
    <Timeline segments={segments} setSegments={setSegments} totalWords={words.length}></Timeline>
    </Layout>
  </>
      
  )
}
