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
    context.lineWidth = "1px"
    context.clearRect(0, 0, canvas.width, canvas.height);
    //context.strokeStyle="#ffff"
    //context.fillStyle = "#ffff"; 

    let i=0;
    for (;i<contentWidth;i+=10) {
    	context.moveTo(i,5);
        if (i%50==0){
          context.lineTo(i,17);
        }else{
        	context.lineTo(i,10);
        }

        if ((i)%50==0) {
        	context.font = "bold 10px Arial";
          context.fillText((i)/25, i+5, 20);
        }
        context.stroke();
    }
  }, [contentWidth])
  return (
    <canvas height="25" style={{flex:1 , width:contentWidth+"px"}} width={contentWidth} ref={canvasRef} />
  )
}
