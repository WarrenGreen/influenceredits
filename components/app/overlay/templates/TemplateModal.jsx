import AWS from "aws-sdk";
import { useEffect, useState } from "react";
import {v4 as uuid} from 'uuid';
import {createProject} from '@/helpers/project'
import { useRouter } from 'next/navigation'
import { createMedia } from '@/helpers/media'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {useUser}from '@supabase/auth-helpers-react'
import { overlayCreator } from '@/stores/OverlayCreatorStore';



export const getServerSideProps = async ({ params }) => {
  return { props: { host: process.env.NEXT_PUBLIC_HOST } }
}

export default function TemplateModal ({setShowModal}) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const user = useUser()
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

// Create state to store file
const [file, setFile] = useState(null);
const [logoResolution, setLogoResolution] = useState(null);

// Function to upload file to s3
const uploadFile = async () => {
  if (!file) return;
  setUploading(true);
  // S3 Bucket Name
  const S3_BUCKET = "influencer-edits";

  // S3 Region
  const REGION = "us-east-1";

  // S3 Credentials
  AWS.config.update({
    accessKeyId: "AKIARVJ5ZCMAHMSIHAYU",
    secretAccessKey: "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",
  });
  const s3 = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  let videoId = uuid();
  const fileName = (' ' + file.name.split(".")[0]).slice(1);
  let splits = file.name.split(".")
  let videoExtension = splits[splits.length-1];
  let storageName = videoId + "." + videoExtension;

  // Files Parameters
  const params = {
    Bucket: S3_BUCKET,
    Key: 'images/' + storageName,
    Body: file,
  };

  let video = {
    "id": videoId,
    "url": "https://influencer-edits.s3.amazonaws.com/images/" + storageName,
    "name": fileName,
    "status": "uploading",
    "thumbnail": "",
    "loading": true,
    "words": []
  }

  // Uploading file to s3

  var upload = s3
    .putObject(params)
    .on("httpUploadProgress", (evt) => {
      // File uploading progress
      setUploadProgress(parseInt((evt.loaded * 100) / evt.total));
    })
    .promise();
  //uploadStartedCallback(video);

  await upload.then((err, data) => {

    const [logoWidth, logoHeight] = logoResolution;
    let templateLogoWidth;
    let templateLogoHeight;

    if (logoWidth <= logoHeight) {
      templateLogoWidth = Math.round(overlayCreator.preview.getSource().width * .20)
      templateLogoHeight = templateLogoWidth * logoHeight / logoWidth
    }else{
      templateLogoHeight =  Math.round(overlayCreator.preview.getSource().height * .20)
      templateLogoWidth = templateLogoHeight * logoWidth / logoHeight
    }
    
    const logoTemplate = [{
      id:"174b43a2-1ab2-4954-8d38-2f289d5e6129",
      source:  "https://influencer-edits.s3.amazonaws.com/images/" + storageName,
      width: templateLogoWidth,  //Math.round(overlayCreator.preview.getSource().width * .20) + "px",
      height: templateLogoHeight, //Math.round(overlayCreator.preview.getSource().width * .20) + "px",
      track: 2,
      x: .15, //Math.round(overlayCreator.preview.getSource().width * .15) + "px",
      y: .15, //Math.round(overlayCreator.preview.getSource().width * .15 ) + "px",
      type: "image",
      fit: "fill"
    }];
    overlayCreator.template = logoTemplate;
    overlayCreator.applyTemplate();
    setShowModal(false)
  });
};
// Function to handle file and store it to file state
const handleFileChange = (e) => {
  // Uploaded file
  const file = e.target.files[0];
  var img = new Image();

  img.onload = () => {
    console.log(img.width)
    console.log(img.height)
    // Changing file state
    setLogoResolution([img.width, img.height])
    setFile(file);
  }
  img.src = URL.createObjectURL(file)

  
};


useEffect(()=>{
  uploadFile()
}, [file]);
  return (
  <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div className="z-10 fixed inset-0 w-screen overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
          
          {uploading? 
          <>
          <div className="flex items-center">
          <div className="flex-1 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-purple-600 h-2.5 rounded-full" style={{width: uploadProgress + "%"}}></div>
          </div>
          <div className="px-5">{uploadProgress}%</div>
          </div>
          <div>Uploading. Please do not leave this page.</div>
          </>
          :
          <><label htmlFor="files" className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <span className="mt-2 block text-sm font-semibold text-gray-900">Upload Logo</span>
          </label>
          <input id="files" onChange={handleFileChange} style={{display:"none"}} accept="image/*" type="file"/>
          <div className="bg-gray-50 py-3 sm:flex">
            <button type="button" onClick={()=>{setShowModal(false)}} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
          </div>
          </>
          }
        </div>
      </div>
    </div>
  </div>
  )
}