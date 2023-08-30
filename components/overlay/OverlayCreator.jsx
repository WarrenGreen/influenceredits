import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Timeline } from './timeline/Timeline';
import { SidePanel } from './sidepanel/SidePanel';
import { Stage } from './stage/Stage';

const VideoCreator= observer(() => {
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      userSelect: "none",
      position:"fixed",
      top:"3.5rem",
      left:0,
      right:0,
      bottom:0,
    }}>
      <div style={{flex:1, display:"flex", overflow:"hidden"}}>
        <Stage />
        <SidePanel />
      </div>

      <Timeline />
    </div>
  );
});

export default VideoCreator;

const Main = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;
  position:fixed;
  top:3.5rem;
  left:0;
  right:0;
  bottom:0;
`;

const MainView = styled.div`
  flex: 1;
  display: flex;
`;
