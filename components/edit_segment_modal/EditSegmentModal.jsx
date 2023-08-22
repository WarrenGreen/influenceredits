import { Dialog, Button, Flex, Text, TextField,  } from '@radix-ui/themes';
import MyPreview from '@/components/preview_modal/MyPreview'
import {v4 as uuid} from "uuid";

import ReactSlider from 'react-slider'
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {updateSegments} from '@/helpers/segment'


export default function EditSegmentModal({style, segment, setSegments, video}) {
  const [startStop, setStartStop] = useState([segment.timeStart / 1000, segment.timeEnd / 1000])
  useEffect(()=>{
    reset();
  }, [segment])
  const initialSource = {
    "output_format": "mp4",
    "width": 400,
    "height": 225,
    "elements": [
      {
        "id": uuid(),
        "type": "video",
        "track": 1,
        "trim_start": segment.timeStart / 1000,
        "trim_duration": (segment.timeEnd-segment.timeStart) / 1000,
        "source": video.url
      },
    ]
  }
  const [source, setSource] = useState(initialSource);

    



const StyledSlider = styled(ReactSlider)`
    width: 100%;
    height: 50px;
`;

const StyledThumb = styled.div`
    height: 50px;
    line-height: 50px;
    width: 100px;
    text-align: center;
    background-color: var(--violet-11);
    color: #fff;
    border-radius: 25%;
    cursor: grab;
`;

const Thumb = (props, state) => <StyledThumb {...props}>{state.valueNow}</StyledThumb>;

const StyledTrack = styled.div`
    top: 0;
    bottom: 0;
    background: ${props => (props.index === 2 ? 'var(--violet-4)' : props.index === 1 ? 'var(--violet-6)' : 'var(--violet-4)')};
    border-radius: 999px;
    border: 1px solid var(--violet-6)
`;

const thumbChange = (newVal, thumbIndex) => {

  const initialSource = {
    "output_format": "mp4",
    "width": 400,
    "height": 225,
    "elements": [
      {
        "id": uuid(),
        "type": "video",
        "track": 1,
        "trim_start": newVal[0],
        "trim_duration": (newVal[1] - newVal[0]),
        "source": video.url
      },
    ]
  }
  setStartStop(newVal)
  setSource(initialSource)
}
const reset = () => {
  setStartStop([segment.timeStart / 1000, segment.timeEnd / 1000]);
  setSource(initialSource);
}

const save = () => {
  let editedSegment = {...segment};
  editedSegment.timeStart = Math.round(startStop[0]*1000);
  editedSegment.timeEnd = Math.round(startStop[1]*1000);
  updateSegments(editedSegment, setSegments)
}

const limitsBuffer = Math.min(5, Math.max(1, ((segment.timeEnd - segment.timeStart)/1000)))

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;
  
  return (
    <Dialog.Root onOpenChange={reset}>
      <Dialog.Trigger>
        <Button style={style}>Edit Segment</Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 600 , height:400, display:"flex", flexDirection: "column"}}>
        <Dialog.Title>Edit Segment</Dialog.Title>
        <Flex justify="center" align={"center"} style={{flexGrow: 1, rowGap: "10px"}} direction='column'>
          <MyPreview  source={source}></MyPreview>
          <StyledSlider onAfterChange={thumbChange} min={(segment.timeStart/1000)-limitsBuffer} max={(segment.timeEnd/1000)+limitsBuffer} defaultValue={[startStop[0],startStop[1]]} step={.01} renderTrack={Track} renderThumb={Thumb} />
        </Flex>

        <Flex justify="end" style={{margin: "10px"}}>
          <Dialog.Close>
            <Button onClick={reset} variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
          <Dialog.Close>
          <Button onClick={save} variant="soft">
              Save
            </Button>
          </Dialog.Close>
      </Flex>
  </Dialog.Content>
</Dialog.Root>
  )
}