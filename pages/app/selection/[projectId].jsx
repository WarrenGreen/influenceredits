import { useEffect, useRef, useState } from 'react'
import Layout from '@/components/Layout'
import TextBlock from '@/components/app/selection/TextBlock'
import VideoBlock from '@/components/app/selection/VideoBlock'
import Timeline from '@/components/app/timeline/Timeline'

import { createMedia, getProjectMedia } from '@/helpers/media'
import {getSegments, getProjectSegments} from '@/helpers/segment'
import {getInitialSource} from '@/helpers/project'
import {getTranscript} from '@/helpers/transcript'
import { getThumbnail } from '@/helpers/thumbnail'
import {useInterval} from '@/helpers/useInterval'

import ProcessStatus from '@/components/app/process_status/ProcessStatus'
import { Flex } from '@radix-ui/themes'
import { Oval } from 'react-loader-spinner'
import { v4 as uuid } from 'uuid'
import UploadVideo from '@/components/app/Upload'
import SelectionPreview from '@/components/app/selection/SelectionPreview'

import { useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import AccessDenied from '@/components/accessDenied'


import React from "react" 
React.useLayoutEffect = React.useEffect 



export const getServerSideProps = async (context) => {
  if (typeof context.params.projectId != "string" || context.params.projectId == "[object Object]") return {props: {projectVideos: []}}
  const projectId = context.params.projectId

  return {
    props: {
      projectVideos: await getProjectMedia(projectId),
      projectSegments: await getProjectSegments(projectId),
      projectId,
      session: await getServerSession(context.req, context.res, authOptions)
    },
  }
  
}

export default function Editor({session, projectVideos, projectSegments, projectId}) {

  let playerRef = useRef();

  let [videos, setVideos] = useState(projectVideos);
  let [selectedVideo, setSelectedVideo] = useState(videos.length ==0? null: videos[0].id);
  const [segments, setSegments] = useState(projectSegments);
  const initialSource = getInitialSource(projectVideos, projectSegments);
  const [source, setSource] = useState(initialSource);


  useEffect(() => {
    const newSource = {...source};
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

    console.log(newSource)
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
          let transcript = await getTranscript(video.projectMediaId)
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
    setCurrentVideo(video)
    setVideos(videos => [...videos, video]);
    setSelectedVideo(video.id);

  }


  let currentVideo_beta = null;
  for (let index in videos) {
    if (selectedVideo == videos[index].id) {
      currentVideo_beta = videos[index]
    }
  }
  const [currentVideo, setCurrentVideo] = useState(currentVideo_beta)

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null

  // If no session exists, display access denied message
  if (!session) { return  <Layout><AccessDenied/></Layout> }

  return (
    <>
    <Layout>
      <ProcessStatus state="select" projectId={projectId} style={{top:"0", height: "3.5rem"}} />
    <Flex direction="row" position="fixed" style={{top:"3.5rem", bottom:"3.5rem"}} width="100%">
      <div className="sidebar"> 
        {currentVideo != null ? <video controls ref={playerRef} src={currentVideo? currentVideo.url: null} width="100%"></video> :<div style={{height:"250px", width: "100%", backgroundColor:"gray"}}></div>}
        <UploadVideo uploadStartedCallback={uploadStartedCallback} uploadFinishedCallback={uploadFinishedCallback} />
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
            aria-label='oval-loading'
            secondaryColor=""
            strokeWidth={4}
            strokeWidthSecondary={4}/>
            <div>{currentVideo.status}</div>
          </div>
        :
        <div style={{flex: 4, display:"flex", overflow: "hidden"}}>
          <TextBlock video={currentVideo} seekVideo={seekVideo} segments={segments} setSegments={setSegments} projectMediaId={currentVideo.projectMediaId} />
          <SelectionPreview source={source} video={currentVideo} segments={segments} setSegments={setSegments} projectMediaId={currentVideo.projectMediaId}/>
        </div>
        )
      }
      
    </Flex>
    <Timeline video={currentVideo} segments={segments} setSegments={setSegments} x></Timeline>
    </Layout>
  </>
      
  )
}
