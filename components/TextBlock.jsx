import { useEffect, useRef, useState } from "react";
import { debounce } from "../helpers/utils";
import Word from "../components/Word";
import {v4 as uuid} from "uuid";

export default function TextBlock({words, seekVideo, segments, setSegments}) {
  let colors = ["#FF6363", "#FFAB76", "#FFFDA2", "#BAFFB4", "#FF52A2", "#A084E8", "#95BDFF", "#86C8BC"];
  let [colorIndex, setColorIndex] = useState(0);


  const getColor = () =>  {
    if (colorIndex + 1 >= colors.length) {
      setColorIndex(0);
    } else{
      setColorIndex(color => colorIndex +1);
    }
    return colors[colorIndex];
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

  }, [words])
  
  let [wordsState, setWordsState] = useState([]);
  let rangeMap = {};
  for (let rangeIndex in segments) {
    for (let wordIndex = segments[rangeIndex].start; wordIndex <=segments[rangeIndex].end ;wordIndex += 1){
      rangeMap[wordIndex] = segments[rangeIndex].color;
    }
  }

  const selectedCallback = (id) => {
    setWordsState(oldWordState => {
      return oldWordState.map(wordState => {
        if (wordState.id == id) {
          return {...wordState, selected: true};
        }else{
          return {...wordState};
        }
      })
    });
  }

  const selectedStartCallback = (id) => {
    setWordsState(oldWordState => {
      return oldWordState.map(wordState => {
        if (wordState.id == id) {
          return {...wordState, selectedStart: true};
        }else{
          return {...wordState};
        }
      })
    });
  }

  const selectedEndCallback = (id) => {
    setWordsState(oldWordState => {
      return oldWordState.map(wordState => {
        if (wordState.id == id) {
          return {...wordState, selectedEnd: true};
        }else{
          return {...wordState};
        }
      })
    });
  }


  let dismissMouseUp = 0;

  let doucleckicked = false;

  const mouseEvent = () => {
    
    setWordsState(oldWordState => {
      return oldWordState.map((wordState) => {
        return {...wordState, selected:false, selectedEnd:false, selectedStart: false }
      })
    })

    let t = '';

    if (window.getSelection) {
      t = window.getSelection().toString();
    } else if (document.getSelection() && document.getSelection().type !== 'Control') {
      t = document.createRange().toString();
    }

    if(!t || !t.length) {
      return false;
    }

    const r = window.getSelection().getRangeAt(0);
    const tokenEvent = new Event("onSelected");
    const startTokenEvent = new Event("onSelectedStart");
    const endTokenEvent = new Event("onSelectedEnd");

    r.startContainer.parentElement.parentElement.dispatchEvent(tokenEvent);
    
    var _iterator = document.createNodeIterator(
      r.commonAncestorContainer,
      NodeFilter.SHOW_ALL, // pre-filter
      {
          // custom filter
          acceptNode: function (node) {
            return NodeFilter.FILTER_ACCEPT;
          }
      }
  );
  
  var _nodes = [];
  while (_iterator.nextNode()) {
      if (_nodes.length === 0 && _iterator.referenceNode !== r.startContainer) continue;
      _nodes.push(_iterator.referenceNode);
      if (_iterator.referenceNode === r.endContainer) break;
  }

    for (let childIndex in _nodes) {
      let child = _nodes[childIndex];
      if (child && child.tagName && child.tagName.toLowerCase() == "span"){
        child.dispatchEvent(tokenEvent)
      } 
    }

    r.startContainer.parentNode.parentNode.dispatchEvent(startTokenEvent);
    r.endContainer.parentNode.parentNode.dispatchEvent(endTokenEvent);
  };



  const mouseCement = () => {
    let text = "";
    let lastMin = null;
    let lastMax = null;
    let chosenColor = getColor();
    for (let index in wordsState) {
      if (wordsState[index].selected == true) {
        lastMin = lastMin && lastMin < index ? lastMin : index;
        lastMax = lastMax && lastMax > index ? lastMax : index;
        if (text == ""){
          text += wordsState[index].text;
        }else {
          text += " " + wordsState[index].text;
        }
        setWordsState(oldWordState => {
          return oldWordState.map(state => {
            if (state.index == index) {
              return {...state, rangeColor:chosenColor, rangeStart:false, rangeEnd:false}
            }
            else{
              return {...state}
            }
          })
        })
      }
    }

    if (lastMin == null || lastMax == null){
      return;
    }


    setWordsState(oldWordState => {
      return oldWordState.map(state => {
        if (state.index == lastMin && state.index == lastMax) {
          return {...state, rangeStart:true, rangeEnd:true}
        }
        if (state.index == lastMin) {
          return {...state, rangeStart:true}
        }
        if (state.index == lastMax) {
          return {...state, rangeEnd:true}
        }
        return {...state}
      })
    })

    console.log(lastMin);
    let range = {"id": uuid(), "timeStart": wordsState[lastMin].videoStart, "timeEnd": wordsState[lastMax].videoEnd, "start": parseInt(lastMin), "end": parseInt(lastMax), "color": chosenColor, "text": text};
    setSegments(oldRange => [...oldRange, range]);
 

    setWordsState(oldWordState => {
      return oldWordState.map((wordState) => {
        return {...wordState, selected:false, selectedEnd:false, selectedStart: false }
      })
    })

    window.getSelection().empty();

  };

  const preMouseEvent = (fn) => {
    debounce(() => {
      if (doucleckicked) {
        doucleckicked = false;
        dismissMouseUp++;
      } else if(dismissMouseUp > 0) {
        dismissMouseUp--;
      } else {
        fn();
      }
    }, 200)();
  }

  const onMouseMove = () => {
    preMouseEvent(mouseEvent)
  };

  const onMouseUp = () => {
    preMouseEvent(mouseCement)
  }

  const onDoubleClick = () => {
    doucleckicked = true;
    mouseEvent();
  };

  const seekVideoWrapper = (wordId) => {
    for (let index in wordsState) {
      if (wordsState[index].id == wordId){
        seekVideo(wordsState[index].videoStart);
        break;
      }
    }
  }

  return (
    <div onMouseUp={onMouseUp} onMouseMove={onMouseMove} onDoubleClick={onDoubleClick} className="content-loaded">
      {wordsState.map((state)=> <Word 
      key={state.id}
      state={state}
      selectedCallback={selectedCallback}
      selectedStartCallback={selectedStartCallback}
      selectedEndCallback={selectedEndCallback}
      seekVideo={seekVideoWrapper}
    />) }
    </div>
  )
}