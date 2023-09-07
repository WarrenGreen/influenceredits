import React, { useEffect, useRef, useState } from 'react';
import { Preview, PreviewState } from '@creatomate/preview';
import {v4 as uuid} from 'uuid';
import {Oval} from 'react-loader-spinner';
import { Dialog, Button, Flex, Text, TextField,  } from '@radix-ui/themes';


export default function OverlayPreview ({source})  {

  // React Hook to update the component when the window width changes

  // Video aspect ratio that can be calculated once the video is loaded
  const [videoAspectRatio, setVideoAspectRatio] = useState();

  // Reference to the preview
  const previewRef = useRef();

  // Current state of the preview
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentState, setCurrentState] = useState();

  // This sets up the video player in the provided HTML DIV element
  const setUpPreview = (htmlElement) => {
    if (previewRef.current) {
      previewRef.current.dispose();
      previewRef.current = undefined;
    }

    // Initialize a preview
    const preview = new Preview(htmlElement, 'interactive', process.env.NEXT_PUBLIC_VIDEO_PLAYER_TOKEN);

    // Once the SDK is ready, load a template from our project
    preview.onReady = async () => {
      //await preview.loadTemplate(process.env.NEXT_PUBLIC_TEMPLATE_ID);
      await preview.setSource(source);
      setIsReady(true);
    };

    preview.onLoad = () => {
      setIsLoading(true);
    };

    preview.onLoadComplete = () => {
      setIsLoading(false);
    };

    // Listen for state changes of the preview
    preview.onStateChange = (state) => {
      setCurrentState(state);
      setVideoAspectRatio(state.width / state.height);
    };

    previewRef.current = preview;
  };

  useEffect(() => {
    if(isReady)
      previewRef.current.setSource(source);

  }, [source])
    

  return (
    <>
      <div style={{flexGrow: 1, display: isLoading? "none": null}} ref={(htmlElement) => {
            if (htmlElement && htmlElement !== previewRef.current?.element) {
              setUpPreview(htmlElement);
            }
          }}></div><button onClick={ previewRef.current.play}>play</button>
      {isLoading && 
      <Flex align="center" justify="center" style={{flexGrow: 1}}>
      <Oval
      height={75}
      width={75}
      color="#BEADFA"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      aria-label='oval-loading'
      secondaryColor=""
      strokeWidth={4}
      strokeWidthSecondary={4}
    />
    </Flex>}
    </>
  );
};