'use client';

import { useEffect, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import PageTitle from '../features/PageTitle';
import AgentInput from './features/AgentInput';
import Conversation from './features/Conversation';
import LeftMainSideBar from './features/LeftMainSideBar';
import Layout from './layout.desktop';
import { TextTo3DProvider } from '../provider/TextTo3DProvider';
import { Alert } from 'antd';
import useHomProvider from '@/provider/useHoMProvider';
import Cookies from 'js-cookie';

const DesktopPage = () => {
  const [image, setImage] = useState<string | null>(null);

  // const [removeBgImageFile, setRemoveBgImageFile] = useState<File | null>(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [agentInputComponent, setAgentInputComponent] = useState('assets');

  // const [model3DUrl, setModel3DUrl] = useState<string>('');

  const { setShowTour, setTourType } = useHomProvider();

  useEffect(() => {
    let showTour = Cookies.get('hom_tour_text_3d') == 'true' ? true : false;

    if (!showTour) {
      Cookies.set('hom_tour_text_3d', 'true', { expires: 365 });
      setShowTour(true);
      setTourType('Text to 3D');
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    let intervalId: NodeJS.Timeout;

    if (shouldFetch) {
      intervalId = setInterval(() => {
        setTimeSpent((timeSpent) => timeSpent + 0.05);
      }, 50);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [shouldFetch, timeSpent]);

  return (
    <Layout>
      <TextTo3DProvider>
        <LeftMainSideBar
          setAgentInputComponent={setAgentInputComponent}
          agentInputComponent={agentInputComponent}
        />
        <AgentInput
          setImage={setImage}
          agentInputComponent={agentInputComponent}
        />
        <Flexbox
          flex={1}
          height={'100%'}
          width={'100%'}
          id={'lobe-conversion-container'}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <PageTitle />
          <Flexbox
            flex={1}
            height={'calc(100% - 64px)'}
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            <Conversation
              setShouldFetch={setShouldFetch}
              shouldFetch={shouldFetch}
              agentInputComponent={agentInputComponent}
            />
          </Flexbox>
        </Flexbox>
      </TextTo3DProvider>
    </Layout>
  );
};
export default DesktopPage;
