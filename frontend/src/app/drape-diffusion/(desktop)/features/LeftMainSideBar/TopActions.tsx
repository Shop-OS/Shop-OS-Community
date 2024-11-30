import { ActionIcon } from '@lobehub/ui';
import { FolderOpenDot, Layers3, LayoutTemplate, LayoutDashboard, Settings2, Shapes, FolderOpen, BringToFront, History } from 'lucide-react';
import { memo } from 'react';

export interface TopActionProps {
  agentInputComponent: string;
  setAgentInputComponent: (component: string) => void;
  isDisabled: boolean;
}

const TopActions = memo<TopActionProps>(({ setAgentInputComponent, agentInputComponent, isDisabled }) => {
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
      {/* <div>
        <ActionIcon
          active={agentInputComponent === 'templates'}
          icon={BringToFront}
          placement={'right'}
          size="large"
          title={'Templates'}
          disable={isDisabled}
          onClick={(e) => {
            setAgentInputComponent('templates');
          }}
        />
      </div> */}
      {/* <div onClick={(e) => { }}>
        <ActionIcon
          active={agentInputComponent === 'history'}
          icon={History}
          placement={'right'}
          onClick={(e) => {
            setAgentInputComponent('history');
          }}
          size="large"
          title={'History'}
        />
      </div> */}
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
});

export default TopActions;
