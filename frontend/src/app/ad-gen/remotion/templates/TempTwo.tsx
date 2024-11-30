import { fontFamily, loadFont } from '@remotion/google-fonts/Roboto';
import React from 'react';
import { Img, Sequence } from 'remotion';
import { z } from 'zod';

import MaskRevealEffect from '../../animations/MaskRevealEffect';
import ObjectSlide from '../../animations/ObjectSlide';
import { CompositionProps } from '../../types/constants';

// import ObjectSlideIn from '../../components/Animations/ObjectSlideIn';
// import ObjectSpinIn from '../../components/Animations/ObjectSpinIn';
// import { CompositionProps } from '../../types/constants';
// import { AnimatedImage } from '../MyComp/AnimatedImage';
// import { CurtainEffect } from './Component/TempThree/CurtainEffect';
// import { SideFadeEffect } from './Component/TempThree/SideFadeEffect';
// import { PopUp } from './Component/TempTwo/PopUp';
// import { RollObject } from './Component/TempTwo/RollObject';

loadFont();

export const TempTwo = ({
  productSrc,
  logoSrc,
  copyText,
}: z.infer<typeof CompositionProps> & { copyText?: string }) => {
  const imgStyle: React.CSSProperties = {
    height: 600,
    left: '60%',
    position: 'absolute',
    top: '10%',
    width: 600,
  };

  const logoStyle: React.CSSProperties = {
    height: 80,
    left: '5%',
    position: 'absolute',
    top: '10%',
    width: 80,
  };
  return (
    <>
      {/* <Sequence from={0} durationInFrames={250}> */}
      <ObjectSlide contentStyle={imgStyle}>
        {productSrc && (
          <Img
            placeholder={''}
            src={productSrc ? productSrc : ''}
            style={{
              height: 600,
              position: 'absolute',
              width: 600,
            }}
          />
        )}
      </ObjectSlide>
      {/* </Sequence> */}
      <Sequence durationInFrames={270} from={80}>
        {true && (
          <MaskRevealEffect contentStyle={logoStyle} reverse={false}>
            {logoSrc && (
              <Img
                placeholder=""
                src={logoSrc}
                style={{
                  height: 50,
                  position: 'absolute',
                  width: 50,
                }}
                //   src={staticFile("/appleBlack1.png")}
                // src={selectedLogo ? URL.createObjectURL(selectedLogo) : ""}
                // style={logoStyle}
              />
            )}
          </MaskRevealEffect>
        )}
      </Sequence>
      {/* TextFade 1 */}
      <Sequence durationInFrames={250} from={110}>
        <MaskRevealEffect
          contentStyle={{
            fontFamily,
            left: '5%',
            maxWidth: 700,
            position: 'absolute',
            top: '37%',
          }}
          reverse={false}
        >
          {/* Apple iPhone 15 Pro Max */}
          <p
            style={{
              color: '#1a202c',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '4em',
              fontWeight: 'medium',
              marginBottom: '1.25rem',
            }}
          >
            {copyText ? copyText : 'Your Tagline goes here'}
          </p>
        </MaskRevealEffect>
      </Sequence>
      <Sequence durationInFrames={200} from={130}>
        <MaskRevealEffect
          contentStyle={{
            fontFamily,
            left: '5%',
            maxWidth: 700,
            position: 'absolute',
            top: '50%',
          }}
          reverse={false}
        >
          <p
            style={{
              color: '#2d3748',
              fontSize: '2.5em',
            }}
          >
            Your subtitle goes here
            {/* {"256 GB Storage | 8 GB RAM | Black Titanium"} */}
          </p>
        </MaskRevealEffect>
      </Sequence>
      {/* ButtonFade */}
      <Sequence durationInFrames={200} from={150}>
        {productSrc && (
          <MaskRevealEffect
            contentStyle={{
              left: '5%',
              position: 'absolute',
              top: '70%',
            }}
            reverse={false}
          >
            <button
              className="font-poppins-500"
              style={{
                backgroundColor: 'black',
                borderRadius: '999px',
                color: 'white',
                fontSize: 30,
                paddingBottom: '0.7rem',
                paddingLeft: '2.25rem',
                paddingRight: '2.25rem',
                paddingTop: '0.7rem',
              }}
              type="button"
            >
              {'Shop now'}
            </button>
          </MaskRevealEffect>
        )}
      </Sequence>
    </>
  );
};
