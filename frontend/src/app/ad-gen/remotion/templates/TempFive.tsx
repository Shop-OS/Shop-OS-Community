import { fontFamily, loadFont } from '@remotion/google-fonts/Roboto';
import React from 'react';
import { Img, Sequence } from 'remotion';
import { z } from 'zod';

import MaskCenterSlideFadeEffect from '../../animations/MaskCenterSlideFadeEffect';
import MaskRevealEffect from '../../animations/MaskRevealEffect';
import { CompositionProps } from '../../types/constants';

loadFont();

export const TempFive = ({
  productSrc,
  logoSrc,
  copyText,
}: z.infer<typeof CompositionProps> & { copyText?: string }) => {
  const imgStyle: React.CSSProperties = {
    height: 600,
    left: '20%',
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
      <MaskCenterSlideFadeEffect contentStyle={imgStyle}>
        {productSrc && (
          <Img
            placeholder={''}
            src={productSrc ? productSrc : ''}
            style={{
              height: 600,
              position: 'absolute',
              width: 600,
              boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.3)',
            }}
            // src={staticFile("/iphone13.png")}
          />
        )}
      </MaskCenterSlideFadeEffect>
      {/* </Sequence> */}
      <Sequence durationInFrames={270} from={120}>
        {logoSrc && (
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
      <Sequence durationInFrames={250} from={60}>
        <MaskRevealEffect
          contentStyle={{
            fontFamily,
            left: '5%',
            maxWidth: 700,
            position: 'absolute',
            top: '37%',
          }}
          reverse={true}
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
      {/* <Sequence from={130} durationInFrames={200}>
        <MoveSlideInEffect
          contentStyle={{
            position: "absolute",
            maxWidth: 700,
            left: "5%",
            top: "50%",
            color: "black",
            fontSize: 24,
            fontFamily,
          }}
        >
          <p>{"256 GB Storage | 8 GB RAM | Black Titanium"}</p>
        </MoveSlideInEffect>
      </Sequence> */}
      {/* ButtonFade */}
      <Sequence durationInFrames={200} from={120}>
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
