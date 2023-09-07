import {Oval} from 'react-loader-spinner';

import Image from 'next/image'

export default function VideoBlock({ video, selected }) {
  return (
    <div style={selected? {backgroundColor: "lightgray"}:null}className="video-block">
      {video.thumbnail ? 
      <Image key={video.id} alt="thumbnail" src={video.thumbnail} width={55} height={55} />
      :
      <Oval
      height={50}
      width={50}
      color="#BEADFA"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      aria-label='oval-loading'
      secondaryColor=""
      strokeWidth={4}
      strokeWidthSecondary={4}
    
    />

      
      }
      <div style={{"margin": "10px", overflow: "hidden"}}>
        <div style={{"fontWeight": "bold", whiteSpace: "nowrap"}}>{video.name}</div>
        <div></div>
      </div>  
    </div>
  )
}