import { ChatHeader, ChatHeaderTitle } from '@lobehub/ui';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const Left = memo(() => {
  const displayTitle = 'Background Change + Face Swap';
  const displayDesc = 'Background Change + Face Swap';

  return (
    <Flexbox align={'flex-start'} gap={12} horizontal>
      {/* <Avatar
        avatar={avatar}
        background={backgroundColor}
        onClick={() =>
          isInbox
            ? router.push('/settings/agent')
            : router.push(pathString('/chat/settings', { hash: location.hash }))
        }
        size={40}
        title={title}
      /> */}
      <ChatHeaderTitle desc={displayDesc} tag={<></>} title={displayTitle} />
    </Flexbox>
  );
});

const Header = memo(() => <ChatHeader left={<Left />} />);

export default Header;
