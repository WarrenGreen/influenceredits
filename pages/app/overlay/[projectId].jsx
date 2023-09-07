import { useEffect, useRef, useState } from 'react'
import Layout from '@/components/Layout'
import TextBlock from '@/components/app/selection/TextBlock'
import VideoBlock from '@/components/app/selection/VideoBlock'
import Timeline from '@/components/app/timeline/Timeline'
import { defaultVideos, defaultWords } from '@/helpers/utils'

import { createMedia, getProjectMedia } from '@/helpers/media'
import {getSegments, getProjectSegments} from '@/helpers/segment'
import {getInitialSource} from '@/helpers/project'
import {getTranscript} from '@/helpers/transcript'
import { getThumbnail } from '@/helpers/thumbnail'
import {useInterval} from '@/helpers/useInterval'

import OverlayPreview from '@/components/app/overlay/OverlayPreview'
import RenderModal from '@/components/app/RenderModal'
import OverlayCreator from '@/components/app/overlay/OverlayCreator'
import ProcessStatus from '@/components/app/process_status/ProcessStatus'
import { Flex } from '@radix-ui/themes'
import { Oval } from 'react-loader-spinner'
import { v4 as uuid } from 'uuid'
import UploadVideo from '@/components/app/Upload'
import { useRouter } from 'next/router'
import { videoCreator } from '@/stores/VideoCreatorStore';


import React from "react" 
React.useLayoutEffect = React.useEffect 


export const getServerSideProps = async ({ params }) => {
  if (typeof params.projectId != "string" || params.projectId == "[object Object]") return {props: {projectVideos: []}}
  const projectId = params.projectId
  let projectVideos = await getProjectMedia(projectId)
  let projectSegments = await getProjectSegments(projectId);

  return {
    props: {projectVideos, projectSegments, projectId},
  }
  
}

export default function Editor({projectVideos, projectSegments, projectId}) {

  const initialSource = getInitialSource(projectVideos, projectSegments);
  initialSource.elements.push({
    id: '72ec46a3-610c-4b46-86ef-c9bbc337f012',
    name: 'Tagline',
    type: 'text',
    track: 2,
    time: 1,
    duration: 2.5,
    dynamic: true,
    y: '73.7108%',
          width: '69.7955%',
          height: '12.5699%',
    x_alignment: '50%',
    fill_color: '#ffffff',
    animations: [
      {
        time: 'start',
        duration: 1,
        easing: 'quadratic-out',
        type: 'text-slide',
        scope: 'split-clip',
        split: 'word',
        direction: 'up',
      },
    ],
    text: 'Enter your tagline here',
    font_family: 'Oswald',
    font_weight: '600',
    text_transform: 'uppercase',
  })

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