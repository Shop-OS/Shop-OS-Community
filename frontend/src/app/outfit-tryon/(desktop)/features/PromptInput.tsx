import { TextArea } from '@lobehub/ui';
import { Icon } from '@lobehub/ui';
import { Button } from 'antd';
import { Sparkles } from 'lucide-react';
import React from 'react';

const PromptInput = ({ text, handlePromptChange, onGenerateClick, isPromptGenLoading }) => {
  return (
    <>
      <div className="main-container">
        <div className="description">
          <TextArea
            autoFocus
            onBlur={(e) => {
              handlePromptChange?.(e);
            }}
            onChange={(e) => handlePromptChange?.(e)}
            onPressEnter={(e) => {
              if (e.shiftKey) return;

              // eslint-disable-next-line unicorn/consistent-function-scoping
              const send = () => {
                // avoid inserting newline when sending message.
                // refs: https://github.com/lobehub/lobe-chat/pull/989
                e.preventDefault();
                onGenerateClick();
              };

              send();
            }}
            placeholder="Type your prompt here..."
            showCount={false}
            size="large"
            value={text}
            className="textarea"
            type={'pure'}
            autoSize={{ minRows: 1, maxRows: 5 }}
          />
          <Button
            onClick={onGenerateClick}
            size="large"
            type={'primary'}
            loading={isPromptGenLoading}
          >
            {!isPromptGenLoading && <Icon fill="normal" icon={Sparkles} />}
            {isPromptGenLoading ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </div>
      <style jsx>{`
        .main-container {
          justify-content: space-between;
          border-radius: 12px;
          border: 1px solid #242424;
          background-color: #0e0e0e;
          display: flex;
          margin: 20px auto 40px;
          width: 70%;
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
          margin-right: 10px;
          outline: none;
        }
      `}</style>
    </>
  );
};

export default PromptInput;
