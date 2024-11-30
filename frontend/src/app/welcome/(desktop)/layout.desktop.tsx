'use client';

import { Logo } from '@lobehub/ui';
import { PropsWithChildren, memo, useState } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import AppLayoutDesktop from '@/layout/AppLayout.desktop';

import { useStyles } from '../features/Banner/style';
import LeftMainSideBar from './LeftMainSideBar';

const Desktop = memo<PropsWithChildren>(({ children }) => {
  const { styles } = useStyles();
  const [active, setActive] = useState('Home');

  return (
    <AppLayoutDesktop>
      <LeftMainSideBar active={active} setActive={setActive} />
      <Center
        className={styles.layout}
        flex={1}
        height={'100%'}
        horizontal
        style={{
          position: 'relative',
          background: 'url(/market_background.jpg) no-repeat center center fixed',
          backgroundSize: 'cover',
        }}
      >
        {/* <Logo className={styles.logo} size={36} type={'text'} /> */}
        <Flexbox
          className={styles.view}
          flex={1}
          style={{ paddingBottom: 0, paddingTop: 0, maxWidth: '80%' }}
        >
          {children}
        </Flexbox>
      </Center>
    </AppLayoutDesktop>
  );
});

export default Desktop;
