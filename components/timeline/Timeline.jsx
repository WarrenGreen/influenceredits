import {  useState } from 'react'
import styles from './timeline.module.css'
import SortableList, { SortableItem } from 'react-easy-sort'
import {arrayMoveImmutable} from 'array-move'


export default function Timeline({ segments, setSegments}) {
    let videoDuration = 47;
    const onSortEnd = (oldIndex, newIndex) => {
      setSegments((array) => arrayMoveImmutable(array, oldIndex, newIndex))
    }
    return (
      <>
          <div className={styles.trackbar}>
            <SortableList className={styles.inner_trackbar} onSortEnd={onSortEnd} draggedItemClassName="dragged">
              { 
                segments.map((segment, i) =>  (
                  <SortableItem key={segment.id}>
                    <div style={{backgroundColor: segment.color, width:"100px"}} className={styles.segment}>
                      <div className={styles.segment_meat}>{ segment.text }</div>
                    </div>
                  </SortableItem>
                  )
                )
              }
              </SortableList>

          </div>
      </>
    )
}
