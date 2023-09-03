import React, { Fragment } from 'react';
import { ElementState } from '@creatomate/preview';
import { videoCreator } from '@/stores/VideoCreatorStore';
import { Select } from '../Select';
import { PropertyCaption } from './PropertyCaption';
import styles from './SidePanel.module.css'

//interface AnimationSettingsProps {
//  activeElement: ElementState;
//}

export const AnimationSettings = (props) => {
  const { animations } = props.activeElement.source;

  const enterAnimation =
    animations?.find((keyframe) => !keyframe.time || keyframe.time === 'start')?.type ?? 'none';
  const exitAnimation = animations?.find((keyframe) => keyframe.time === 'end')?.type ?? 'none';

  const setAnimation = async (time, type) => {
    // Remove existing animation from list
    const newAnimations =
      animations?.filter((keyframe) => !(!keyframe.time && time === 'start') && keyframe.time !== time) ?? [];

    if (type !== 'none') {
      const animation = { time, type, duration: 3 };

      // Reverse animation when used as exit animation
      if (time === 'end') {
        animation.reversed = true;
      }

      newAnimations.push(animation);
    }

    await videoCreator.preview?.applyModifications({
      [`${props.activeElement.source.id}.animations`]: newAnimations,
    });
  };

  const animationTypes = props.activeElement.source.type === 'text' ? TextAnimationTypes : GenericAnimationTypes;

  return (
    <Fragment>
      <PropertyCaption>Enter Animation</PropertyCaption>
      <select className={styles.Select}
        value={enterAnimation}
        onChange={async (e) => {
          await setAnimation('start', e.target.value);
        }}
      >
        <option value="none">None</option>
        {Object.entries(animationTypes).map(([type, caption]) => (
          <option key={type} value={type}>
            {caption}
          </option>
        ))}
      </select>
      <PropertyCaption>Exit Animation</PropertyCaption>
      <select className={styles.Select}
        value={exitAnimation}
        onChange={async (e) => {
          await setAnimation('end', e.target.value);
        }}
      >
        <option value="none">None</option>
        {Object.entries(animationTypes).map(([type, caption]) => (
          <option key={type} value={type}>
            {caption}
          </option>
        ))}
      </select>
    </Fragment>
  );
};

// Each of these animations has its own options
// For reference: https://github.com/Creatomate/creatomate-node/tree/main/src/animations
const GenericAnimationTypes = {
  fade: 'Fade',
  scale: 'Scale',
  slide: 'Slide',
  'rotate-slide': 'Rotate Slide',
  pan: 'Pan',
  wipe: 'Wipe',
  'color-wipe': 'Color Wipe',
  'circular-wipe': 'Circular Wipe',
  'film-roll': 'Film Roll',
  squash: 'Squash',
  spin: 'Spin',
  stripe: 'Stripe',
  flip: 'Flip',
  shake: 'Shake',
  bounce: 'Bounce',
  wiggle: 'Wiggle',
  shift: 'Shift',
};

const TextAnimationTypes = {
  'text-appear': 'Text Appear',
  'text-scale': 'Text Scale',
  'text-slide': 'Text Slide',
  'text-reveal': 'Text Reveal',
  'text-fly': 'Text Fly',
  'text-spin': 'Text Spin',
  'text-wave': 'Text Wave',
  'text-counter': 'Text Counter',
  'text-typewriter': 'Text Typewriter',
  ...GenericAnimationTypes,
};
