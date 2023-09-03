import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { videoCreator } from '@/stores/VideoCreatorStore';
import { Playhead } from './Playhead';
import { TimelineTrack } from './TimelineTrack';

export const Timeline = observer(() => {
  const tracks = Array.from(videoCreator.tracks?.entries() ?? []);
  tracks.reverse();

  return (
    <div style={{padding:"30px 0 0 30px",minHeight:"300px",backgroundColor:"var(--violet-4)", borderRadius:"8px", flex:1}}>
      <div style={{position:"relative", height:"100%", paddingTop: "30px"}}>
        <Playhead />

        <div style={{width: "100%", height: "100%", overflowY:"scroll"}}>
          {tracks.map(([track, elements]) => (
            <TimelineTrack key={track} elements={elements} />
          ))}
        </div>
      </div>
    </div>
  );
});

const Main = styled.div`
  padding: 30px 0 0 30px;
  min-height: 300px;
  background: var(--violet-4);
  border-radius: 8px;
  flex-grow:1;
`;

const Content = styled.div`
  position: relative;
  height: 100%;
  padding-top: 30px;
`;

const Tracks = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
`;
