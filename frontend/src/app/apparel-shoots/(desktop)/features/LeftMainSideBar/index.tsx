import { SideNav, Avatar } from '@lobehub/ui';
// import Avatar from 'next/image';
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
  isDisabled: boolean;
}

const LeftMainSideBar: React.FC<LeftMainSideBarProps> = ({
  setAgentInputComponent,
  agentInputComponent,
  isDisabled
}) => {
  const router = useRouter();

  return (
    <SideNav
      avatar={<div onClick={() => router.push("/market")} style={{ paddingBottom: "8px" }}>
        <Avatar
          avatar={"👚"}
          size={36}
          style={{ cursor: 'pointer' }}
        />
      </div>}
      bottomActions={<BottomActions active={agentInputComponent} setActive={setAgentInputComponent} />}
      style={{ height: '100%', width: "60px" }}
      topActions={
        <TopActions
          agentInputComponent={agentInputComponent}
          setAgentInputComponent={setAgentInputComponent}
          isDisabled={isDisabled}
        />
      }
    />
  );
};

export default memo(LeftMainSideBar);
