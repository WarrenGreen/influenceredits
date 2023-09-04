import { TrashIcon } from '@radix-ui/react-icons'
import {useState} from 'react' 
import { Button } from '@radix-ui/themes';
import useWindowDimensions from '@/hooks/getWindowDimensions'

import { useEffect, useRef } from 'react'

export default function Ruler ({contentWidth}) {

  const canvasRef = useRef(null);


  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    let i=0;
    for (;i<contentWidth;i+=5) {
    	context.moveTo(i,0);
        if (i%50==0){
          context.lineTo(i,25);
        }else{
        	context.lineTo(i,5);
        }

        if ((i-5)%50==0) {
        	context.font = "10px Arial";
          context.fillText((i-5)/25, i, 15);
        }
        context.stroke();
    }
  }, [contentWidth])
  return (
    <canvas height="25" style={{flex:1 , width:contentWidth+"px"}} width={contentWidth} ref={canvasRef} />
  )
}
