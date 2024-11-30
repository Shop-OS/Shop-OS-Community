import { ActionIcon } from '@lobehub/ui';
import {
  FolderOpenDot,
  Home,
  Layers3,
  LayoutDashboard,
  LayoutTemplate,
  LucideBot,
  MessageSquare,
  Settings2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo } from 'react';

export interface TopActionProps {
  active: string;
  setActive: (component: string) => void;
}

const TopActions = ({ active, setActive }: any) => {
  const router = useRouter();

  return (
    <>
      <div
        onClick={() => {
          setActive('Home');
          router.push('/welcome');
        }}
      >
        <ActionIcon
          active={active === 'Home'}
          icon={MessageSquare}
          placement={'right'}
          size="large"
          title={'Home'}
        />
      </div>
      <div
        onClick={(e) => {
          setActive('Market');
          router.push('/market');
        }}
      >
        <ActionIcon
          active={active === 'Market'}
          icon={LucideBot}
          placement={'right'}
          size="large"
          title={'Market'}
        />
      </div>
      {/* <div
        onClick={(e) => {
          setAgentInputComponent('editor');
        }}
      >
        <ActionIcon
          active={agentInputComponent === 'editor'}
          icon={Settings2}
          placement={'right'}
          size="large"
          title={'Editor'}
        />
      </div> */}
    </>
  );
};

export default TopActions;
