import {
  DraggablePanel,
  DraggablePanelContainer,
  TabsNav,
  useControls,
  useCreateStore,
} from '@lobehub/ui';
import { ConfigProvider, Empty, Segmented, Skeleton, Spin } from 'antd';
import { createStyles } from 'antd-style';
import dynamic from 'next/dynamic';
import { memo, useState } from 'react';

import TopicListContent from '@/app/chat/features/TopicListContent';
import SafeSpacing from '@/components/SafeSpacing';
import { CHAT_SIDEBAR_WIDTH } from '@/const/layoutTokens';
import { useGlobalStore } from '@/store/global';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session/selectors';

import useImageStore from '../../store/ImageStore';

const SystemRole = dynamic(() => import('./SystemRole'));

const useStyles = createStyles(({ css, token }) => ({
  content: css`
    display: flex;
    flex-direction: column;
    height: 100% !important;
  `,
  drawer: css`
    background: ${token.colorBgLayout};
  `,
  header: css`
    border-bottom: 1px solid ${token.colorBorder};
  `,
}));

const Desktop = memo(() => {
  const [value, setValue] = useState<string | number>('Backgrounds');
  const [selectedTagline, setSelectedTagline] = useState<string | null>(null);
  const [hoverTagline, setHoverTagline] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('backgrounds');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const store = useCreateStore();

  const { styles } = useStyles();
  const [showAgentSettings, toggleConfig] = useGlobalStore((s) => [
    s.preference.showChatSideBar,
    s.toggleChatSideBar,
  ]);

  const isInbox = useSessionStore(sessionSelectors.isInboxSession);

  console.log('value', value);

  const {
    selectedOption,
    taglines,
    setCopyText,
    backgroundImage1,
    backgroundImage2,
    backgroundImage3,
    backgroundImage4,
    backgroundImage5,
    backgroundVideo1,
    backgroundVideo2,
    backgroundVideo3,
    backgroundVideo4,
    backgroundVideo5,
    setBackgroundImage,
    setBackgroundVideo,
    loadingBackgroundImage,
    loadingCopyText,
    loadingBackgroundVideo,
  } = useImageStore();

  const { variant }: any = useControls(
    {
      variant: {
        options: ['default', 'compact'],
        value: 'compact',
      },
    },
    { store },
  );

  const handleTabChange = (activeKey: string) => {
    setSelectedTab(activeKey);
  };

  const backgroundVideos = [
    backgroundVideo1,
    backgroundVideo2,
    backgroundVideo3,
    backgroundVideo4,
    backgroundVideo5,
  ].filter(Boolean);

  const backgroundImages = [
    backgroundImage1,
    backgroundImage2,
    backgroundImage3,
    backgroundImage4,
    backgroundImage5,
  ].filter(Boolean);

  return (
    <DraggablePanel
      className={styles.drawer}
      classNames={{
        content: styles.content,
      }}
      expand={showAgentSettings}
      minWidth={CHAT_SIDEBAR_WIDTH}
      mode={'fixed'}
      onExpandChange={toggleConfig}
      placement={'right'}
    >
      <DraggablePanelContainer
        style={{
          flex: 'none',
          height: '100%',
          maxHeight: '100vh',
          minWidth: CHAT_SIDEBAR_WIDTH,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            background: 'black',
          }}
        >
          <TabsNav
            activeKey={selectedTab}
            items={[
              {
                key: 'backgrounds',
                label: 'Backgrounds',
              },
              {
                key: 'copy-text',
                label: 'Copy text',
              },
            ]}
            onChange={handleTabChange}
            style={{ borderBottom: '1px solid #2E2E2E' }}
            variant={variant}
            tabBarGutter={8}
          />
        </div>
        {selectedTab === 'backgrounds' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {selectedOption === 'fully-animated' ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  padding: '5px',
                  marginTop: '5px',
                  height: '100%',
                }}
              >
                {loadingBackgroundVideo ? (
                  <div
                    style={{
                      margin: 'auto',
                    }}
                  >
                    <Spin size="large" />
                  </div>
                ) : backgroundVideos.length !== 0 ? (
                  backgroundVideos.map(
                    (backgroundVideo, index) =>
                      backgroundVideo && (
                        <div
                          key={index}
                          onClick={() => {
                            setBackgroundVideo(backgroundVideo);
                            setSelectedVideo(backgroundVideo);
                          }}
                          style={{
                            border:
                              backgroundVideo === selectedVideo
                                ? '1px solid white'
                                : '1px solid #2E2E2E',
                            padding: '7px',
                            marginLeft: '5px',
                            marginRight: '5px',
                            marginTop: '5px',
                            borderRadius: '8px',
                            height: '170px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                          }}
                        >
                          <video
                            src={backgroundVideo}
                            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                          ></video>
                        </div>
                      ),
                  )
                ) : (
                  <div
                    style={{
                      margin: 'auto',
                    }}
                  >
                    <Empty
                      description={<span>No Background Available</span>}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  padding: '5px',
                  marginTop: '5px',
                  height: '100%',
                }}
              >
                {loadingBackgroundImage ? (
                  <div
                    style={{
                      margin: 'auto',
                    }}
                  >
                    <Spin size="large" />
                  </div>
                ) : backgroundImages && backgroundImages.length > 0 ? (
                  backgroundImages.map(
                    (backgroundImage, index) =>
                      backgroundImage && (
                        <div
                          key={index}
                          onClick={() => {
                            setBackgroundImage(backgroundImage);
                            setSelectedImage(backgroundImage);
                          }}
                          style={{
                            border:
                              backgroundImage === selectedImage
                                ? '1px solid white'
                                : '1px solid #2E2E2E',
                            padding: '7px',
                            marginLeft: '5px',
                            marginRight: '5px',
                            marginTop: '5px',
                            borderRadius: '8px',
                            height: '200px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                          }}
                        >
                          <img
                            src={backgroundImage}
                            style={{
                              height: '100%',
                              width: '100%',
                              objectFit: 'cover',
                              borderRadius: '8px',
                            }}
                          />
                        </div>
                      ),
                  )
                ) : (
                  <div
                    style={{
                      margin: 'auto',
                    }}
                  >
                    <Empty
                      description={<span>No Background Available</span>}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {selectedTab === 'copy-text' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: '5px',
              marginTop: '5px',
              height: '100%',
            }}
          >
            {loadingCopyText ? (
              <Skeleton active />
            ) : taglines && taglines.length > 0 ? (
              taglines.map((tagline: string, index: number) => (
                <div
                  onClick={() => {
                    setCopyText(tagline);
                    setSelectedTagline(tagline);
                  }}
                  style={{
                    border: '1px solid white',
                    padding: '7px',
                    marginLeft: '5px',
                    marginRight: '5px',
                    borderRadius: '8px',
                    backgroundColor:
                      tagline === selectedTagline || tagline === hoverTagline
                        ? 'white'
                        : 'transparent',
                    color:
                      tagline === selectedTagline || tagline === hoverTagline ? 'black' : 'white',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoverTagline(tagline)}
                  onMouseLeave={() => setHoverTagline(null)}
                >
                  {tagline}
                </div>
              ))
            ) : (
              <div
                style={{
                  margin: 'auto',
                }}
              >
                <Empty
                  description={<span>No Copy text Available</span>}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            )}
          </div>
        )}
      </DraggablePanelContainer>
    </DraggablePanel>
  );
});

export default Desktop;
