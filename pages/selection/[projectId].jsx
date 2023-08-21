import { useEffect, useRef, useState } from 'react'
import Layout from '../../components/Layout'
import TextBlock from '../../components/TextBlock'
import VideoBlock from '../../components/VideoBlock'
import Timeline from '../../components/timeline/Timeline'
import { defaultVideos, defaultWords } from '../../helpers/utils'

import { createMedia, getProjectMedia } from '@/helpers/media'
import {getSegments, getProjectSegments} from '@/helpers/segment'
import {getTranscript} from '@/helpers/transcript'
import { getThumbnail } from '@/helpers/thumbnail'
import {useInterval} from '@/helpers/useInterval'

import PreviewModal from '@/components/PreviewModal'
import RenderModal from '@/components/RenderModal'
import ProcessStatus from '@/components/process_status/ProcessStatus'
import { Flex } from '@radix-ui/themes'
import { Oval } from 'react-loader-spinner'
import { v4 as uuid } from 'uuid'
import UploadVideo from '../../components/Upload'
import { useRouter } from 'next/router'

import React from "react" 
React.useLayoutEffect = React.useEffect 



export const getServerSideProps = async ({ params }) => {
  if (typeof params.projectId != "string" || params.projectId == "[object Object]") return {props: {projectVideos: []}}
  const projectId = params.projectId
  console.log(projectId)
  let projectVideos = await getProjectMedia(projectId)
  let projectSegments = await getProjectSegments(projectId);
  console.log("segments")
  console.log(projectSegments);
  console.log("videos")
  console.log(projectVideos)

  return {
    props: {projectVideos, projectSegments, projectId},
  }
  
}

export default function Editor({projectVideos, projectSegments, projectId}) {
  let playerRef = useRef();

  let [videos, setVideos] = useState(projectVideos);
  let [selectedVideo, setSelectedVideo] = useState(videos.length ==0? null: videos[0].id);
  const [segments, setSegments] = useState(projectSegments);
  const defaultSource = {
    "output_format": "mp4",
    "width": 240,
    "height": 135,
    "elements": [
      {
      },
    ]
  }
  const [source, setSource] = useState(defaultSource);


  useEffect(() => {
    const newSource = {...source};
    newSource["elements"] = segments.map((segment) => {
      

      let start = null;
      let end = null;
      console.log(segment)
      console.log(segment.timeStart)
      console.log(typeof segment.timeStart)
      console.log(segment.timeStart / 1000)
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

  const refreshThumbnails = async () => {
    videos.map(async (video) =>{ 
      if (video.thumbnail == null || video.thumbnail == "") {
        let thumbnailUrl = await getThumbnail(video.id)
          if (thumbnailUrl){
            setVideos(videos => videos.map((currentVideo) => {
              if (currentVideo.id == video.id) {
                return {...video, thumbnail:thumbnailUrl};
              }else{
                return {...currentVideo};
              }
            }));
          }
      }
    });
  }

  async function refreshWords()  {
    videos.map(async (video) =>{ 
        if (video.projectMediaId != null && video.loading) {
          console.log("words: " + video.projectMediaId)
          console.log(video.words)
          let transcript = await getTranscript(video.projectMediaId)
            console.log(transcript)
            if (transcript.length <=0 || !transcript[0].words) return;
            setVideos(videos => videos.map((currentVideo) => {
              if (currentVideo.id == video.id) {
                return {...video, words:transcript[0].words, status:"loaded", loading: false};
              }else{
                return {...currentVideo};
              }
            }));
        }
    })
  }

  useInterval(() => {
    refreshWords();
    refreshThumbnails();
  }, 1000);

  const uploadFinishedCallback = (video) => {
    
    createMedia(video,  projectId).then((newVideo) => {
    setVideos(videos => videos.map((currentVideo) => {
      if (currentVideo.id == newVideo.id) {
        return {...newVideo, status:"transcribing"};
      }else{
        return {...currentVideo};
      }
    }));
    setSelectedVideo(video.id)
    playerRef.current.src=video.url;
    //setSource({
    //  "output_format": "mp4",
    //  "width": 2400,
    //  "height": 1350,
    //  "duration": "47 s",
    //  "elements": [
    //    {
    //      "id": video.id,
    //      "type": "video",
    //      "track": 1,
    //      "trim_start": 0,
    //      "trim_duration":47,
    //      "source": video.url
    //    },
    //  ]
    //})

    })
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

      
      {
      currentVideo == null ? 
        <></>
      : 
        (currentVideo.loading ? 
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
            strokeWidthSecondary={4}/>
            <div>{currentVideo.status}</div>
          </div>
        :
          <TextBlock words={currentVideo.words} seekVideo={seekVideo} segments={segments} setSegments={setSegments} projectMediaId={currentVideo.projectMediaId} />
        )
      }
      
    </Flex>
    <Timeline segments={segments} setSegments={setSegments} x></Timeline>
    </Layout>
  </>
      
  )
}
