import { useEffect, useRef, useState, useCallback} from "react";
import { debounce } from "@/helpers/utils";
import Word from "./Word";
import {v4 as uuid} from "uuid";
import {createSegment, updateSegments, deleteSegment as deleteSegmentDb} from "@/helpers/segment"
import {useModalDismissSignal} from '@/helpers/useModalDismissSignal'
import { TrashIcon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes';
import EditSegmentModal from '@/components/app/edit_segment_modal/EditSegmentModal'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function TextBlock({video, seekVideo, segments, setSegments, projectMediaId}) {
  let colors = ["#FF6363", "#FFAB76", "#FFFDA2", "#BAFFB4", "#FF52A2", "#A084E8", "#95BDFF", "#86C8BC"];
  let [wordsState, setWordsState] = useState([]);

  const supabase = createClientComponentClient();

  const getColor = () =>  {
    return colors[segments.length % colors.length];
  }

  const paintRanges = useCallback(() => {
    setWordsState(oldWordState => {
      return oldWordState.map(state => {
          return {...state, rangeColor: null, rangeStart:false, rangeEnd:false}

      })
    });
    segments.map((segment) => {
      setWordsState(oldWordState => {
        return oldWordState.map(state => {
          if (state.index == segment.start && state.index == segment.end) {
            return {...state, rangeColor: segment.color, rangeStart:true, rangeEnd:true}
          } else if (state.index == segment.end) {
            return {...state, rangeColor: segment.color, rangeStart:false, rangeEnd: true}
          } else if (state.index == segment.start) {
            return {...state, rangeColor: segment.color, rangeStart: true, rangeEnd:false}
          } else if (segment.start <= state.index && state.index <= segment.end){
            return {...state, rangeColor: segment.color, rangeStart: false, rangeEnd:false}
          } else {
            return {...state};
          }
        })
      })
    });
  }, [segments])


  useEffect(() => {
    let state = []
    for (let index in video.words) {
      state.push({
        id: uuid(),
        index: index,
        selected: false,
        selectedStart: false,
        selectedEnd: false,
        inRange: false,
        rangeStart: false,
        rangeEnd: false,
        rangeColor: null,
        text: video.words[index].text,
        videoStart: video.words[index].start,
        videoEnd: video.words[index].end,
      });
    }
  
    setWordsState(oldState=>state);
    paintRanges()
    }, [video, paintRanges])
  

  const resetSelection = () => {
    setWordsState(oldWordState => {
      return oldWordState.map((wordState) => {
        return {...wordState, selected:false, selectedEnd:false, selectedStart: false }
      })
    })
  }

  useEffect(() => {
    paintRanges();
  }, [segments, paintRanges])

  const collectText = (selectionStart, selectionEnd) => {
    let text = "";
    for (let index in wordsState) {
      if (wordsState[index].index == selectionStart) text += wordsState[index].text
      else if (selectionStart <= wordsState[index].index && wordsState[index].index <= selectionEnd) text += " " + wordsState[index].text;
    }
    return text;
  }

  const removeSelection = (segment, selectionStart, selectionEnd) => {
    if (segment.start == selectionStart) {
      segment.start=selectionEnd+1;
      segment.timeStart = wordsState[selectionEnd+1].videoStart
    } else if (segment.end == selectionEnd) {
      segment.end = selectionStart-1;
      segment.timeEnd = wordsState[selectionStart-1].videoEnd
    } else {
      throw new Error("Selection is fucked");
    }

    segment.text = collectText(segment.start, segment.end)

    return segment;
  }

  const expandSelection = (segment, selectionStart, selectionEnd) => {
    if (segment.start == selectionEnd) {
      segment.start=selectionStart;
      segment.timeStart = wordsState[selectionStart].videoStart
    } else if (segment.end == selectionStart) {
      segment.end = selectionEnd;
      segment.timeEnd = wordsState[selectionEnd].videoEnd
    } else {
      throw new Error("Selection is fucked");
    }
    segment.text = collectText(segment.start, segment.end)


    return segment;
  }
  

  const mouseCement = () => {
    let chosenColor = getColor();

    let selectionStart = null;
    let selectionEnd = null;
    let startNum = parseInt(startIndex);
    let currentNum = parseInt(endIndex);
    if (startNum <= currentNum){
      selectionStart = startNum;
      selectionEnd=currentNum;
    }else{
      selectionStart=currentNum;
      selectionEnd = startNum;
    }
    setStartIndex(null);
    setEndIndex(null);


    if (selectionStart == null || selectionEnd == null || isNaN(selectionStart) || isNaN(selectionEnd) ) { 
      return;
    }

    resetSelection();

    // Start segment editting

    let expansionOrRemoval = false;
    segments.map((segment) => {
      if (
        //Removal
        ((segment.start == selectionStart || segment.end == selectionStart) && (segment.start <= selectionEnd && selectionEnd <= segment.end))
        ||
        ((segment.start == selectionEnd || segment.end == selectionEnd) && (segment.start <= selectionStart && selectionStart <= segment.end))) {
          let newSegment = removeSelection(segment, selectionStart, selectionEnd);
          updateSegments(supabase, newSegment, setSegments);
          expansionOrRemoval = true;
      } else if (
        //Expansion
        ((segment.start == selectionStart || segment.end == selectionStart) && (segment.start >= selectionEnd || selectionEnd >= segment.end))
        ||
        ((segment.start == selectionEnd || segment.end == selectionEnd) && (segment.start >= selectionStart || selectionStart >= segment.end))) {
          let newSegment = expandSelection(segment, selectionStart, selectionEnd);
          updateSegments(supabase, newSegment, setSegments);
          expansionOrRemoval = true;
      }   
    })
    if (expansionOrRemoval) return;

    // End segment editting

    // Start segment creation
    let range = {
      "id": uuid(),
      "timeStart": wordsState[selectionStart].videoStart,
      "timeEnd": wordsState[selectionEnd].videoEnd,
      "start": selectionStart,
      "end": selectionEnd,
      "color": chosenColor,
      "text": collectText(selectionStart, selectionEnd),
      "projectMediaId": projectMediaId
    };
    setSegments(oldRange => {
      range['index'] = oldRange.length;
      createSegment(supabase, range)
      return [...oldRange, range];
    });
    // End segment creation
    
  };

  let [startIndex, setStartIndex] = useState(null);
  let [endIndex, setEndIndex] = useState(null);
  const onMouseDown = (wordIndex) => {
    setStartIndex(wordIndex);
  }

  const onMouseUp = (wordId) => {
    mouseCement();
  }

  const onMouseMove = (event) => {
    var flags = event.buttons !== undefined ? event.buttons : event.which;
    let primaryMouseButtonDown = (flags & 1) === 1;
    if (!primaryMouseButtonDown) {
      resetSelection();
    }
  }

  const onMouseOver = (event, wordIndex) => {
    resetSelection();

    var flags = event.buttons !== undefined ? event.buttons : event.which;
    let primaryMouseButtonDown = (flags & 1) === 1;

      if (primaryMouseButtonDown ) {
        setEndIndex(wordIndex);
        if (startIndex == null) return;

        let start = null;
        let end = null;
        let startNum = parseInt(startIndex);
        let currentNum = parseInt(wordIndex);
        if (startNum <= currentNum){
          start = startNum;
          end=currentNum;
        }else{
          start=currentNum;
          end = startNum;
        }
  
          setWordsState(oldWordState => {
            return oldWordState.map(state => {
              if (state.index == start && state.index == end) {
                return {...state, selected: true, selectedStart:true, selectedEnd:true}
              } else if (state.index == end) {
                return {...state, selected: true, selectedStart:false, selectedEnd: true}
              } else if (state.index == start) {
                return {...state, selected: true, selectedStart: true, selectedEnd:false}
              } else if (start <= state.index && state.index <= end){
                return {...state, selected: true, selectedStart: false, selectedEnd:false}
              } else {
                return {...state};
              }
            })
          })
      } 
  }

  const seekVideoWrapper = (wordId) => {
    for (let index in wordsState) {
      if (wordsState[index].id == wordId){
        seekVideo(wordsState[index].videoStart);
        break;
      }
    }
  }

  const [visible, setVisible] = useState("none")
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [currentSegment, setCurrentSegment] = useState();
  const ref = useRef();
  
  const onContextMenu = (e, wordState) =>{
    e.preventDefault();
    setX(e.clientX);
    setY(e.clientY);

    const selectedSegments = segments.filter((segment) => {
      return (segment.start <= wordState.index && wordState.index <= segment.end)
    })
    setCurrentSegment(selectedSegments[0]);
    setVisible("flex")
  }

    useModalDismissSignal(ref, ()=> {setVisible("none")}, true);


    const deleteSegment = ( ) => {
      deleteSegmentDb(supabase, currentSegment.id);
      return setSegments((array) => array.filter((segment) => {
        return segment.id != currentSegment.id
      }))
    }

  return (
    <>
      
      <div onMouseUp={onMouseUp} onMouseMove={onMouseMove}  className={"content-loaded prevent-select"}>
      {video.words ? 
        wordsState.map((state)=> 
          <Word 
            onContextMenu={(e) => { onContextMenu(e, state)}}
            onMouseDown={() => onMouseDown(state.index)}
            onMouseOver={(event) => onMouseOver(event, state.index)}
            key={state.id}
            state={state}
            seekVideo={seekVideoWrapper}
        />
        )
        :
        <></>
      }
      </div>
      
    
      <div ref={ref}  style={{ minWidth:"175px", flexDirection:"column", alignItems:"start", display:visible, position: "fixed", top: y-20-30, left: x, borderRadius:"5px", overflow:"hidden"}} onClick={() =>{setVisible("none")}}>
      {currentSegment!=null ? 
        <>
          <EditSegmentModal setSegments={setSegments} style={{ width:"100%", borderRadius: "0px"}} segment={currentSegment} video={video}/>
          <Button style={{width:"100%", borderRadius: "0px"}}onClick={() =>{deleteSegment();setVisible("none")}}>Delete <TrashIcon/></Button>
        </>
      : 
        <></>
      }
      </div>
    </>
  )
}