import Layout from '@/components/Layout'
import { useState } from 'react'

import { getProjectMedia } from '@/helpers/media'
import { getInitialSource, getProject, updateProject } from '@/helpers/project'
import { getProjectSegments } from '@/helpers/segment'

import OverlayCreator from '@/components/app/overlay/OverlayCreator'
import ProcessStatus from '@/components/app/process_status/ProcessStatus'
import { videoCreator } from '@/stores/VideoCreatorStore'
import { createClientComponentClient, createPagesServerClient } from '@supabase/auth-helpers-nextjs'



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
      project: await getProject(supabase, projectId),
      projectId,
      initialSession: session,
      user: session.user,
    },
  }
  
}

export default function Editor({projectVideos, projectSegments, projectId}) {

  const initialSource = getInitialSource(projectVideos, projectSegments);
  videoCreator.source = initialSource;

  const [source, setSource] = useState(initialSource);
  const [segments, setSegments] = useState(projectSegments);
  let [selectedVideo, setSelectedVideo] = useState(projectVideos.length ==0? null: projectVideos[0].id);



  let currentVideo_beta = null;
  for (let index in projectVideos) {
    if (selectedVideo == projectVideos[index].id) {
      currentVideo_beta = projectVideos[index]
    }
  }
  const [currentVideo, setCurrentVideo] = useState(currentVideo_beta)


  return (
    <>
    <Layout>
      <ProcessStatus state="overlay" projectId={projectId} style={{top:"0", height: "3.5rem"}} />
      <OverlayCreator />

    </Layout>
    </>
  )
}