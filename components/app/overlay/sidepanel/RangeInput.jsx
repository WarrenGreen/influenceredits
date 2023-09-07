import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ElementState } from '@creatomate/preview';
import { videoCreator } from '@/stores/VideoCreatorStore';
import styles from './SidePanel.module.css'

//interface TextInputProps {
//  activeElement: ElementState;
//}

export const RangeInput = (props) => {
  const size  = 12;

  const htmlElement = useRef(null);

  const [textSize, setTextSize] = useState(size);
  useEffect(() => {
    // Update the value only when the input element is not focused
    if (htmlElement.current !== document.activeElement) {
      setTextSize(size);
    }
  }, [size]);

  const onChange = async (e) => {
    setTextSize(e.target.value);

    await videoCreator.preview?.applyModifications({
      [`${props.activeElement.source.id}.font_size`]: e.target.value,
    });
  }

  return (
    <input 
    style={{width:"100%"}}
      type="range"
      min="2"
      max="100"
      ref={htmlElement}
      value={textSize}
      onChange={onChange}
    />
  );
};

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  resize: none;
  padding: 10px 15px;
  margin: 10px 0;
  color: #fff;
  background: #2b3035;
  border: none;
  border-radius: 5px;

  &:focus {
    outline: 1px solid #2a85ff;
  }
`;
