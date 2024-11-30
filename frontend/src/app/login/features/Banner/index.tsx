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

  return (
    <>
      <div className={styles.container} style={{ marginBottom: '40px' }}>
        <Hero mobile={mobile} width={mobile ? 640 : 1024} />
      </div>
    </>
  );
});

export default Banner;
