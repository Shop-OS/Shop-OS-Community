'use client';

import { PropsWithChildren, memo } from 'react';

import AppLayoutDesktop from '@/layout/AppLayout.desktop';
import { useSwitchSideBarOnInit } from '@/store/global';
import { SidebarTabKey } from '@/store/global/initialState';
import { ApparelProvider } from '../provider/ApparelProvider';

export default memo(({ children }: PropsWithChildren) => {
  useSwitchSideBarOnInit(SidebarTabKey.Chat);
  return <AppLayoutDesktop>
    <ApparelProvider>
      {children}
    </ApparelProvider>
  </AppLayoutDesktop>;
});
