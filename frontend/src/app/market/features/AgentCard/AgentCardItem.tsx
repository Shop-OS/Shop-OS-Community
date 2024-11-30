import { Avatar, Tag } from '@lobehub/ui';
import { useHover } from 'ahooks';
import { Badge, Typography } from 'antd';
import { useThemeMode } from 'antd-style';
import { startCase } from 'lodash-es';
import { usePathname, useRouter } from 'next/navigation';
import { memo, useEffect, useRef } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useMarketStore } from '@/store/market';
import { AgentsMarketIndexItem } from '@/types/market';

import { useStyles } from './style';
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
});

const { Paragraph } = Typography;

const AgentCardItem = memo<AgentsMarketIndexItem>(({ meta, identifier }) => {
  const ref = useRef(null);
  const isHovering = useHover(ref);
  const onAgentCardClick = useMarketStore((s) => s.activateAgent);
  const { styles, theme } = useStyles();
  const { isDarkMode } = useThemeMode();
  const router = useRouter();
  const { avatar, title, description, tags, backgroundColor, isBeta } = meta;

  const pathname = usePathname();

  useEffect(() => {
    return () => {
      NProgress.done();
    }
  }, [pathname])

  return (

    <Flexbox className={styles.container} onClick={() => {
      if (identifier === "send-email") {
        // window.location.href = "mailto:mail-agent@mail.houseofmodels.ai";
        window.open("mailto:mail-agent@mail.houseofmodels.ai", "_blank");
      } else {
        const style = document.createElement('style')
        style.textContent = `
          #nprogress .bar {
            background: #F867FB !important;
          }
        `
        document.body.appendChild(style)
        NProgress.start();
        router.push(`/${identifier}`);
      }
    }}>
      {/* <AgentCardBanner meta={meta} style={{ opacity: isDarkMode ? 0.9 : 0.4 }} /> */}
      <Flexbox className={styles.inner} gap={8} ref={ref} >

        {isBeta ?
          <Badge.Ribbon text="Beta" color='#c95bcb' style={{ fontFamily: 'BDO Grotesk, sans-serif' }}>
            <Avatar
              animation={isHovering}
              avatar={avatar}
              background={backgroundColor || theme.colorFillTertiary}
              size={56}
            />
          </Badge.Ribbon> :
          <>
            <img src={avatar} style={{ width: 45, height: 45 }} />
            {/* <Avatar
              animation={isHovering}
              avatar={avatar}
              background={backgroundColor || theme.colorFillTertiary}
              size={45}
            // style={{display: "flex", alignItems: "center"}}
            /> */}
          </>}
        <Paragraph className={styles.title} ellipsis={{ rows: 1, tooltip: title }}>
          {title}
        </Paragraph>
        <Paragraph className={styles.desc} ellipsis={{ rows: 2, tooltip: description }}>
          {description}
        </Paragraph>
        <Flexbox gap={6} horizontal style={{ flexWrap: 'wrap' }}>
          {(tags as string[]).filter(Boolean).map((tag: string, index) => (
            <Tag key={index} style={{ margin: 0 }}>
              {tag.trim()}
            </Tag>
          ))}
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
});

export default AgentCardItem;
