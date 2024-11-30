import React, { useMemo } from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type SlideDirection = 'from-left' | 'from-top' | 'from-right' | 'from-bottom';

export type SlideProps = {
  direction?: SlideDirection;
  exitStyle?: React.CSSProperties;
  enterStyle?: React.CSSProperties;
  children: React.ReactNode;
};

const SlidePresentation: React.FC<SlideProps> = ({
  children,
  direction = 'from-left',
  exitStyle,
  enterStyle,
}) => {
  const frame = useCurrentFrame();
  const fps = useVideoConfig().fps;

  // Duration for slide animation
  const slideDuration = 90;
  // Duration before starting the reverse animation
  const reverseDelay = 5 * fps; // 5 seconds delay

  // Initial duration for rotate and scale
  const initialDuration = 50;
  // Tween function for initial rotate and scale
  const initialProgress = (frame: number) => Math.min(1, frame * 0.02);

  // Slide animation logic
  const slideProgress = spring({
    fps,
    frame: frame - initialDuration,
    // config: {
    //   damping: 200,
    // },
    durationInFrames: slideDuration,
    reverse: frame > initialDuration + slideDuration + reverseDelay, // Reverse animation after the delay
  });

  // Scale animation
  const scale = initialProgress(frame); // Scale from 0.5 to 1
  // console.log("scale", scale, frame);

  // Rotate animation
  let rotate = 0;
  if (frame <= initialDuration) {
    // Initial rotation while scaling
    rotate = -15 * initialProgress(frame); // Adjust the tilt angle by changing the multiplier
  }

  const easing = 'cubic-bezier(0.50, 1, 0.3, 1)';
  const reverseEasing = 'cubic-bezier(0.50, 0, 0.3, 1)';

  const slideStyle = useMemo((): React.CSSProperties => {
    switch (direction) {
      case 'from-left':
        // console.log(scale, slideProgress, rotate, frame)
        return {
          transform: `scale(${scale}) translateX(${
            7 + slideProgress * 30 - 30
          }%) rotate(${rotate}deg)`,
          transition: `transform 0.4s`,
        };
      case 'from-right':
        return {
          transform: `translateX(${100 - slideProgress * 100}%)`,
          transition: `transform 0.7s ${
            frame > initialDuration + slideDuration + reverseDelay ? reverseEasing : easing
          }`,
        };
      case 'from-top':
        return {
          transform: `translateY(${-100 + slideProgress * 100}%)`,
          transition: `transform 0.7s ${
            frame > initialDuration + slideDuration + reverseDelay ? reverseEasing : easing
          }`,
        };
      case 'from-bottom':
        return {
          transform: `translateY(${100 - slideProgress * 100}%)`,
          transition: `transform 0.7s ${
            frame > initialDuration + slideDuration + reverseDelay ? reverseEasing : easing
          }`,
        };
      default:
        throw new Error(`Invalid direction: ${direction}`);
    }
  }, [scale, rotate, slideProgress, direction, frame, initialDuration, reverseDelay]);

  const style: React.CSSProperties = useMemo(() => {
    return {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      ...slideStyle,
      // ...(presentationProgress === "entering" ? enterStyle : exitStyle),
    };
  }, [slideStyle]);

  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const Slide: React.FC<SlideProps> = (props) => {
  return <SlidePresentation {...props} />;
};
