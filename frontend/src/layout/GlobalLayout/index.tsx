'use client';

import { App } from 'antd';
import { createStyles } from 'antd-style';
import 'antd/dist/reset.css';
import dynamic from 'next/dynamic';
import { FC, PropsWithChildren, memo } from 'react';

import { getClientConfig } from '@/config/client';

import AppTheme, { AppThemeProps } from './AppTheme';
import Locale from './Locale';
import StoreHydration from './StoreHydration';
import { HoMProvider } from '@/provider/HoMProvider';
import TourModal from '@/components/TourModal/TourModal';
// import AlertComponent from '@/app/AlertComponent';

const AlertComponent = dynamic(
  () => import("@/app/AlertComponent").then((ctx) => ctx.default),
  {
    ssr: false,
  }
);

let DebugUI: FC = () => null;

// we need use Constant Folding to remove code below in production
// refs: https://webpack.js.org/plugins/internal-plugins/#constplugin
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line unicorn/no-lonely-if
  if (getClientConfig().DEBUG_MODE) {
    DebugUI = dynamic(() => import('@/features/DebugUI'), { ssr: false }) as FC;
  }
}

const useStyles = createStyles(({ css, token }) => ({
  bg: css`
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;

    height: 100%;

    background: ${token.colorBgLayout};
  `,
}));

const Container = memo<PropsWithChildren>(({ children }) => {
  const { styles } = useStyles();

  return <App className={styles.bg}>{children}</App>;
});

interface GlobalLayoutProps extends AppThemeProps {
  defaultLang?: string;
}

const GlobalLayout = ({ children, defaultLang, ...theme }: GlobalLayoutProps) => (
  <AppTheme {...theme}>
    <HoMProvider>
      <Locale defaultLang={defaultLang}>
        <StoreHydration />
        <Container>
          <AlertComponent />
          {children}

        </Container>
        <DebugUI />
      </Locale>
      <TourModal />
    </HoMProvider>
  </AppTheme>
);

export default GlobalLayout;
