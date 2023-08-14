import styles from './processstatus.module.css';
import { Flex, Button, Card } from '@radix-ui/themes';

export default function ProcessStatus() {
  return (
    <div className={styles.wrapper}> 
    <Button style={{flexGrow:1}}>Back</Button>
      <div className={styles.graphicsWrapper}>
          <Card style={{backgroundColor: "var(--violet-4)"}} className={styles.element}><Flex justify='center'>Select Clips</Flex></Card>
          <div className={styles.divider}></div>
          <Card className={styles.element}><Flex justify='center'>Edit Overlays</Flex></Card>
          <div className={styles.divider}></div>
          <Card className={styles.element}><Flex justify='center'>Render</Flex></Card>
      </div>
      <Button style={{flexGrow:1}}>Next</Button>
    </div>
  )
}