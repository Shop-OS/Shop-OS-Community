import { ActionIcon, DiscordIcon, Icon } from '@lobehub/ui';
import Cookies from 'js-cookie';
import { Book, Feather, FileClock, HardDriveDownload, HardDriveUpload, HelpCircle, LogOut, Settings, Settings2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { ABOUT, CHANGELOG, DISCORD, FEEDBACK, GITHUB, WIKI } from '@/const/url';
import DataImporter from '@/features/DataImporter';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { configService } from '@/services/config';
import { GlobalStore, useGlobalStore } from '@/store/global';
import { SettingsTabs, SidebarTabKey } from '@/store/global/initialState';
import { Badge, ConfigProvider, Dropdown, MenuProps } from 'antd';
import logout from '@/utils/logout';

export interface BottomActionProps {
  active: string;
  setActive: (component: string) => void;
}

const BottomActions = memo<BottomActionProps>(({ active, setActive }: any) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const [hasNewVersion, useCheckLatestVersion] = useGlobalStore((s) => [
    s.hasNewVersion,
    s.useCheckLatestVersion,
  ]);

  useCheckLatestVersion();
  const isLoggedIn = useIsLoggedIn();

  const items: MenuProps['items'] = [
    {
      key: 'Profile',
      label: Cookies.get('hom_email'),
    },
    {
      type: 'divider',
    },
    {
      icon: <Icon icon={LogOut} />,
      key: 'logout',
      label: 'Logout',
      onClick: () => {
        logout();
        router.push('/login');
      },
    },
  ];

  return (
    <>
      {/* <ActionIcon
        icon={User}
        onClick={() => { }}
        placement={'right'}
        title={'Profile'}
        disable={true}
        size={'normal'}
      /> */}
      <ActionIcon
        icon={HelpCircle}
        onClick={() => { }}
        placement={'right'}
        title={'Support'}
        disable={true}
      />
      <ActionIcon
        icon={Settings}
        onClick={() => { }}
        placement={'right'}
        title={'Settings'}
        disable={true}
        size={'normal'}
      />
      {/* {isLoggedIn && (
        <ActionIcon
          icon={LogOut}
          onClick={() => {
            Cookies.remove('hom_token');
            router.push('/login');
            // Add any additional logout logic here
          }}
          placement={'right'}
          title={'Logout'}
          size={'normal'}
        />
      )} */}
      <Dropdown arrow={false}
        menu={{ items }}
        trigger={['click']}
        disabled={!isLoggedIn}
      >
        <ActionIcon icon={User} disable={!isLoggedIn} />
      </Dropdown>
    </>
  );
});

export default BottomActions;
