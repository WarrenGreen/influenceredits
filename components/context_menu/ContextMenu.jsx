import { useState, useRef, forwardRef } from "react";
import {useModalDismissSignal} from './useModalDismissSignal'

export default function Example({children}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState("none")
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const onContextMenu = (e) =>{
    e.preventDefault();
    setX(e.clientX);
    setY(e.clientY);
    setVisible("block")
  }
  useModalDismissSignal(ref, ()=> {setVisible("none")}, true);


  const ContextMenu = forwardRef(({ x, y,visible}, ref) => {
    return (
      <div ref={ref} style={{ width:"100px", display:visible, backgroundColor: "white", position: "fixed", top: y, left: x}}>
        <button onClick={() =>{console.log("btn 1");setVisible("none")}}>Hit me</button>
      </div>
    )
  }
  )
  return (
    <>
      <div onContextMenu={onContextMenu} >
        {children}
      </div>
      <ContextMenu ref={ref} visible={visible} x={x} y={y} />

    </>
  );
}