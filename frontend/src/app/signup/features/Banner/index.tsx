'use client';

import { Icon } from '@lobehub/ui';
import { Button } from 'antd';
import { MoveRight, SendHorizonal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import GlowingButton from '@/components/GlowingButton';
import DataImporter from '@/features/DataImporter';
import { useGlobalStore } from '@/store/global';
import { useSessionStore } from '@/store/session';

import Hero from './Hero';
import { useStyles } from './style';

const Banner = memo<{ mobile?: boolean }>(({ mobile }) => {
  const { t } = useTranslation('welcome');
  const router = useRouter();
  const { styles } = useStyles();
  const [switchSession] = useSessionStore((s) => [s.switchSession]);
  const [switchBackToChat, isMobile] = useGlobalStore((s) => [s.switchBackToChat, s.isMobile]);

  return (
    <>
      <div className={styles.container} style={{ marginBottom: '30px' }}>
        <Hero mobile={mobile} width={mobile ? 640 : 1024} />
      </div>
      <Flexbox
        className={styles.buttonGroup}
        gap={16}
        horizontal={!mobile}
        justify={'center'}
        width={'100%'}
      >
        {/* <Button
          block={mobile}
          onClick={() => router.push('/market')}
          size={'large'}
          type={'primary'}
          style={{
            padding: '0px 60px',
            borderRadius: '50px',
            background: "radial-gradient(50% 50% at 50% 50%, #F4ADFF 0%, #FC6EFF 100%)",
          }}
        >
          <Flexbox align={'center'} gap={4} horizontal justify={'center'} >
            <span style={{ color: "white" }}>
              Show me how
            </span>
            <Icon icon={MoveRight} color='white' />
          </Flexbox>
        </Button> */}
      </Flexbox>
    </>
  );
});

export default Banner;
