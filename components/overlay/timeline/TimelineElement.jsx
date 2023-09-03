import React, { Fragment, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { videoCreator } from '@/stores/VideoCreatorStore';
import { Draggable } from '../Draggable';
import styles from './Timeline.module.css'
import { ResizeHandle } from './ResizeHandle';


//interface TimelineElementProps {
//element: ElementState;
//}

export const TimelineElement = observer((props) => {
  const active = videoCreator.activeElementIds.includes(props.element.source.id);
  const timelineScale = videoCreator.timelineScale;

  const [placement, setPlacement] = useState({ time: props.element.localTime, duration: props.element.duration });
  useEffect(() => {
    setPlacement({ time: props.element.localTime, duration: props.element.duration });
  }, [props.element.localTime, props.element.duration]);

  const applyPlacement = async () => {
    await videoCreator.preview?.applyModifications({
      [`${props.element.source.id}.time`]: placement.time,
      [`${props.element.source.id}.duration`]: placement.duration,
    });
  };

  return (
    <Fragment>
      <Draggable
        onStart={(e, data) => {
          return { startX: data.x };
        }}
        onDrag={(e, data, context) => {
          const timeOffset = (data.x - context.startX) / timelineScale;

          setPlacement({ time: Math.max(props.element.localTime + timeOffset, 0), duration: props.element.duration });
        }}
        onStop={() => {
          applyPlacement();
        }}
      >
        {(ref) => (
          <div className={styles.Bar}
            ref={ref}
            active={active}
            style={{
              left: placement.time * timelineScale,
              background: active ? '#2a85ff' : 'var(--violet-10)',
              width: (placement.duration - props.element.exitDuration) * timelineScale,
            }}
            onClick={() => {
              videoCreator.setActiveElements(props.element.source.id);
            }}
          >
            <div style={{padding: "10px"}}>
              {props.element.source.name ??
                props.element.source.type[0].toUpperCase() + props.element.source.type.slice(1)}
            </div>
          </div>
        )}
      </Draggable>
      <ResizeHandle
        element={props.element}
        side='start'
        time={props.element.localTime}
        onChange={(time, duration) => setPlacement({ time, duration })}
        onComplete={applyPlacement}
      />
      <ResizeHandle
        element={props.element}
        side='end'
        time={props.element.localTime + props.element.duration}
        onChange={(time, duration) => setPlacement({ time, duration })}
        onComplete={applyPlacement}
      />
    </Fragment>
  );
});

const Bar = styled.div//<{ active }>`
  `position: absolute;
  height: 35px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  background: ${(props) => (props.active ? '#2a85ff' : 'var(--violet-10)')};
  border-radius: 8px;
  overflow: hidden;
`;
