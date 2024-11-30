import React, { useMemo } from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const outer: React.CSSProperties = {};

export const AnimatedImage: React.FC<{
  src: string;
  contentStyle?: React.CSSProperties;
}> = ({ src, contentStyle }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const reverseDelay = 1 * fps;

  const fadeProgress = spring({
    fps,
    frame,
    // config: {
    //   damping: 10,
    // },
    durationInFrames: 80,
  });

  // Scale animation logic
  const scaleProgress = spring({
    fps,
    frame,
    // config: {
    //   damping: 20,
    // },
    durationInFrames: 60,
    reverse: frame > reverseDelay,
    delay: fadeProgress + 220,
  });

  const bottomStop = interpolate(fadeProgress, [0, 1], [200, 0]);

  const topStop = Math.max(0, bottomStop - 60);

  const maskImage = `linear-gradient(to top, transparent ${topStop}%)`;

  const scale = 2 - scaleProgress;

  const popInOutStyle: React.CSSProperties = useMemo(() => {
    const opacity = scaleProgress;

    return {
      opacity,
      transform: `scale(${scale})`,
      transition: `transform 0.2s ease`,
    };
  }, [scale, scaleProgress]);

  const container: React.CSSProperties = useMemo(() => {
    return {
      justifyContent: 'center',
      alignItems: 'center',
    };
  }, []);

  const defaultContentStyle: React.CSSProperties = useMemo(() => {
    return {
      maskImage,
      WebkitMaskImage: maskImage,
      position: 'absolute',
      left: '50%',
      top: '50%',
      transformOrigin: 'center center',
      ...popInOutStyle,
    };
  }, [maskImage, popInOutStyle]);

  const mergedContentStyle = { ...defaultContentStyle, ...contentStyle };

  return (
    <AbsoluteFill style={outer}>
      <AbsoluteFill style={container}>
        <Img src={src} style={mergedContentStyle} alt="Animated Image" placeholder="" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
