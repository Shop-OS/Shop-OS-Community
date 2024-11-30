'use client';

import { useEffect, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import PageTitle from '../features/PageTitle';
import AgentInput from './features/AgentInput';
import Conversation from './features/Conversation';
import LeftMainSideBar from './features/LeftMainSideBar';
import Layout from './layout.desktop';
import { ProductDescriptionProvider } from '../provider/ProductDescriptionProvider';
import useHomProvider from '@/provider/useHoMProvider';
import Cookies from 'js-cookie';

const DesktopPage = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [agentInputComponent, setAgentInputComponent] = useState('assets');

  const { setShowTour, setTourType } = useHomProvider();

  useEffect(() => {
    let showTour = Cookies.get('hom_tour_product_description') == 'true' ? true : false;

    if (!showTour) {
      Cookies.set('hom_tour_product_description', 'true', { expires: 365 });
      setShowTour(true);
      setTourType('Product Description');
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
      <ProductDescriptionProvider>
        <LeftMainSideBar
          setAgentInputComponent={setAgentInputComponent}
          agentInputComponent={agentInputComponent}
        />
        <AgentInput
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
            />
          </Flexbox>
        </Flexbox>
      </ProductDescriptionProvider>
    </Layout>
  );
};
export default DesktopPage;
