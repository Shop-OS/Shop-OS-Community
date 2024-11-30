import dynamic from 'next/dynamic';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { genSize, useStyles } from './style';

const LogoThree = dynamic(() => import('@lobehub/ui/es/LogoThree'));
const LogoSpline = dynamic(() => import('@lobehub/ui/es/LogoThree/LogoSpline'));

const Hero = memo<{ mobile?: boolean; width: number }>(({ width, mobile }) => {
  const size: any = {
    base: genSize(width / 3.5, 240),
    desc: genSize(width / 50, 14),
    logo: genSize(width / 2.5, 180),
    title: genSize(width / 20, 32),
  };

  size.marginTop = mobile ? -size.logo / 9 : -size.logo / 3;
  size.marginBottom = mobile ? -size.logo / 9 : -size.logo / 4;

  const { styles } = useStyles(size.base);

  const { t } = useTranslation('welcome');

  return (
    <>
      {/* <Flexbox
        style={{
          height: size.logo,
          marginBottom: size.marginBottom,
          marginTop: size.marginTop,
          position: 'relative',
        }}
      >
        {mobile ? <LogoThree size={size.logo} /> : <LogoSpline height={'100%'} width={'100%'} />}
      </Flexbox> */}

      <div
        className={styles.title}
        style={{
          fontSize: size.title,
          background: 'linear-gradient(98.14deg, #FFFFFF 28.88%, rgba(255, 255, 255, 0) 132.27%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '30px',
        }}
      >
        Ready to redefine <br />
        your store?
      </div>

      <div className={styles.desc} style={{ fontSize: '2rem', width: '100%' }}>
        The House of Models is an ensemble of AI agents, <br />
        helping you sell better.
      </div>
    </>
  );
});

export default Hero;
