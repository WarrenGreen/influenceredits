import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ElementState } from '@creatomate/preview';
import { videoCreator } from '@/stores/VideoCreatorStore';
import styles from './SidePanel.module.css'

//interface TextInputProps {
//  activeElement: ElementState;
//}

export const TextInput = (props) => {
  const text = props.activeElement.source.text;

  const htmlElement = useRef(null);

  const [inputText, setInputText] = useState(text);
  useEffect(() => {
    // Update the value only when the input element is not focused
    if (htmlElement.current !== document.activeElement) {
      setInputText(text);
    }
  }, [text]);

  return (
    <textarea className={styles.TextArea}
      ref={htmlElement}
      value={inputText}
      onChange={async (e) => {
        setInputText(e.target.value);

        await videoCreator.preview?.applyModifications({
          [`${props.activeElement.source.id}.text`]: e.target.value,
        });
      }}
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
