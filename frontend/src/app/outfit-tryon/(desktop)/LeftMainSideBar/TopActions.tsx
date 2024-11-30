import { ActionIcon } from '@lobehub/ui';
import { FolderOpenDot, Layers3, LayoutDashboard, Settings2 } from 'lucide-react';
import { memo } from 'react';

export interface TopActionProps {
  agentInputComponent: string;
  setAgentInputComponent: (component: string) => void;
}

const TopActions = memo<TopActionProps>(({ setAgentInputComponent, agentInputComponent }) => {
  return (
    <>
      <div
        onClick={() => {
          setAgentInputComponent('assets');
        }}
      >
        <ActionIcon
          active={agentInputComponent === 'assets'}
          icon={Layers3}
          placement={'right'}
          size="large"
          title={'Assets'}
        />
      </div>
      <div
        onClick={(e) => {
          setAgentInputComponent('edit');
        }}
      >
        <ActionIcon
          active={agentInputComponent === 'edit'}
          icon={Settings2}
          placement={'right'}
          size="large"
          title={'Edit'}
        />
      </div>
      <div
        onClick={(e) => {
          setAgentInputComponent('dummy1');
        }}
      >
        <ActionIcon
          active={agentInputComponent === 'dummy1'}
          icon={LayoutDashboard}
          placement={'right'}
          size="large"
          title={'dummy'}
        />
      </div>
      <div
        onClick={(e) => {
          setAgentInputComponent('dummy2');
        }}
      >
        <ActionIcon
          active={agentInputComponent === 'dummy2'}
          icon={FolderOpenDot}
          placement={'right'}
          size="large"
          title="dummy"
        />
      </div>
    </>
  );
});

export default TopActions;
