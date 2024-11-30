import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const outer: React.CSSProperties = {};

export const ButtonFade: React.FC<{
  children: React.ReactNode;
  contentStyle?: React.CSSProperties;
}> = ({ children, contentStyle }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Increase the animation durations
  const fadeDuration = 80;
  const scaleDuration = 70;
  const reverseDelay = 1 * fps;

  const fadeProgress = spring({
    fps,
    frame,
    // config: {
    //   damping: 200,
    // },
    durationInFrames: fadeDuration,
  });

  const scaleProgress = spring({
    fps,
    frame,
    // config: {
    //   damping: 120,
    // },
    durationInFrames: scaleDuration,
    reverse: frame > reverseDelay,
    delay: fadeDuration + 30, // Adjust the delay as needed
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
      left: '8%',
      top: '25%',
      ...popInOutStyle,
    };
  }, [maskImage, popInOutStyle]);

  const mergedContentStyle = { ...defaultContentStyle, ...contentStyle };

  return (
    <AbsoluteFill style={outer}>
      <AbsoluteFill style={container}>
        <div style={mergedContentStyle}>{children}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
