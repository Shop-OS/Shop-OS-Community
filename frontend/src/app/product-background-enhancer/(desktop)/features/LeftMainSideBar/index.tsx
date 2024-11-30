import { SideNav } from '@lobehub/ui';
import Avatar from 'next/image';
import { useRouter } from 'next/navigation';
import { memo } from 'react';

import AvatarWithUpload from '@/features/AvatarWithUpload';
import { useGlobalStore } from '@/store/global';

import BottomActions from './BottomActions';
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
  const router = useRouter();
  return (
    <SideNav
      avatar={<span onClick={() => { window.location.href = "/market" }} style={{ paddingBottom: "8px" }}>
        <Avatar alt={'avatar'} height={36} src={'/icons/apparel.png'} width={33} style={{ cursor: 'pointer' }} />
      </span>}
      bottomActions={<BottomActions active={agentInputComponent} setActive={setAgentInputComponent} />}
      style={{ height: '100%', width: "60px" }}
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
