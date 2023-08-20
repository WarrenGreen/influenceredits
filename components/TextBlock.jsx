import { useEffect, useRef, useState } from "react";
import { debounce } from "../helpers/utils";
import Word from "../components/Word";
import {v4 as uuid} from "uuid";
import {createSegment} from "@/helpers/segment"

export default function TextBlock({words, seekVideo, segments, setSegments, projectMediaId}) {
  let colors = ["#FF6363", "#FFAB76", "#FFFDA2", "#BAFFB4", "#FF52A2", "#A084E8", "#95BDFF", "#86C8BC"];

  const getColor = () =>  {
    return colors[segments.length % colors.length];
  }

  useEffect(() => {
  let state = []
  for (let index in words) {
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
      text: words[index].text,
      videoStart: words[index].start,
      videoEnd: words[index].end,
    });
  }

  setWordsState(state);
  paintRanges()

  }, [words])

  useEffect(() => {
    let state = []
    for (let index in words) {
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
        text: words[index].text,
        videoStart: words[index].start,
        videoEnd: words[index].end,
      });
    }
  
    setWordsState(oldState=>state);
    paintRanges()
    }, [])
  
  let [wordsState, setWordsState] = useState([]);

  const resetSelection = () => {
    setWordsState(oldWordState => {
      return oldWordState.map((wordState) => {
        return {...wordState, selected:false, selectedEnd:false, selectedStart: false }
      })
    })
  }

  const paintRanges = () => {
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
  }

  useEffect(() => {
    paintRanges();
  }, [segments])

  const mouseCement = () => {
    let chosenColor = getColor();

    let start = null;
    let end = null;
    let startNum = parseInt(startIndex);
    let currentNum = parseInt(endIndex);
    if (startNum <= currentNum){
      start = startNum;
      end=currentNum;
    }else{
      start=currentNum;
      end = startNum;
    }
    setStartIndex(null);
    setEndIndex(null);


    if (start == null || end == null || isNaN(start) || isNaN(end) ) { 
      return;
    }

    let text = "";
    for (let index in wordsState) {
      if (wordsState[index].index == start) text += wordsState[index].text
      else if (start <= wordsState[index].index && wordsState[index].index <= end) text += " " + wordsState[index].text;
    }

    let range = {
      "id": uuid(),
      "timeStart": wordsState[start].videoStart,
      "timeEnd": wordsState[end].videoEnd,
      "start": start,
      "end": end,
      "color": chosenColor,
      "text": text,
      "projectMediaId": projectMediaId
    };
    console.log("HOST HERE: "+process.env.NEXT_PUBLIC_HOST)
    setSegments(oldRange => {
      range['index'] = oldRange.length;
      createSegment(range)
      return [...oldRange, range];
    });
    resetSelection();
    
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

  return (
    <div  onMouseUp={onMouseUp} onMouseMove={onMouseMove} className="content-loaded">
      {wordsState.map((state)=> 
        <Word 
          onMouseDown={() => onMouseDown(state.index)}
          onMouseOver={(event) => onMouseOver(event, state.index)}
          key={state.id}
          state={state}
          seekVideo={seekVideoWrapper}
      />
      )}
    </div>
  )
}