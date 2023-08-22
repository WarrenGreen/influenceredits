import styles from './timeline.module.css'
import SortableList, { SortableItem } from 'react-easy-sort'
import {arrayMoveImmutable} from 'array-move'
import { useState, useRef, forwardRef } from "react";
import {useModalDismissSignal} from '@/helpers/useModalDismissSignal'
import { TrashIcon } from '@radix-ui/react-icons'
import {editSegments, deleteSegment as deleteSegmentDb} from '@/helpers/segment'
import EditSegmentModal from '@/components/edit_segment_modal/EditSegmentModal'


import { Button } from '@radix-ui/themes';

export default function Timeline({ video, segments, setSegments }) {
    const onSortEnd = (oldIndex, newIndex) => {
      setSegments((array) => {
        let newArray = arrayMoveImmutable(array, oldIndex, newIndex)
        newArray = newArray.map((segment, ind) => {
          return {...segment, index:ind}
        })
        editSegments(newArray);
        return newArray;
      })
    }

    const ref = useRef(null);
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
      deleteSegmentDb(currentSegment.id);
      return setSegments((array) => array.filter((segment) => {
        return segment.id != currentSegment.id
      }))
    }

    const scale = (text) => {
      return "100px";
    }
    return (
      <>
            <SortableList className={styles.trackbar} onSortEnd={onSortEnd} draggedItemClassName="dragged">
              { 
                segments.map((segment, i) =>  (
                  <SortableItem key={segment.id}>
                    <div onContextMenu={(e) => { onContextMenu(e, segment)}} style={{backgroundColor: segment.color, width:scale(segment.text)}} className={styles.segment}>
                      <div className={styles.segment_meat}>{ segment.text }</div>

                    </div>
                  </SortableItem>
                  )
                )
              }
              </SortableList>
              <div ref={ref}  style={{ minWidth:"175px", flexDirection:"column", alignItems:"start", display:visible, position: "fixed", top: y-20-30, left: x, borderRadius:"5px", overflow:"hidden"}} onClick={() =>{setVisible("none")}}>
              {currentSegment!=null ? <EditSegmentModal setSegments={setSegments} style={{ width:"100%", borderRadius: "0px"}} segment={currentSegment} video={video}/>: <Button disabled style={{width:"100%", borderRadius: "0px"}}>Edit Segment</Button>}
      <Button style={{width:"100%", borderRadius: "0px"}}onClick={() =>{deleteSegment();setVisible("none")}}>Delete <TrashIcon/></Button>
    </div>
      </>
    )
}
