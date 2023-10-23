import Layout from '@/components/Layout'
import TextBlock from '@/components/app/selection/TextBlock'
import VideoBlock from '@/components/app/selection/VideoBlock'
import Timeline from '@/components/app/timeline/Timeline'
import { useEffect, useRef, useState } from 'react'

import { createMedia, getProjectMedia } from '@/helpers/media'
import { getInitialSource, getProject, updateProject } from '@/helpers/project'
import { getProjectSegments } from '@/helpers/segment'
import { getThumbnail } from '@/helpers/thumbnail'
import { useInterval } from '@/helpers/useInterval'

import Loader from '@/components/Loader'
import ProcessStatus from '@/components/app/process_status/ProcessStatus'
import SelectionPreview from '@/components/app/selection/SelectionPreview'
import { v4 as uuid } from 'uuid'
import { PencilSquareIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { createClientComponentClient, createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { Header } from '@/components/Header'
import {SessionHeader} from '@/components/SessionHeader'


import { useMediaQuery } from 'react-responsive'


import React from "react"
import MobileWarningModal from '../../../components/app/MobileWarningModal'
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
      project: await getProject(supabase, projectId),
      projectId,
      initialSession: session,
      user: session.user,
    },
  }
  
}

export default function Editor({initialSession, user, projectVideos, projectSegments, project, projectId}) {
  const supabaseClient = createClientComponentClient()
  let playerRef = useRef();

  let [videos, setVideos] = useState(projectVideos);
  const [segments, setSegments] = useState(projectSegments);
  const initialSource = getInitialSource(projectVideos, projectSegments);
  console.log("source")
  console.log(initialSource)
  const [source, setSource] = useState(initialSource);
  const [projectName, setProjectName] = useState(project.name);
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

    })
  }

  const uploadStartedCallback = (video) => {
    setVideos(videos => [...videos, video]);
  }

  const [editingProjectName, setEditingProjectName] = useState(false)
  const isDesktop = useMediaQuery({
    query: '(min-width: 640px)'
  })
  return (
    <>
    {/*<MobileWarningModal style={{display: isDesktop ? "none" : ""}}/>*/}

    <Layout>

        <>
        <ProcessStatus state="select" projectId={projectId} style={{top:"0", position:"absolute", height: "3.5rem"}} />
        
      <div className='flex' style={{position: "absolute", top: "3rem", left: 0, right: 0, bottom:"3.5rem"}} width="100%">
        <div className="sidebar"> 
          <div className='m-2 font-bold flex items-center justify-between'>
            { !editingProjectName ?
              <>{projectName}<PencilSquareIcon onClick={() => setEditingProjectName(true)} className='w-4 h-4' /></>
              :
              <>
                <input type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={projectName}
                  value={projectName}
                  onChange={(e)=>{setProjectName(e.target.value)}}
                />
                <div className='flex ml-2'>
                  <XCircleIcon onClick={() => {setProjectName(project.name); setEditingProjectName(false);}} className='w-6 h-6 ' />
                  <CheckCircleIcon onClick={() => {project.name=projectName; updateProject(supabaseClient, project); setEditingProjectName(false)}} className='w-6 h-6 ' />
                </div>
              </>
            }

          </div>
          {videos.length ? <video controls className="max-h-52" ref={playerRef} src={videos.length? videos[0].url: null} width="100%"></video> :<div style={{height:"250px", width: "100%", backgroundColor:"gray"}}></div>}
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
      <Timeline supabase={supabaseClient} video={videos[0]} segments={segments} setSegments={setSegments} style={{position: "absolute", left:0, right:0, bottom:0}}></Timeline>
       </> 
      </Layout>
  </>
      
  )
}
