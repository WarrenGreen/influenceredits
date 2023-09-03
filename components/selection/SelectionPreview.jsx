import { useEffect, useRef, useState } from "react";
import { debounce } from "../../helpers/utils";
import Word from "./Word";
import {v4 as uuid} from "uuid";
import {createSegment, updateSegments, deleteSegment as deleteSegmentDb} from "@/helpers/segment"
import {useModalDismissSignal} from '@/helpers/useModalDismissSignal'
import { TrashIcon } from '@radix-ui/react-icons'
import { Button, Flex } from '@radix-ui/themes';
import EditSegmentModal from '@/components/edit_segment_modal/EditSegmentModal'
import PreviewModal from '@/components/preview_modal/PreviewModal'
import MyPreview from "../preview_modal/MyPreview";

export default function SelectionPreview({source, video,  segments, setSegments, projectMediaId}) {

  let [wordsState, setWordsState] = useState([]);
  useEffect(() => {
    let state = []
    segments.map((segment) => {
      const segmentWords = segment.text.split(" ")
      segmentWords.map((word, index) => {
        state.push({
          id: uuid(),
          index: index,
          selected: false,
          selectedStart: false,
          selectedEnd: false,
          inRange: false,
          rangeStart: index ==0,
          rangeEnd: index == segmentWords.length-1,
          rangeColor: segment.color,
          text: word,
          videoStart: 0,
          videoEnd: 0,
        });
      })
    })
  
    setWordsState(state);
  
  }, [segments])

  return (
    <div className="preview">
      <MyPreview source={source} />
      <div className="previewScript">
      {wordsState.map((state)=> 
        <Word 
          onContextMenu={(e) => { }}
          onMouseDown={() => {}}
          onMouseOver={(event) => {}}
          key={state.id}
          state={state}
          seekVideo={()=>{}}
      />
      )}
      </div>
    </div>
  );
};