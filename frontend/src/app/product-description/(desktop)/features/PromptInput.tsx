import { TextArea } from '@lobehub/ui';
import { Icon } from '@lobehub/ui';
import { Button } from 'antd';
import { Sparkles, StopCircle } from 'lucide-react';
import React from 'react';
import useProductDescription from '../../provider/useProductDescription';
import { toast } from 'react-toastify';

const PromptInput = ({
  onGenerateClick,
  onStopGeneration,
}: {
  onGenerateClick: any;
  onStopGeneration: any;
}) => {
  const { prompt, setPrompt, isLoading } = useProductDescription();

  const onSubmit = () => {
    if (!prompt) {
      toast.error("Please enter a prompt to generate the description.");
      return;
    }
    onGenerateClick();
  }
  return (
    <>
      <div className="main-container">
        <div className="description">
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', margin: 'auto' }}>
            <TextArea
              autoFocus
              onBlur={(e) => {
                setPrompt?.(e.target.value);
              }}
              onChange={(e) => setPrompt?.(e.target.value)}
              onPressEnter={(e) => {
                if (e.shiftKey) return;

                // eslint-disable-next-line unicorn/consistent-function-scoping
                const send = () => {
                  // avoid inserting newline when sending message.
                  // refs: https://github.com/lobehub/lobe-chat/pull/989
                  e.preventDefault();
                  onSubmit();
                };

                send();
              }}
              placeholder="Type your prompt here..."
              showCount={false}
              size="large"
              value={prompt}
              className="textarea"
              type={'pure'}
              autoSize={{ minRows: 1, maxRows: 5 }}
            />
          </div>
          <Button
            onClick={isLoading ? onStopGeneration : onSubmit}
            size="large"
            type={'primary'}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {!isLoading ? (
              <Icon fill="normal" icon={Sparkles} />
            ) : (
              <Icon fill="normal" icon={StopCircle} color="white" size="large" />
            )}
            {isLoading ? 'Stop Generation' : 'Generate'}
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
          align-items: end;
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
