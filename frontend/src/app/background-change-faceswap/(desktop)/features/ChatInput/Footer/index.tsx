import { Icon } from '@lobehub/ui';
import { Button, Space } from 'antd';
import { createStyles } from 'antd-style';
import { ArrowBigUp, CornerDownLeft, Plus, Sparkles } from 'lucide-react';
import { rgba } from 'polished';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Center, Flexbox } from 'react-layout-kit';

import { isMacOS } from '@/utils/platform';

const useStyles = createStyles(({ css, prefixCls, token }) => {
  return {
    arrow: css`
      &.${prefixCls}-btn.${prefixCls}-btn-icon-only {
        width: 28px;
      }
    `,
    loadingButton: css`
      display: flex;
      align-items: center;
    `,
    overrideAntdIcon: css`
      .${prefixCls}-btn.${prefixCls}-btn-icon-only {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .${prefixCls}-btn.${prefixCls}-dropdown-trigger {
        &::before {
          background-color: ${rgba(token.colorBgLayout, 0.1)} !important;
        }
      }
    `,
  };
});

const isMac = isMacOS();

interface InputAreaProps {
  handleCreateImage?: () => void;
  setExpand?: (expand: boolean) => void;
  tags: string[];
}

const Footer = memo<InputAreaProps>(({ handleCreateImage, tags }) => {
  const { t } = useTranslation('chat');

  const { theme, styles } = useStyles();

  const cmdEnter = (
    <Flexbox gap={2} horizontal>
      <Icon icon={ArrowBigUp} /> SHIFT
      <Icon icon={Plus} />
      <Icon icon={CornerDownLeft} />
    </Flexbox>
  );

  const enter = (
    <Center>
      <Icon icon={CornerDownLeft} />
    </Center>
  );

  const sendShortcut = enter;

  const wrapperShortcut = cmdEnter;

  return (
    <Flexbox
      align={'end'}
      className={styles.overrideAntdIcon}
      distribution={'end'}
      flex={'none'}
      gap={8}
      horizontal
      padding={'0 24px'}
    >
      <Flexbox align={'center'} gap={8} horizontal>
        <Flexbox
          gap={4}
          horizontal
          style={{ color: theme.colorTextDescription, fontSize: 12, marginRight: 12 }}
        >
          {sendShortcut}
          <span>Generate</span>
          <span>/</span>
          {wrapperShortcut}
          <span>Next Line</span>
        </Flexbox>
        <Flexbox style={{ minWidth: 92 }}>
          <Space.Compact>
            {!tags || tags.length === 0 ? (
              <Button disabled size="large" type={'primary'}>
                <Icon fill="normal" icon={Sparkles} />
                Generate Image
              </Button>
            ) : (
              <Button
                onClick={() => {
                  handleCreateImage?.();
                }}
                size="large"
                type={'primary'}
              >
                <Icon fill="normal" icon={Sparkles} />
                Generate Image
              </Button>
            )}
          </Space.Compact>
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
});

export default Footer;
