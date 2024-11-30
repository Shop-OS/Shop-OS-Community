import { TextArea } from '@lobehub/ui';
import { Icon } from '@lobehub/ui';
import { Button, Popover } from 'antd';
import { Copy, Sparkles, StopCircle, Terminal } from 'lucide-react';
import React, { useState } from 'react';
import useApparel from '../../provider/useApparel';

const PromptInput = ({
  text,
  handlePromptChange,
  onGenerateClick,
  isPromptGenLoading,
  onStopGeneration,
  backgroundNegativePrompt,
  setBackgroundNegativePrompt,
  lockPromptGeneration,
  loraPrompt,
  setLoraPrompt,
  showCopyButton = false,
}: {
  text: string;
  handlePromptChange: any;
  onGenerateClick: any;
  isPromptGenLoading: boolean;
  onStopGeneration: any;
  backgroundNegativePrompt: string;
  setBackgroundNegativePrompt: any;
  lockPromptGeneration: boolean;
  loraPrompt?: string;
  setLoraPrompt?: any;
  showCopyButton?: boolean;
}) => {

  const { generationIdRef, currentHistory } = useApparel();
  const [open, setOpen] = useState(false);

  const onSubmit = () => {
    const randomId =
      Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
    generationIdRef.current = randomId;
    onGenerateClick();
  }
  return (
    <>
      <div style={{
        margin: "20px auto 40px",
        display: "flex",
        width: "70%",
        alignItems: "end"
      }}>

        <div className="main-container">
          <div className="description">
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', margin: 'auto' }}>
              <div style={{ width: "100%" }}>
                {process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' && "Positive Prompt:"}
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
                      onSubmit();
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
                  style={{ fontSize: '14px' }}
                  disabled={showCopyButton}
                />
                {process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' && (
                  <div style={{
                    marginTop: "8px",
                    padding: "8px 0px",
                    borderTop: "1px solid #242424",
                  }}>
                    Negative Prompt:
                    <TextArea
                      key={"negative_prompt"}
                      autoFocus
                      onBlur={(e) => {
                        setBackgroundNegativePrompt?.(e.target.value)
                      }}
                      onChange={(e) => {
                        setBackgroundNegativePrompt?.(e.target.value)
                      }}
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
                      placeholder="Type your negative prompt here..."
                      showCount={false}
                      size="large"
                      value={backgroundNegativePrompt}
                      className="textarea"
                      type={'pure'}
                      autoSize={{ minRows: 1, maxRows: 5 }}
                      style={{ fontSize: '14px' }}
                      disabled={showCopyButton}
                    />
                  </div>)}
                {process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' && (
                  <div style={{
                    marginTop: "8px",
                    padding: "8px 0px",
                    borderTop: "1px solid #242424",
                  }}>
                    lora:
                    <TextArea
                      key={"lora_prompt"}
                      autoFocus
                      onBlur={(e) => {
                        setLoraPrompt?.(e.target.value)
                      }}
                      onChange={(e) => {
                        setLoraPrompt?.(e.target.value)
                      }}
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
                      placeholder="Type your negative prompt here..."
                      showCount={false}
                      size="large"
                      value={loraPrompt}
                      className="textarea"
                      type={'pure'}
                      autoSize={{ minRows: 1, maxRows: 5 }}
                      style={{ fontSize: '14px' }}
                      disabled={showCopyButton}
                    />
                  </div>)}
              </div>
            </div>
            <Button
              onClick={isPromptGenLoading ? onStopGeneration : onSubmit}
              size="large"
              type={'primary'}
              disabled={lockPromptGeneration || showCopyButton}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '8px',
                fontSize: '14px',
              }}
            // loading={isPromptGenLoading}
            >
              {!isPromptGenLoading ? (
                <Icon fill="normal" icon={Sparkles} color={(lockPromptGeneration) ? "white" : "#B9B0B036"} />
              ) : (
                <Icon fill="normal" icon={StopCircle} color={(lockPromptGeneration) ? "#B9B0B036" : "white"} size="large" />
              )}
              {isPromptGenLoading ? 'Stop Generation' : 'Generate'}
            </Button>
          </div>
        </div>
        {showCopyButton && (
          <Popover
            content={<div style={{
              display: "flex",
              flexDirection: "column",
            }}>
              {currentHistory?.generations?.[0].positive_prompt}
              <div style={{
                display: "flex",
                justifyContent: "end",
                backgroundColor: "#2E2E2E",
                cursor: "pointer",
                margin: "8px 0 0 auto",
                padding: "8px",
                borderRadius: "4px",
              }}
                onClick={() => {
                  navigator.clipboard.writeText(currentHistory?.generations?.[0].positive_prompt);
                }}
              >
                <Copy size={18} />
              </div>
            </div>}
            trigger="click"
            open={open}
            placement='top'
            overlayStyle={{ width: "30%" }}
            onOpenChange={(val) => {
              if (currentHistory?.generations?.[0]?.positive_prompt)
                setOpen(val);
            }}
          >
            <Button
              onClick={() => { }}
              type={'primary'}
              disabled={lockPromptGeneration}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '8px',
                fontSize: '10px',
              }}
            >
              <Terminal size={18} />
            </Button>
          </Popover>
        )}
      </div>

      <style jsx>{`
        .main-container {
          justify-content: space-between;
          border-radius: 12px;
          border: 1px solid #242424;
          background-color: #0e0e0e;
          display: flex;
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
