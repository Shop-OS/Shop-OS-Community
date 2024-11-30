import { GridBackground } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import dynamic from 'next/dynamic';
import { PropsWithChildren, memo, useState } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import LeftMainSideBar from '@/app/welcome/(desktop)/LeftMainSideBar';
import SafeSpacing from '@/components/SafeSpacing';
import { MAX_WIDTH } from '@/const/layoutTokens';
import AppLayoutDesktop from '@/layout/AppLayout.desktop';
import { useSwitchSideBarOnInit } from '@/store/global';
import { SidebarTabKey } from '@/store/global/initialState';

import Header from './features/Header';

const SideBar = dynamic(() => import('./features/AgentDetail'));

const useStyles = createStyles(({ css }) => ({
  background: css`
    width: 80%;
    margin: -60px 0 -20px;
  `,
  title: css`
    z-index: 2;
    margin-top: 24px;
    font-size: 56px;
    font-weight: 800;
  `,
}));

const MarketLayout = memo<PropsWithChildren>(({ children }) => {
  const { theme, styles } = useStyles();
  const [active, setActive] = useState('Market');

  useSwitchSideBarOnInit(SidebarTabKey.Market);

  return (
    <AppLayoutDesktop>
      <LeftMainSideBar active={active} setActive={setActive} />
      <Flexbox
        flex={1}
        height={'100%'}
        id={'lobe-market-container'}
        style={{
          position: 'relative',
          background: 'url(/market_background.jpg) no-repeat center center fixed',
          backgroundSize: 'cover',
        }}
      >
        {/* <Header /> */}
        <Flexbox flex={1} height={'calc(100% - 64px)'} horizontal>
          <Flexbox align={'center'} flex={1} style={{ overflow: 'auto', padding: 16 }}>
            <SafeSpacing />
            <img
              src={'/themeAssets/showcase-top-2.svg'}
              alt="Showcase"
              style={{ position: 'absolute', top: -5, width: '90%' }}
            />

            <Flexbox gap={16} style={{ maxWidth: MAX_WIDTH, position: 'relative', width: '100%' }}>
              <Center>
                <h1
                  style={{
                    background:
                      'linear-gradient(98.14deg, #FFFFFF 28.88%, rgba(255, 255, 255, 0) 132.27%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginTop: '100px',
                    fontWeight: 500,
                    fontSize: 45,
                  }}
                >
                  Find & Use The Best Agents
                </h1>
                {/* <GridBackground
                  animation
                  className={styles.background}
                  colorFront={theme.colorText}
                  random
                /> */}
              </Center>
              {children}
            </Flexbox>
          </Flexbox>
          <SideBar />
        </Flexbox>
      </Flexbox>
    </AppLayoutDesktop>
  );
});

export default MarketLayout;
