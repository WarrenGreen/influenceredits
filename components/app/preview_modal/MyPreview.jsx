import React, { useEffect, useRef, useState } from 'react';
import { Preview, PreviewState } from '@creatomate/preview';
import Loader from '@/components/Loader'



export default function MyPreview ({source, className, interactive=false})  {

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
    const preview = new Preview(htmlElement, interactive? 'interactive': 'player', process.env.NEXT_PUBLIC_VIDEO_PLAYER_TOKEN);

    // Once the SDK is ready, load a template from our project
    preview.onReady = async () => {
      //await preview.loadTemplate(process.env.NEXT_PUBLIC_TEMPLATE_ID);
      await  preview.setLoop(false);
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

      <div className={className} style={{flexGrow: 1, display: isLoading? "none": null}} ref={(htmlElement) => {
            if (htmlElement && htmlElement !== previewRef.current?.element) {
              setUpPreview(htmlElement);
            }
          }}></div>
      {isLoading && <div className="flex justify-center items-center flex-col" style={{flexGrow: 1}}><Loader /><div>Your preview is loading...</div></div>}
    </>
  );
};