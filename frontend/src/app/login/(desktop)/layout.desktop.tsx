'use client';

import { Logo } from '@lobehub/ui';
import { PropsWithChildren, memo, useState } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import AppLayoutDesktop from '@/layout/AppLayout.desktop';

import { useStyles } from '../features/Banner/style';

const Desktop = memo<PropsWithChildren>(({ children }) => {
  const { styles } = useStyles();
  const [active, setActive] = useState('Home');

  return (
    <AppLayoutDesktop>
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
          style={{ paddingBottom: 0, paddingTop: 0, maxWidth: '90%' }}
        >
          {children}
        </Flexbox>
      </Center>
    </AppLayoutDesktop>
  );
});

export default Desktop;
