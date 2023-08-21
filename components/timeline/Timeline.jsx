import styles from './timeline.module.css'
import SortableList, { SortableItem } from 'react-easy-sort'
import {arrayMoveImmutable} from 'array-move'
import { useState, useRef, forwardRef } from "react";
import {useModalDismissSignal} from '@/helpers/useModalDismissSignal'
import { TrashIcon } from '@radix-ui/react-icons'
import {moveSegments, deleteSegment as deleteSegmentDb} from '@/helpers/segment'

import { Button } from '@radix-ui/themes';

export default function Timeline({ segments, setSegments }) {
    const onSortEnd = (oldIndex, newIndex) => {
      setSegments((array) => {
        let newArray = arrayMoveImmutable(array, oldIndex, newIndex)
        newArray = newArray.map((segment, ind) => {
          return {...segment, index:ind}
        })
        moveSegments(newArray);
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
    setVisible("block")
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
              <Button  ref={ref} style={{ display:visible, position: "fixed", top: y-20, left: x, alignItems: "center"}} onClick={() =>{deleteSegment();setVisible("none")}}>Delete <TrashIcon/></Button>
      </>
    )
}
