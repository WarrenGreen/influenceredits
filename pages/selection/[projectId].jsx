import { useEffect, useRef, useState } from 'react'
import TextBlock from '../../components/TextBlock'
import VideoBlock from '../../components/VideoBlock'
import Timeline from '../../components/timeline/Timeline'
import {requestThumbnail} from '../../helpers/finishVideo'
import Layout from '../../components/Layout'
import { requestTranscription, defaultWords, defaultVideos, VideoComponent } from '../../helpers/utils'
import { useRouter } from 'next/router'

import {createMedia, getProjectMedia} from '@/helpers/media'

import ProcessStatus from '@/components/process_status/ProcessStatus'
import PreviewModal from '@/components/PreviewModal'
import RenderModal from '@/components/RenderModal'
import { Flex } from '@radix-ui/themes';
import UploadVideo from '../../components/Upload'
import {v4 as uuid} from 'uuid';
import {Oval} from 'react-loader-spinner';



export const getServerSideProps = async ({ params }) => {
  let projectVideos = await getProjectMedia(params.projectId)

  return {
    props: {projectVideos},
  }
  
}

export default function Editor({projectVideos, dev = false}) {
  
  let wordsDefault = []
  let videosDefault = projectVideos;
  let playerRef = useRef();
  if (dev) {
    wordsDefault = defaultWords;
    videosDefault = defaultVideos;
  }
  let [words, setWords] = useState(wordsDefault);
  let [videos, setVideos] = useState(videosDefault);
  let [selectedVideo, setSelectedVideo] = useState(videos.length ==0? null: videos[0].id);
  const [segments, setSegments] = useState([]);
  const defaultSource = videosDefault.map((defaultVideo) => {
    return {
    "output_format": "mp4",
    "width": 240,
    "height": 135,
    "elements": [
      {
        "id": defaultVideo.id,
        "type": "video",
        "track": 1,
        "trim_start": 0,
        "trim_duration":47,
        "thumbnail":  defaultVideo.thumbnailUrl,
        "source": defaultVideo.url
      },
    ]
  }
});
  const [source, setSource] = useState(defaultSource);


  useEffect(() => {
    const newSource = {...defaultSource};
    newSource["elements"] = segments.map((segment) => {
      

      let start = null;
      let end = null;
      let startNum = segment.timeStart / 1000;
      let endNum = segment.timeEnd / 1000;
      if (startNum <= endNum){
        start = startNum;
        end=endNum;
      }else{
        start=endNum;
        end = startNum;
      }

      if (start == null || end == null) {
        return {}
      }
      return {
        "id": uuid(),
        "type": "video",
        "track": 1,
        "trim_start": Math.max(0, start),
        "trim_duration":Math.max(0, Math.abs(end-start)),
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

    createMedia(video,  "e07b5aca-3cb1-11ee-9e28-232206fe9a57");
    


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
        {currentVideo != null ? <video controls ref={playerRef} src={currentVideo? currentVideo.url: null} width="100%"></video> :<div style={{height:"250px", width: "100%", backgroundColor:"gray"}}></div>}
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
