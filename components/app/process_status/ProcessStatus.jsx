import { useState, useEffect } from 'react';
import styles from './processstatus.module.css';
import {Button} from '@/components/Button'
import { Flex, Card } from '@radix-ui/themes';
import Link from 'next/link'

export default function ProcessStatus({state, projectId}) {
  const [nextHref, setNextHref] = useState("");
  const [backHref, setBackHref] = useState("");
  useEffect(() => {
    if (state == "select"){
      setBackHref("");
      setNextHref("/app/overlay/"+projectId);
    }else if (state == "overlay") {
      setBackHref("/app/selection/"+projectId);
      setNextHref("/app/render/"+projectId);
    } else if (state == "render") {
      setBackHref("/app/overlay/"+projectId);
      setNextHref("");
    }
  }, [])
  
  return (
    <div className={styles.wrapper}> 
      <Link href={backHref}><Button className="px-6" variant="solid" color="slate" disabled={(state == "select")? true: false} style={{flexGrow:1}}>Back</Button></Link>
      <div className={styles.graphicsWrapper}>
        <Link href={state=="select"?"#":"/app/selection/"+projectId}><Button variant={state=="select"?"solid": "outline"} color={state=="select"?"purple_300":"slate"} className={styles.element}><Flex justify='center'>Select Clips</Flex></Button></Link>
        <div className={styles.divider}></div>
        <Link href={state=="overlay"?"#":"/app/overlay/"+projectId}><Button variant={state=="overlay" ? "solid": "outline"} color={state=="overlay" ? "purple_300": "slate"}  className={styles.element}><Flex justify='center'>Edit Overlays</Flex></Button></Link>
        <div className={styles.divider}></div>
        <Link href={state=="render"?"#":"/app/render/"+projectId}><Button variant={state=="render"?"solid": "outline"} color={state=="render"?"purple_300":"slate"} className={styles.element}><Flex justify='center'>Render</Flex></Button></Link>
      </div>
      <Link href={nextHref}><Button className="px-6" variant="solid" color="slate"  disabled={(state == "render")? true: false} style={{flexGrow:1}}>Next</Button></Link>
    </div>
  )
}