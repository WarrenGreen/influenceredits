import { useEffect } from 'react';
import styles from './processstatus.module.css';
import { Flex, Button, Card } from '@radix-ui/themes';
import Link from 'next/link'

export default function ProcessStatus({state, projectId}) {
  let nextHref = "";
  let backHref = "";
  if (state == "select"){
      nextHref = "/overlay/"+projectId;
      backHref = "";
  }else if (state == "overlay") {
    nextHref = "/render/"+projectId;
    backHref = "/selection/"+projectId;
  } else if (state == "render") {
    nextHref = "/overlay/"+projectId;
    backHref = "";
  }
  return (
    <div className={styles.wrapper}> 
      <Link href={backHref}><Button style={{flexGrow:1}}>Back</Button></Link>
      <div className={styles.graphicsWrapper}>
          <Card style={{backgroundColor: state=="select" ? "var(--violet-4)":null} } className={styles.element}><Flex justify='center'>Select Clips</Flex></Card>
          <div className={styles.divider}></div>
          <Card style={{backgroundColor: state=="overlay" ? "var(--violet-4)":null} } className={styles.element}><Flex justify='center'>Edit Overlays</Flex></Card>
          <div className={styles.divider}></div>
          <Card style={{backgroundColor: state=="render" ? "var(--violet-4)":null} } className={styles.element}><Flex justify='center'>Render</Flex></Card>
      </div>
      <Link href={nextHref}><Button style={{flexGrow:1}}>Next</Button></Link>
    </div>
  )
}