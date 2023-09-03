import React, { Fragment } from 'react';
import styled from 'styled-components';
import { ElementState } from '@creatomate/preview';
import { ImagePreset } from './ImagePreset';
import { PropertyCaption } from './PropertyCaption';
import { PropertySelect } from './PropertySelect';
import { AnimationSettings } from './AnimationSettings';

//interface ImageSettingsProps {
//  activeElement: ElementState;
//}

export const ImageSettings= (props) => {
  return (
    <Fragment>
      <ImagePreset
        activeElement={props.activeElement}
        url="https://creatomate-static.s3.amazonaws.com/video-creator-js/gradienta-ix_kUDzCczo-unsplash.jpg"
      />

      <ImagePreset
        activeElement={props.activeElement}
        url="https://creatomate-static.s3.amazonaws.com/video-creator-js/mymind-mI-bnIqbeZ0-unsplash.jpg"
      />

      <ImagePreset
        activeElement={props.activeElement}
        url="https://creatomate-static.s3.amazonaws.com/video-creator-js/gradienta-rKv4HduvzIE-unsplash.jpg"
      />

      <PropertyCaption>Fit</PropertyCaption>
      <PropertySelect
        activeElement={props.activeElement}
        propertyName="fit"
        defaultValue="cover"
        options={[
          { caption: 'Cover', value: 'cover' },
          { caption: 'Contain', value: 'contain' },
          { caption: 'Fill', value: 'fill' },
        ]}
      />

      <PropertyCaption>Overlay</PropertyCaption>
      <PropertySelect
        activeElement={props.activeElement}
        propertyName="color_overlay"
        defaultValue=""
        options={[
          { caption: 'None', value: '' },
          { caption: '20%', value: 'rgba(0,0,0,0.2)' },
          { caption: '40%', value: 'rgba(0,0,0,0.4)' },
          { caption: '60%', value: 'rgba(0,0,0,0.6)' },
          { caption: '80%', value: 'rgba(0,0,0,0.8)' },
        ]}
      />

      <AnimationSettings activeElement={props.activeElement} />

      <Information>

      </Information>
    </Fragment>
  );
};

const Information = styled.div`
  margin-top: 20px;
  color: #a3a5a5;

  a {
    color: #a3a5a5;
  }
`;
