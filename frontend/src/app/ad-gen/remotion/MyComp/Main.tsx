import { loadFont } from '@remotion/google-fonts/Roboto';
import React from 'react';
import { AbsoluteFill, Img, Sequence, Video, staticFile } from 'remotion';
import { z } from 'zod';

// import background from '../../assets/background.jpg';
// import iphone from '../../assets/iphone13.png';
// import whiteLogo from '../../assets/whiteLogo.png';
import useImageStore from '../../store/ImageStore';
import { CompositionProps, DURATION_IN_FRAMES } from '../../types/constants';
import { TempFive } from '../templates/TempFive';
import { TempFour } from '../templates/TempFour';
import { TempThree } from '../templates/TempThree';
import { TempTwo } from '../templates/TempTwo';
import { TempOne } from '../templates/tempOne';

loadFont();

const container: React.CSSProperties = {
  // backgroundColor: "black",
  position: 'relative',
};

// const logo: React.CSSProperties = {
//   justifyContent: 'center',
//   alignItems: 'center',
// };

export const Main = ({
  logoSrc,
  productSrc,
  backgroundImage,
  backgroundVideo,
  copyText,
  selectedOption,
}: z.infer<typeof CompositionProps> & { backgroundVideo?: string }) => {
  // const frame = useCurrentFrame();
  // const { fps } = useVideoConfig();
  // const { width, height } = useVideoConfig();

  const { template } = useImageStore();
  console.log(backgroundImage, selectedOption);

  function getBackground() {
    if (backgroundImage || backgroundVideo) {
      if (selectedOption === 'fully-animated') {
        return backgroundVideo ? <Video src={backgroundVideo} /> : null;
      } else {
        return backgroundImage ? <Img placeholder="alt" src={backgroundImage} /> : null;
      }
    }
    // return <Video src={staticFile('/video.mp4')} />;
  }

  return (
    <AbsoluteFill style={container}>
      {getBackground()}
      {/* {true && <Video src={staticFile("/video.mp4")} />} */}

      {/* <Img
        src="https://firebasestorage.googleapis.com/v0/b/ai-ad-62300.appspot.com/o/background%2Fundefined?alt=media&token=e36aea97-3546-4441-9e38-d1c103203273"
        placeholder="alt"
      /> */}

      <Sequence durationInFrames={DURATION_IN_FRAMES} from={0}>
        {template === 1 ? (
          <TempOne copyText={copyText} logoSrc={logoSrc} productSrc={productSrc} />
        ) : template === 2 ? (
          <TempTwo copyText={copyText} logoSrc={logoSrc} productSrc={productSrc} />
        ) : template === 3 ? (
          <TempThree copyText={copyText} logoSrc={logoSrc} productSrc={productSrc} />
        ) : template === 4 ? (
          <TempFour copyText={copyText} logoSrc={logoSrc} productSrc={productSrc} />
        ) : template === 5 ? (
          <TempFive copyText={copyText} logoSrc={logoSrc} productSrc={productSrc} />
        ) : null}
      </Sequence>
    </AbsoluteFill>
  );
};
