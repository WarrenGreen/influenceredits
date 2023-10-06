import Loader from '@/components/Loader'
import { useEffect, useState } from 'react'

import { getProjectMedia } from '@/helpers/media'
import { getProject } from '@/helpers/project'
import { getProjectSegments } from '@/helpers/segment'

import ProcessStatus from '@/components/app/process_status/ProcessStatus'
import { overlayCreator } from '@/stores/OverlayCreatorStore'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { observer } from 'mobx-react-lite'

import Tooltip from '@/components/Tooltip'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { useMediaQuery } from 'react-responsive'
import { Header } from '@/components/Header'
import {SessionHeader} from '@/components/SessionHeader'


import ResizeIcon from '@/components/Icons/ResizeIcon'
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ChatBubbleLeftEllipsisIcon,
  MapIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

import React from "react"
import ComboBox from '../../../components/ComboBox'
import ResizeGrid from '../../../components/app/overlay/ResizeGrid'
import TemplateGrid from '../../../components/app/overlay/TemplateGrid'
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

function getWidth(fullSizeWidth, fullSizeHeight, height) {
  return Math.round(height * fullSizeWidth / fullSizeHeight);
}


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Overlay = observer(({projectId, projectVideos, projectSegments, user}) => {
  const [sidebarState, setSidebarState] = useState("Templates")
  const [resolution, setResolution] = useState([projectVideos[0].width, projectVideos[0].height]);

  const supabaseClient = createClientComponentClient();

  const initialSource = {
    "output_format": "mp4",
    "width": getWidth(projectVideos[0].width, projectVideos[0].height, 300),
    "height": 300,
    "elements": projectSegments.map((segment) => {
      
      return {
        "id": segment.id,
        "type": "video",
        "track": 1,
        "width": getWidth(projectVideos[0].width, projectVideos[0].height, 300),
        "height": 300,
        "trim_start": segment.timeStart / 1000,
        "trim_duration": (segment.timeEnd-segment.timeStart) / 1000,
        "source": projectVideos[0].url
      }
    })
  }
  const [source, setSource] = useState(initialSource);

  useEffect(() => {
    console.log("chnage")
    supabaseClient.from("project").update({source: overlayCreator.preview?.source}).eq("id", projectId)

  }, [overlayCreator.preview?.source])


  useEffect(() => {
    setSource(oldSource => {
      return {...oldSource, width: getWidth(resolution[0], resolution[1], 300), height: 300}
    })
  }, [resolution])

  /*useEffect(() => {
    if (overlayCreator.preview)
      overlayCreator.preview?.setSource(source)
  }, [source])
*/


  const navigation = [
    { name: 'Templates', onClick:()=>setSidebarState("Templates"), icon: MapIcon },
    { name: 'Subtitles', onClick:()=>setSidebarState("Subtitles"), icon: ChatBubbleLeftEllipsisIcon },
    { name: 'Resize', onClick:()=>setSidebarState("Resize"), icon: ResizeIcon },
  ]

  const isDesktop = useMediaQuery({
    query: '(min-width: 640px)'
  })

  return (
    <>
    { isDesktop ?
    <div className='flex flex-col h-full'>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <ProcessStatus state="overlay" projectId={projectId}  />
      <div className="flex overflow-hidden" style={{flex: 1}}>
        <div className="hiddenlg:z-50 lg:block lg:w-20 lg:bg-purple-900 lg:pb-4 overflow-x-visible">
          <nav className="mt-8">
            <ul role="list" className="flex flex-col items-center space-y-1">
              {navigation.map((item) => (
                <Tooltip key={'tooltip' + item.name} text={item.name}>
                <li key={item.name} onClick={item.onClick}>
                  <a
                    className={classNames(
                      sidebarState == item.name ? 'bg-purple-800 text-white' : 'text-purple-400 hover:text-white hover:bg-purple-800',
                      'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold'
                    )}
                  >
                    <item.icon alt={item.name} color="currentColor" className="h-6 w-6 shrink-0" aria-hidden="true" />
                    <span className="sr-only">{item.name}</span>
                  </a>
                </li>
                </Tooltip>
              ))}
            </ul>
          </nav>
        </div>

        <main className="p-5 overflow-y-scroll" style={{width: "500px"}}>
            { sidebarState == "Templates" ? 
                <TemplateGrid thumbnail={projectVideos[0].thumbnail} resolution={resolution} />
              :
              sidebarState == "Resize" ?
                <div className='flex flex-col gap-y-4' >
                  <ComboBox callback={(fillType) => {overlayCreator.setFillType(fillType)}}/>
                  <hr />
                  <ResizeGrid originalResolution={[projectVideos[0].width, projectVideos[0].height]} setResolution={setResolution} />
                </div>
              :
              <>Coming Soon</>
            }
        </main>

        <div style={{flex:2}} className="bg-slate-200 overflow-y-auto border-r border-gray-200 h-full flex flex-col">
          <div className="h-10 w-full bg-white flex justify-center gap-6">
            {!overlayCreator.isPlaying ? <PlayIcon onClick={() => {overlayCreator.preview?.play()}} className='w-6 cursor-pointer' /> 
            :
            <PauseIcon onClick={() => {overlayCreator.preview?.pause()}} className='w-6 cursor-pointer' /> 
          }
            <ArrowUturnLeftIcon onClick={() => {overlayCreator.preview?.undo()}} className='w-6 cursor-pointer'/>
            <ArrowUturnRightIcon  onClick={() => {overlayCreator.preview?.redo()}} className='w-6 cursor-pointer'/>
            </div>
            <div 
              ref={(element) => {
                if (element && element !== overlayCreator.preview?.element) {
                  overlayCreator.initializeVideoPlayer(element, source, projectId);
                }
              }}
              className="flex-1 m-5" 
            ></div>
            
            {(overlayCreator.isLoading) && <div className="flex flex-col w-full h-full justify-center items-center"><Loader /><div>Your preview is loading...</div></div>}
        </div>
      </div>
    </div>
    :
    <>
        {user ? <SessionHeader />  : <Header />}
        <div>We&lsquore sorry, this app is only for big screens. Please come back on a desktop.</div>
        </>
            }
            </>
  )
})

export default Overlay;