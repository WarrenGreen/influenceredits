import { useEffect, useRef, useState } from 'react'
import { Button } from '@radix-ui/themes'

import {createProject} from '@/helpers/project'
import { useRouter } from 'next/navigation'


import React from "react" 
React.useLayoutEffect = React.useEffect 



export const getServerSideProps = async ({ params }) => {
  return { props: { host: process.env.NEXT_PUBLIC_HOST } }
}

export default function Dashboard({host}) {
  const router = useRouter()

  const createProjectEvent = () => {
    createProject().then((newProjectRows) => {
      let url = host + "/selection/"+newProjectRows[0].id
      router.push(url)
    });
    
    
  }
  return (<>
  <Button onClick={()=> {createProjectEvent()}}>New Project</Button>
  </>)
}