import {Oval} from 'react-loader-spinner';


export default function VideoBlock({ video, selected }) {
  return (
    <div style={selected? {backgroundColor: "lightgray"}:null}className="video-block">
      {video.loading ? 
      <Oval
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
    
    />
      :
      <img src={video.thumbnail} style={{height:"55px", width: "25%"} }/>
      }
      <div style={{"margin": "10px", overflow: "hidden"}}>
        <div style={{"fontWeight": "bold", whiteSpace: "nowrap"}}>{video.name}</div>
        <div>time</div>
      </div>  
    </div>
  )
}