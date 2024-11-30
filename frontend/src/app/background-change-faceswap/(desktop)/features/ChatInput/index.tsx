import { DraggablePanel, TextArea } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { TextAreaRef } from 'antd/es/input/TextArea';
import { ChangeEvent, memo, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import {
  CHAT_TEXTAREA_HEIGHT,
  CHAT_TEXTAREA_MAX_HEIGHT,
  HEADER_HEIGHT,
} from '@/const/layoutTokens';
import { useGlobalStore } from '@/store/global';
import { isCommandPressed } from '@/utils/keyboard';

import Footer from './Footer';
import Head from './Header';
import { useAutoFocus } from './useAutoFocus';

const useStyles = createStyles(({ css }) => {
  return {
    textarea: css`
      resize: none !important;

      height: 100% !important;
      padding: 0 24px;

      line-height: 1.5;

      box-shadow: none !important;
    `,
    textareaContainer: css`
      position: relative;
      flex: 1;
    `,
  };
});

interface InputAreaProps {
  handleCreateImage: () => void;
  handlePromptChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  tags: string[];
}

const ChatInput = memo<InputAreaProps>(({ handlePromptChange, handleCreateImage, tags }) => {
  const [expand, setExpand] = useState<boolean>(false);

  const [inputHeight, updatePreference] = useGlobalStore((s) => [
    s.preference.inputHeight,
    s.updatePreference,
  ]);

  const { styles } = useStyles();
  const ref = useRef<TextAreaRef>(null);

  useAutoFocus(ref);

  return (
    <DraggablePanel
      fullscreen={expand}
      headerHeight={HEADER_HEIGHT}
      maxHeight={CHAT_TEXTAREA_MAX_HEIGHT}
      minHeight={CHAT_TEXTAREA_HEIGHT}
      onSizeChange={(_, size) => {
        if (!size) return;

        updatePreference({
          inputHeight: typeof size.height === 'string' ? Number.parseInt(size.height) : size.height,
        });
      }}
      placement="bottom"
      size={{ height: inputHeight, width: '100%' }}
      style={{ zIndex: 10 }}
    >
      <Flexbox
        gap={8}
        height={'100%'}
        padding={'12px 0 16px'}
        style={{ minHeight: CHAT_TEXTAREA_HEIGHT, position: 'relative' }}
      >
        <Head expand={expand} setExpand={setExpand} />

        {/* !! Textarea !! */}
        <div className={styles.textareaContainer}>
          <TextArea
            autoFocus
            className={styles.textarea}
            onBlur={(e) => {
              // updateInputMessage?.(e.target.value);
              handlePromptChange?.(e);
            }}
            onChange={(e) => {
              // updateInputMessage?.(e.target.value);
              handlePromptChange?.(e);
            }}
            onPressEnter={(e) => {
              if (e.shiftKey) return;

              // eslint-disable-next-line unicorn/consistent-function-scoping
              const send = () => {
                // avoid inserting newline when sending message.
                // refs: https://github.com/lobehub/lobe-chat/pull/989
                e.preventDefault();

                handleCreateImage();
              };
              const commandKey = isCommandPressed(e);

              // cmd + enter to wrap
              if (commandKey) {
                handleCreateImage?.();
                return;
              }

              send();
            }}
            placeholder="Type your prompt here..."
            ref={ref}
            type={'pure'}
          />
        </div>
        <Footer handleCreateImage={handleCreateImage} setExpand={setExpand} tags={tags} />
      </Flexbox>
    </DraggablePanel>
  );
});

export default ChatInput;
