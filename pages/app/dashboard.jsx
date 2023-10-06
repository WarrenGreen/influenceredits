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

import { useMediaQuery } from 'react-responsive'


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

  const isDesktop = useMediaQuery({
    query: '(min-width: 640px)'
  })
  
  return (
    <>
      <AppHeader >
      {isDesktop ? 
      <ProjectList createNewProject={()=>{setShowModal(true)}} projects={projects} />
      :
      <div>We&lsquore sorry, this app is only for big screens. Please come back on a desktop.</div>
        
      }
      </AppHeader>
      {showModal? <UploadModal setShowModal={setShowModal}/>:<></>}
      
    </>
  )
}