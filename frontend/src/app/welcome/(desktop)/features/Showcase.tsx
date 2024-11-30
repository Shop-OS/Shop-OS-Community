'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Banner from '@/app/welcome/features/Banner';

const Showcase = memo(() => (
  <Flexbox
    flex={1}
    justify={'center'}
    style={{ height: '100%', position: 'relative', width: '100%' }}
  >
    {/* <GridShowcase>
    </GridShowcase> */}
    <img
      src={'/themeAssets/showcase-top.svg'}
      alt="Showcase"
      style={{ position: 'absolute', top: -10, width: '100%' }}
    />
    <Banner />
    <img
      src={'/themeAssets/showcase-bottom.svg'}
      alt="Showcase"
      style={{ position: 'absolute', bottom: 0, width: '100%' }}
    />
    {/*TODO：暂时隐藏，待模板完成后再补回*/}
    {/*<AgentTemplate width={width} />*/}
  </Flexbox>
));

export default Showcase;
