import anime from 'animejs/lib/anime.es.js';
import React, { useEffect, useRef, useState } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const RollObject: React.FC<{
  children: React.ReactNode;
  contentStyle?: React.CSSProperties;
}> = ({ children, contentStyle }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const ref = useRef<HTMLDivElement>(null);

  const [animation, setAnimation] = useState<anime.AnimeTimelineInstance | null>(null);

  useEffect(() => {
    setAnimation(() => {
      return anime
        .timeline({
          loop: false, // Set to true if you want the animation to loop
        })
        .add({
          targets: ref.current,
          translateY: [-100, 0],
          easing: 'easeOutExpo',
          duration: 1400,
          delay: (el, i) => 30 * i,
        })
        .add({
          targets: ref.current,
          opacity: 0,
          duration: 1000,
          easing: 'easeOutExpo',
          delay: 1000,
        })
        .add({
          targets: ref.current,
          translateY: [0, 100],
          easing: 'easeOutExpo',
          duration: 1500,
          delay: 2000, // Delay for 3 seconds before moving left
        });
    });
  }, []);

  useEffect(() => {
    if (!animation) {
      return;
    }
    animation.seek(((frame / fps) * 3000) % animation.duration);
  }, [animation, fps, frame]);

  return (
    <div>
      <AbsoluteFill>
        <div ref={ref} style={contentStyle}>
          {children}
        </div>
      </AbsoluteFill>
    </div>
  );
};
