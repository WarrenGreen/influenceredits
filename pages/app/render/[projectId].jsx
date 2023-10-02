

import ProcessStatus from '@/components/app/process_status/ProcessStatus'

import React from "react"
import {useState, useEffect} from 'react'
React.useLayoutEffect = React.useEffect 
import { createClientComponentClient, createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import MyPreview from '../../../components/app/preview_modal/MyPreview'
import { finishVideo } from '../../../helpers/finishVideo'
import Loader from '../../../components/Loader'
import { render } from '../../../helpers/render'
import RenderList from '../../../components/app/render/RenderList'



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

  const {data } = await supabase.from("project").select("source").eq("id", projectId).single()
  const projectSource = data.source
  console.log(projectSource)


  return {
    props: {projectSource, projectId},
  }
  
}

export default function Render({projectSource, projectId}) {

  const [rendering, setRendering] = useState(false);
  const [renderData, setRenderData] = useState([])

  const supabase = createClientComponentClient()

  useEffect( () => {

    const fn = async () => {
      const {data, error} = await supabase
          .from("render")
          .select()
          .order('created_at', { ascending: false })
      setRenderData(data)

    }

    fn()
    setInterval(fn, 1000)
    
  }, []);




  return (
    <>
    
    <div className='flex flex-col h-full'>
      <ProcessStatus state="render" projectId={projectId} />
      <div className='flex h-full w-full'>

    <RenderList  renderData={renderData} />
      <div style={{flex:1}}>

      <div className='flex flex-col h-full justify-center items-center'>
        <MyPreview source={projectSource} />
        <div style={{flex: 1}}>
        <button
        onClick={()=>{render(projectSource, projectId)}}
        type="button"
        className="rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
      >
        Render
      </button>
        </div>
      </div>
      </div>
      </div>
      </div>
    </>
  )
}