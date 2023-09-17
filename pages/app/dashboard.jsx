import { useEffect, useRef, useState } from 'react'
import {Button} from '@/components/Button'
import LoaderPage from '@/components/LoaderPage'

import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

import {getProjectMedia } from '@/helpers/media'
import {getProjects} from '@/helpers/project'
import React from "react" 
import UploadModal from '@/components/app/UploadModal'
import AppHeader from '@/components/app/Header'
import ProjectList from '@/components/app/dashboard/ProjectList'
React.useLayoutEffect = React.useEffect 



export const getServerSideProps = async (context) => {
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(context)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const {
      data: { user },
    } = await supabase.auth.getUser()

  if (!session || !user )
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  let projects = await getProjects(supabase, user.id)
  projects = await Promise.all(projects.map(async (project) => {
    const projectMedia = await getProjectMedia(supabase, project.id);
    if (projectMedia && projectMedia.length) {
      project.thumbnail = projectMedia[0].thumbnail
    }
    return project;
  }))
  
  

  return { props: { host: process.env.NEXT_PUBLIC_HOST, projects } }
}

export default function Dashboard({projects}) {

  const [showModal, setShowModal] = useState(false);
  const [routerLoading, setRouterLoading] = useState(false)

  
  return (
    <>
    {routerLoading ? 
    <LoaderPage/>
    :
    <>
      <AppHeader >
        <ProjectList createNewProject={()=>{setShowModal(true)}} projects={projects} />
      </AppHeader>
      {showModal? <UploadModal setRouterLoading={setRouterLoading} setShowModal={setShowModal}/>:<></>}
    </>
    }
    </>
  )
}