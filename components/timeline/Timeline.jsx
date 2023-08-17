import styles from './timeline.module.css'
import SortableList, { SortableItem } from 'react-easy-sort'
import {arrayMoveImmutable} from 'array-move'
import { TrashIcon } from '@radix-ui/react-icons'
import { Flex, Button } from '@radix-ui/themes';
import { useState, useRef, forwardRef } from "react";
import {useModalDismissSignal} from '@/components/context_menu/useModalDismissSignal'

export default function Timeline({ segments, setSegments, totalWords }) {
    const onSortEnd = (oldIndex, newIndex) => {
      setSegments((array) => arrayMoveImmutable(array, oldIndex, newIndex))
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
    const ContextMenu = forwardRef(({ x, y,visible, segment}, ref) => {
      return (
          <Button  ref={ref} style={{ display:visible, position: "fixed", top: y, left: x, alignItems: "center", displat: "flex"}} onClick={() =>{deleteSegment();setVisible("none")}}>Delete <TrashIcon/></Button>
      )
    }
    )

    const deleteSegment = ( ) => {
      return setSegments((array) => array.filter((segment) => {
        return segment.id != currentSegment.id
      }))
    }

    const scale = (text) => {
      return Math.max(100, text.split(" ").length / totalWords *500)+"px";
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
              <ContextMenu ref={ref} visible={visible} x={x} y={y-20} />
      </>
    )
}
