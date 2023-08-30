import { useState, useEffect } from 'react';
import styles from './processstatus.module.css';
import { Flex, Button, Card } from '@radix-ui/themes';
import Link from 'next/link'

export default function ProcessStatus({state, projectId}) {
  const [nextHref, setNextHref] = useState("");
  const [backHref, setBackHref] = useState("");
  useEffect(() => {
    if (state == "select"){
      setBackHref("");
      setNextHref("/overlay/"+projectId);
    }else if (state == "overlay") {
      setBackHref("/selection/"+projectId);
      setNextHref("/render/"+projectId);
    } else if (state == "render") {
      setBackHref("/overlay/"+projectId);
      setNextHref("");
    }
  }, [])
  
  return (
    <div className={styles.wrapper}> 
      <Link href={backHref}><Button disabled={(state == "select")? true: false} style={{flexGrow:1}}>Back</Button></Link>
      <div className={styles.graphicsWrapper}>
          <Card style={{backgroundColor: state=="select" ? "var(--violet-4)":null} } className={styles.element}><Flex justify='center'>Select Clips</Flex></Card>
          <div className={styles.divider}></div>
          <Card style={{backgroundColor: state=="overlay" ? "var(--violet-4)":null} } className={styles.element}><Flex justify='center'>Edit Overlays</Flex></Card>
          <div className={styles.divider}></div>
          <Card style={{backgroundColor: state=="render" ? "var(--violet-4)":null} } className={styles.element}><Flex justify='center'>Render</Flex></Card>
      </div>
      <Link href={nextHref}><Button disabled={(state == "render")? true: false} style={{flexGrow:1}}>Next</Button></Link>
    </div>
  )
}