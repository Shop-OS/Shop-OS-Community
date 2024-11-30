import { fontFamily, loadFont } from '@remotion/google-fonts/Roboto';
import React from 'react';
import { Sequence } from 'remotion';
import { z } from 'zod';

import { CompositionProps } from '../../types/constants';
import { AnimatedImage } from '../MyComp/AnimatedImage';
import { ButtonFade } from '../MyComp/ButtonFade';
import { Slide } from '../MyComp/Slide';
import { TextFade } from '../MyComp/TextFade';

loadFont();

export const TempOne = ({
  logoSrc,
  productSrc,
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
    <div>
      {productSrc && (
        <Slide>
          <AnimatedImage contentStyle={imgStyle} src={productSrc ? productSrc : ''} />
        </Slide>
      )}
      <Sequence durationInFrames={270} from={80}>
        {logoSrc && (
          <AnimatedImage
            contentStyle={logoStyle}
            src={logoSrc}
            // src={staticFile("/appleBlack1.png")}
            // src={selectedLogo ? URL.createObjectURL(selectedLogo) : ""}
          />
        )}
      </Sequence>
      {/* TextFade 1 */}
      <Sequence durationInFrames={250} from={110}>
        <TextFade
          contentStyle={{
            fontFamily,
            left: '5%',
            maxWidth: 700,
            position: 'absolute',
            top: '37%',
          }}
          fadeDuration={80}
          scaleDuration={80}
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
        </TextFade>
      </Sequence>
      <Sequence durationInFrames={200} from={130}>
        <TextFade
          contentStyle={{
            fontFamily,
            left: '5%',
            maxWidth: 700,
            position: 'absolute',
            top: '50%',
          }}
          fadeDuration={70}
          scaleDuration={60}
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
        </TextFade>
      </Sequence>
      {/* ButtonFade */}
      <Sequence durationInFrames={200} from={150}>
        {productSrc && (
          <ButtonFade
            contentStyle={{
              left: '5%',
              position: 'absolute',
              top: '70%',
            }}
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
          </ButtonFade>
        )}
      </Sequence>
    </div>
  );
};
