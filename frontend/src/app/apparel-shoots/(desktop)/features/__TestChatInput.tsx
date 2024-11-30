import { Icon } from '@lobehub/ui';
import { Button } from 'antd';
import { Sparkles } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export default function TestChatInput() {
  const textareaRef = useRef(null);
  const [textareaValue, setTextareaValue] = useState('');

  useEffect(() => {
    adjustTextareaHeight();
  });

  const adjustTextareaHeight = () => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
    adjustTextareaHeight();
  };

  return (
    <>
      <header className="main-container">
        <div className="description">
          <textarea
            ref={textareaRef}
            value={textareaValue}
            onChange={handleTextareaChange}
            className="textarea"
          />
          <Button onClick={() => {}} size="large" type={'primary'}>
            <Icon fill="normal" icon={Sparkles} />
            Generate Image
          </Button>
        </div>
      </header>
      <style jsx>{`
        .main-container {
          justify-content: space-between;
          border-radius: 12px;
          border: 1px solid #242424;
          background-color: #0e0e0e;
          display: flex;
          margin-top: 12px;
          width: 100%;
          gap: 20px;
          font-size: 14px;
          line-height: 26px;
          padding: 7px 7px 7px 22px;
        }
        @media (max-width: 991px) {
          .main-container {
            max-width: 100%;
            flex-wrap: wrap;
            padding-left: 20px;
          }
        }
        .description {
          color: rgba(185, 176, 176, 0.21);
          font-family:
            BDO Grotesk,
            sans-serif;
          flex-grow: 1;
          flex-basis: auto;
          margin: auto 0;
          display: flex;
          width: 70%;
        }
        .image-wrapper {
          border-radius: 8px;
          border: 1px solid #000;
          background-color: #fff;
          display: flex;
          justify-content: space-between;
          gap: 0px;
          color: #000;
          white-space: nowrap;
          text-align: center;
          padding: 12px 15px;
        }
        @media (max-width: 991px) {
          .image-wrapper {
            white-space: initial;
          }
        }
        .img {
          aspect-ratio: 1;
          object-fit: auto;
          object-position: center;
          width: 24px;
          align-self: start;
        }
        .button {
          font-family:
            BDO Grotesk,
            sans-serif;
          flex-grow: 1;
        }
        .textarea {
          overflow: hidden;
          resize: none;
          border: 0;
          background: none;
          font-size: 14px;
          line-height: 1.5;
          width: 100%;
          margin-right: 5px;
          outline: none;
        }
      `}</style>
    </>
  );
}
