
import AWS from "aws-sdk";
import { useEffect, useState } from "react";
import {v4 as uuid} from 'uuid';

import { Flex, Text, Button, Box } from '@radix-ui/themes';


export default function UploadVideo({uploadStartedCallback, uploadFinishedCallback}) {
  // Create state to store file
  const [file, setFile] = useState(null);

  // Function to upload file to s3
  const uploadFile = async () => {
    if (!file) return;
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
    let videoExtension = file.name.split(".")[1];
    let storageName = videoId + "." + videoExtension;

    // Files Parameters
    const params = {
      Bucket: S3_BUCKET,
      Key: 'videos/' + storageName,
      Body: file,
    };

    let video = {
      "id": videoId,
      "url": "https://influencer-edits.s3.amazonaws.com/videos/" + storageName,
      "name": file.name,
      "status": "uploading",
      "thumbnail": "",
      "loading": true
    }

    // Uploading file to s3

    var upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        // File uploading progress
        console.log(
          "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
        );
      })
      .promise();
    uploadStartedCallback(video);

    await upload.then((err, data) => {
      console.log(err);
      console.log("done");
      console.log(data);
      uploadFinishedCallback({...video, status: "uploaded"});
    });
  };
  // Function to handle file and store it to file state
  const handleFileChange = (e) => {
    // Uploaded file
    const file = e.target.files[0];
    // Changing file state
    setFile(file);
  };


  useEffect(()=>{
    uploadFile()
  }, [file]);
  return (
    <div className="">
      <Button style={{textAlign:"center", width:"100%", borderRadius: "0px"}}>
        <label htmlFor="files">Add New Video</label>
        <input id="files" onChange={handleFileChange}  style={{display:"none"}} accept="video/*" type="file"/>
      </Button>
    </div>
  );
}

