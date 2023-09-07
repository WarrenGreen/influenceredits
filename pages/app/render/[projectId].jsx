import { useEffect, useRef, useState } from 'react'
import Layout from '@/components/Layout'

import { createMedia, getProjectMedia } from '@/helpers/media'
import {getSegments, getProjectSegments} from '@/helpers/segment'

import ProcessStatus from '@/components/app/process_status/ProcessStatus'
import { Flex } from '@radix-ui/themes'
import { Oval } from 'react-loader-spinner'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'

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

  return (
    <>
    <Layout>
      <ProcessStatus state="render" projectId={projectId} />
    <Flex>
    </Flex>
    </Layout>
    </>
  )
}