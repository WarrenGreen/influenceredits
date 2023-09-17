import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import UploadModal from '../../components/app/UploadModal'
import { Inngest } from 'inngest';

const inngest = new Inngest({ name: "AdEditor", eventKey: 'yD_PvQuCV98pdjjQc0quUVx6FJy_JACv7knCEI9uVD_IpiL2HlF6crSj75sUvItdUjul1GaIy75P6YLegCFurw' });


const LoginPage = () => {

  const video = {
    "id": "f4efb804-d5a0-458b-a536-ba2eeecf6403",
    "url": "https://influencer-edits.s3.amazonaws.com/videos/f4efb804-d5a0-458b-a536-ba2eeecf6403.mp4"
  }
 

  return (
    <>
    </>
  )
}

export default LoginPage
