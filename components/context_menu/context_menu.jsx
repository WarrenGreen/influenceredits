import {useModalDismissSignal} from '@/helpers/useModalDismissSignal'
import { TrashIcon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes';

export default function ContextMenu({deleteSegment, onClickCallback}) {

  const [visible, setVisible] = useState("none")
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const ref = useRef();
  useModalDismissSignal(ref, ()=> {setVisible("none")}, true);

  
  const onContextMenu = (e, wordState) =>{
    e.preventDefault();
    setX(e.clientX);
    setY(e.clientY);

    onClickCallback(wordState);
    setVisible("block")
  }

  return (
    <>
    <Button
          ref={ref}
          style={{ display:visible, position: "fixed", top: y-20, left: x, alignItems: "center"}}
          onClick={() =>{deleteSegment();setVisible("none")}}>
        Delete <TrashIcon/>
      </Button>
    </>
  )
}