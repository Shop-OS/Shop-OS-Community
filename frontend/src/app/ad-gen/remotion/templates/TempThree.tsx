import { fontFamily, loadFont } from '@remotion/google-fonts/Roboto';
import React from 'react';
import { Img, Sequence } from 'remotion';
import { z } from 'zod';

import MaskResizeEffect from '../../animations/MaskResizeEffect';
// import MaskRevealEffect from '../../animations/MaskRevealEffect';
// import ObjectSlide from '../../animations/ObjectSlide';
// import ObjectSlideIn from '../../animations/ObjectSlideIn';
// import ObjectSpinIn from '../../animations/ObjectSpinIn';
import TiltSlideEffect from '../../animations/TiltSlideEffect';
import { CompositionProps } from '../../types/constants';

loadFont();

export const TempThree = ({
  productSrc,
  logoSrc,
  copyText,
}: z.infer<typeof CompositionProps> & { copyText?: string }) => {
  const imgStyle: React.CSSProperties = {
    height: 600,
    left: '50%',
    position: 'absolute',
    top: '10%',
    width: 600,
  };

  const logoStyle: React.CSSProperties = {
    height: 50,
    left: '5%',
    position: 'absolute',
    top: '10%',
    width: 50,
  };
  return (
    <>
      {/* <Sequence from={0} durationInFrames={250}> */}
      <TiltSlideEffect contentStyle={imgStyle}>
        {productSrc && (
          <Img
            placeholder={''}
            src={productSrc ? productSrc : ''}
            style={{
              height: 600,
              position: 'absolute',
              width: 600,
            }}
            // src={staticFile("/iphone13.png")}
          />
        )}
      </TiltSlideEffect>
      {/* </Sequence> */}
      <Sequence durationInFrames={270} from={80}>
        {logoSrc && (
          <MaskResizeEffect contentStyle={logoStyle} delay={3200}>
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
          </MaskResizeEffect>
        )}
      </Sequence>
      {/* TextFade 1 */}
      <Sequence durationInFrames={250} from={110}>
        <MaskResizeEffect
          contentStyle={{
            left: '5%',
            maxWidth: 700,
            position: 'absolute',
            top: '37%',
          }}
          delay={3500}
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
        </MaskResizeEffect>
      </Sequence>
      <Sequence durationInFrames={200} from={130}>
        <MaskResizeEffect
          contentStyle={{
            fontFamily,
            left: '5%',
            maxWidth: 700,
            position: 'absolute',
            top: '50%',
          }}
          delay={3000}
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
        </MaskResizeEffect>
      </Sequence>
      {/* ButtonFade */}
      <Sequence durationInFrames={200} from={150}>
        {productSrc && (
          <MaskResizeEffect
            contentStyle={{
              left: '5%',
              position: 'absolute',
              top: '70%',
            }}
            delay={1500}
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
          </MaskResizeEffect>
        )}
      </Sequence>
    </>
  );
};
