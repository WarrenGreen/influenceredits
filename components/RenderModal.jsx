import { Dialog, Button, Flex, } from '@radix-ui/themes';
import {Oval} from 'react-loader-spinner';
import {  useState } from 'react'
import {finishVideo} from '../helpers/finishVideo'


export default function RenderModal({source}) {
  const [videoUrl, setVideoUrl] = useState(null);
  const renderVideo = () => {
    finishVideo(source)
    .then((data) => {
      console.log(data);
      setVideoUrl(data.url);
    });
  }
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button style={{borderRadius: "0px"}}onClick={renderVideo}>Render Video</Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Render</Dialog.Title>
          <Flex direction="column" justify="center" align="center" >
            {videoUrl ? 
            <>
              <video controls width="90%" src={videoUrl}></video>
              <a target="_blank" href={videoUrl}>Render Link</a>
            </>
            :
              <><Oval
              height={50}
              width={50}
              color="#BEADFA"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor=""
              strokeWidth={4}
              strokeWidthSecondary={4}

            />Rendering...</>}
          </Flex>

        <Flex justify="end" style={{margin: "10px"}}>
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
      </Flex>
  </Dialog.Content>
</Dialog.Root>
  )
}