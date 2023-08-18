import { TrashIcon } from '@radix-ui/react-icons'
import {forwardRef} from 'react' 
import { Button } from '@radix-ui/themes';

const ContextMenu = forwardRef(({ x, y,visible, segment}, ref) => {
      return (
          <Button  ref={ref} style={{ display:visible, position: "fixed", top: y, left: x, alignItems: "center", display: "flex"}} onClick={() =>{deleteSegment();setVisible("none")}}>Delete <TrashIcon/></Button>
      )
    }
    )

export default ContextMenu