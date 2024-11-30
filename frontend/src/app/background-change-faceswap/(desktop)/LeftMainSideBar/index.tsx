import { SideNav } from '@lobehub/ui';
import Avatar from 'next/image';
import { memo } from 'react';

import AvatarWithUpload from '@/features/AvatarWithUpload';
import { useGlobalStore } from '@/store/global';

// import BottomActions from './BottomActions';
import TopActions from './TopActions';

interface LeftMainSideBarProps {
  setAgentInputComponent: (component: string) => void;
  agentInputComponent: string;
}

const LeftMainSideBar: React.FC<LeftMainSideBarProps> = ({
  setAgentInputComponent,
  agentInputComponent,
}) => {
  return (
    <SideNav
      avatar={
        <Avatar
          alt={'avatar'}
          height={42}
          src={'/icons/hom-logo.png'}
          width={40}
          style={{ cursor: 'pointer' }}
        />
      }
      bottomActions={''}
      style={{ height: '100%' }}
      topActions={
        <TopActions
          agentInputComponent={agentInputComponent}
          setAgentInputComponent={setAgentInputComponent}
        />
      }
    />
  );
};

export default memo(LeftMainSideBar);
