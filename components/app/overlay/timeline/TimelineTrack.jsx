import React from 'react';
import {useState} from 'react';
import styled from 'styled-components';
import { TimelineElement } from './TimelineElement';


// interface TimelineTrackProps {
//   elements: ElementState[];
// }

import { videoCreator } from '@/stores/VideoCreatorStore';
const timelineScale = videoCreator.timelineScale;

export const TimelineTrack = (props) => {

  const genLayout = () => {
    return props.elements.map((element) => (
        { i: element.source.id, 
        x: element.time * timelineScale, 
        y:0, 
        w: (element.duration - element.exitDuration) * timelineScale,
        h: 3,
      }
    ))
  }
  const [layout, setLayout] = useState(genLayout)
  const onLayoutChange = () => {

  }
  return (
    <Main>
      {props.elements.map((element) => (
        <TimelineElement key={element.source.id} element={element} />
      ))}
    </Main>
    
  );
};

const Main = styled.div`
  position: relative;
  margin: 5px 0;
  height: 35px;
`;
