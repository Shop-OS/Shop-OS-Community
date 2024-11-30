import { ActionIcon } from '@lobehub/ui';
import {
  BringToFront,
  FolderOpen,
  FolderOpenDot,
  Layers3,
  LayoutDashboard,
  LayoutTemplate,
  Settings2,
  Shapes,
} from 'lucide-react';
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
          // setAgentInputComponent('templates');
        }}
      >
        <ActionIcon
          active={agentInputComponent === 'templates'}
          icon={BringToFront}
          placement={'right'}
          size="large"
          title={'Templates'}
          disable={true}
        />
      </div>
      <div
        onClick={(e) => {
          // setAgentInputComponent('editor');
        }}
      >
        <ActionIcon
          active={agentInputComponent === 'editor'}
          icon={Shapes}
          placement={'right'}
          size="large"
          title={'Editor'}
          disable={true}
        />
      </div>
      <div onClick={(e) => {}}>
        <ActionIcon
          active={agentInputComponent === 'dummy1'}
          icon={FolderOpen}
          placement={'right'}
          size="large"
          title={''}
          disable={true}
        />
      </div>
    </>
  );
});

export default TopActions;
