import React from 'react';
import { observer } from 'mobx-react-lite';
import { videoCreator } from '@/stores/VideoCreatorStore';
import { TextSettings } from './TextSettings';
import { ImageSettings } from './ImageSettings';
import { VideoSettings } from './VideoSettings';

import styles from './SidePanel.module.css'

export const SidePanel= observer(() => {
  const activeElement = videoCreator.getActiveElement();

  if (activeElement) {
    if (activeElement.source.type === 'text') {
      return (
        <div className={styles.MainSidePanel}>
          <div className={styles.ScrollableArea}>
            <TextSettings activeElement={activeElement} />
          </div>
        </div>
      );
    } else if (activeElement.source.type === 'image') {
      return (
        <div className={styles.MainSidePanel}>
          <div className={styles.ScrollableArea}>
            <ImageSettings activeElement={activeElement} />
          </div>
        </div>
      );
    } else if (activeElement.source.type === 'video') {
      return (
        <div className={styles.MainSidePanel}>
          <div className={styles.ScrollableArea}>
            <VideoSettings activeElement={activeElement} />
          </div>
        </div>
      );
    }
  }

  return (
    <div className={styles.MainSidePanel}>
      <div className={styles.WelcomeScreen}>
        <div>
         Welcome to the overlay editor. You can add text or graphics and edit them along the timeline.
        </div>

      </div>
    </div>
  );
});
