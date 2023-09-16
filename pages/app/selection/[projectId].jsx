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
import Loader from '@/components/Loader'

import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import React from "react" 
React.useLayoutEffect = React.useEffect 

export const getServerSideProps = async (context) => {

  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(context)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  if (typeof context.params.projectId != "string" || context.params.projectId == "[object Object]") return {props: {projectVideos: []}}
  const projectId = context.params.projectId

  return {
    props: {
      projectVideos: await getProjectMedia(supabase, projectId),
      projectSegments: await getProjectSegments(supabase, projectId),
      projectId,
      initialSession: session,
      user: session.user,
    },
  }
  
}

export default function Editor({initialSession, user, projectVideos, projectSegments, projectId}) {
  const supabaseClient = createClientComponentClient()
  let playerRef = useRef();

  let [videos, setVideos] = useState(projectVideos);
  const [segments, setSegments] = useState(projectSegments);
  const initialSource = getInitialSource(projectVideos, projectSegments);
  const [source, setSource] = useState(initialSource);

  useEffect(() => {
    if (videos[0] == undefined) {
      return 
    }
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

    setSource(newSource);
  }, [segments]);


  const seekVideo = (time) => {
    playerRef.current.currentTime=Math.round(time/1000);
  }

  const refreshThumbnails = async () => {
    videos.map(async (video) =>{ 
      if (video.thumbnail == null || video.thumbnail == "") {
        let thumbnailUrl = await getThumbnail(supabaseClient, video.id)
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
        if (video.projectMediaId != null && !video.words) {
          setVideos( await getProjectMedia(supabaseClient, projectId))
        }
    })
  }

  useInterval(() => {
    refreshWords();
    refreshThumbnails();
  }, 1000);

  const uploadFinishedCallback = (video) => {
    
    createMedia(supabaseClient, video,  projectId, user.id).then((newVideo) => {
    setVideos(videos => videos.map((currentVideo) => {
        return {...newVideo, status:"transcribing"};
    }));
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
  }



  return (
    <>
    <Layout>
      <div className='flex flex-col' style={{height: "100%"}}>
      <ProcessStatus state="select" projectId={projectId} style={{top:"0", height: "3.5rem"}} />
    <div className='flex' style={{flex: 1}} width="100%">
      <div className="sidebar"> 
        {videos.length ? <video controls ref={playerRef} src={videos.length? videos[0].url: null} width="100%"></video> :<div style={{height:"250px", width: "100%", backgroundColor:"gray"}}></div>}
        <div className="video-set">
          {videos.map((video) => {
              return <VideoBlock key={uuid()} video={video} selected={true} />
          })}
        </div>
		  </div>

      
      {
      videos.length ==0 ? 
        <></>
      : 
        (!videos[0].words ? 
          <div className="flex flex-col items-center justify-center" style={{flex: 4}}>
            <Loader />
            <div className="text-6xl p-10">Transcribing.</div>
            <div className="text-s text-slate-600">This could take a few moments so grab a coffee or switch tabs. We&apos;ll be here.</div>
          </div>
        :
        <div style={{flex: 4, display:"flex", overflow: "hidden"}}>
          <TextBlock supabaseClient={supabaseClient} video={videos[0]} seekVideo={seekVideo} segments={segments} setSegments={setSegments} projectMediaId={videos[0].projectMediaId} />
          <SelectionPreview source={source} video={videos[0]} segments={segments} setSegments={setSegments} projectMediaId={videos[0].projectMediaId}/>
        </div>
        )
      }
      
    </div>
    <Timeline supabase={supabaseClient} video={videos[0]} segments={segments} setSegments={setSegments}></Timeline>
    </div>
    </Layout>
  </>
      
  )
}
