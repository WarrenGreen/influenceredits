import Layout from '@/components/Layout'
import { useState } from 'react'

import { getProjectMedia } from '@/helpers/media'
import { getInitialSource, getProject, updateProject } from '@/helpers/project'
import { getProjectSegments } from '@/helpers/segment'

import OverlayCreator from '@/components/app/overlay/OverlayCreator'
import ProcessStatus from '@/components/app/process_status/ProcessStatus'
import { videoCreator } from '@/stores/VideoCreatorStore'
import { createClientComponentClient, createPagesServerClient } from '@supabase/auth-helpers-nextjs'

import Tooltip from '@/components/Tooltip'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import ResizeIcon from '@/components/Icons/ResizeIcon'
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  MapIcon,
  XMarkIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline'

import React from "react"
import Image from 'next/image'
import TemplateGrid from '../../../components/app/overlay/TemplateGrid'
import ResizeGrid from '../../../components/app/overlay/ResizeGrid'
import ComboBox from '../../../components/ComboBox'
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


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Overlay({projectId}) {

  const [sidebarState, setSidebarState] = useState("Templates")
  const [resolution, setResolution] = useState([2540, 1414]);

  const navigation = [
    { name: 'Templates', onClick:()=>setSidebarState("Templates"), icon: MapIcon },
    { name: 'Subtitles', onClick:()=>setSidebarState("Subtitles"), icon: ChatBubbleLeftEllipsisIcon },
    { name: 'Resize', onClick:()=>setSidebarState("Resize"), icon: ResizeIcon },
  ]

  return (
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
        {/* Static sidebar for desktop */}
        <div className="hiddenlg:z-50 lg:block lg:w-20 lg:bg-purple-900 lg:pb-4 overflow-x-visible">
          <nav className="mt-8">
            <ul role="list" className="flex flex-col items-center space-y-1">
              {navigation.map((item) => (
                <Tooltip text={item.name}>
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

        <main className="p-5 overflow-y-scroll" style={{flex: 1}}>
            { sidebarState == "Templates" ? 
                <TemplateGrid resolution={resolution} />
              :
              sidebarState == "Resize" ?
                <div className='flex flex-col gap-y-4' >
                  <ComboBox />
                  <hr />
                  <ResizeGrid originalResolution={[2540, 1414]} setResolution={setResolution} />
                </div>
              :
              <></>
            }
        </main>

        <div style={{flex:2}}className="bg-slate-200 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
          {/* Main area */}
        </div>
      </div>
    </div>
  )
}
