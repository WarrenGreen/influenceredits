import styles from './timeline.module.css'
import SortableList, { SortableItem } from 'react-easy-sort'
import {arrayMoveImmutable} from 'array-move'
import { useState, useRef, forwardRef, useEffect } from "react";
import {useModalDismissSignal} from '@/helpers/useModalDismissSignal'
import { TrashIcon } from '@radix-ui/react-icons'
import {editSegments, deleteSegment as deleteSegmentDb} from '@/helpers/segment'
import EditSegmentModal from '@/components/app/edit_segment_modal/EditSegmentModal'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'


import { Button } from '@radix-ui/themes';

import { videoCreator } from '@/stores/VideoCreatorStore';

export default function Timeline({video, segments, setSegments }) {

  const supabase = createClientComponentClient()
    const onSortEnd = (oldIndex, newIndex) => {
      setSegments((array) => {
        let newArray = arrayMoveImmutable(array, oldIndex, newIndex)
        newArray = newArray.map((segment, ind) => {
          return {...segment, index:ind}
        })
        editSegments(supabase, newArray);
        return newArray;
      })
    }

    const ref = useRef(null);
    const trackbarRef = useRef(null);
    const [trackbarWidth, setTrackbarWidth] = useState(0)
    useEffect(() => {
      
      if (!trackbarRef?.current?.clientWidth) {
        return;
      }
      setTrackbarWidth(trackbarRef?.current?.clientWidth);
    }, [trackbarRef?.current?.clientWidth]);

  const [visible, setVisible] = useState("none")
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [currentSegment, setCurrentSegment] = useState();

  const onContextMenu = (e, segment) =>{
    e.preventDefault();
    setX(e.clientX);

    setY(e.clientY);
    setCurrentSegment(segment);
    setVisible("flex")
  }

    useModalDismissSignal(ref, ()=> {setVisible("none")}, true);

    const deleteSegment = ( ) => {
      deleteSegmentDb(supabase, currentSegment.id);
      return setSegments((array) => array.filter((segment) => {
        return segment.id != currentSegment.id
      }))
    }

    const scale = (segment) => {
      return Math.max(50, (25* (segment.timeEnd - segment.timeStart))/1000);
    }

    const [rulerWidth, setRulerWidth] = useState(4000);

    useEffect(() => {
      let segmentsLength = segments.reduce((totalValue, segment) => {
        return totalValue + scale(segment)
      }, 0)
      setRulerWidth(Math.max(segmentsLength*2, 4000))
    }, [segments])


    return (
      <>
            <div className={styles.trackbar} style={{left:0, bottom:0, right:0, position: "absolute"}}>
            <SortableList className={styles.sortable} onSortEnd={onSortEnd}>
              { 
                segments.map((segment, i) =>  (
                  <SortableItem key={segment.id}>
                    <div onContextMenu={(e) => { onContextMenu(e, segment)}} style={{backgroundColor: segment.color, width:scale(segment)+"px"}} className={styles.segment}>
                      <div className={styles.segment_meat}>{ segment.text }</div>

                    </div>
                  </SortableItem>
                  )
                )
              }
              </SortableList>
              </div>
              <div ref={ref}  className="bg-purple-500" style={{ minWidth:"175px", flexDirection:"column", alignItems:"start", display:visible, position: "fixed", top: y-20-30, left: x, borderRadius:"5px", overflow:"hidden"}} onClick={() =>{setVisible("none")}}>
              {
                currentSegment!=null ? 
                  <EditSegmentModal supabase={supabase} setSegments={setSegments} style={{ width:"100%", borderRadius: "0px"}} segment={currentSegment} video={video}/>
                  : 
                  <Button disabled style={{width:"100%", borderRadius: "0px"}}>Edit Segment</Button>
              }
              <div style={{height:"1px"}} className='w-full bg-purple-300' />
              <Button style={{width:"100%", borderRadius: "0px"}}onClick={() =>{deleteSegment();setVisible("none")}}>Delete <TrashIcon/></Button>
            </div>
      </>
    )
}
