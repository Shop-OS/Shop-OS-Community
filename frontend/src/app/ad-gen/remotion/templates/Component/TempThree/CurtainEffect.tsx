import anime from 'animejs/lib/anime.es.js';
import React, { useEffect, useRef, useState } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const CurtainEffect: React.FC<{
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
          loop: false,
        })
        .add({
          targets: ref.current,
          scaleY: [0, 1],
          opacity: [0.5, 1],
          easing: 'easeOutExpo',
          duration: 700,
        })

        .add({
          targets: ref.current,
          opacity: [0, 1],
          easing: 'easeOutExpo',
          duration: 600,
          offset: '-=775',
          delay: (el, i) => 34 * (i + 1),
        })
        .add({
          targets: ref.current,
          opacity: 0,
          duration: 1000,
          easing: 'easeOutExpo',
          delay: 1000,
        });
    });
  }, []);

  useEffect(() => {
    if (!animation) {
      return;
    }
    // Sync with Remotion's frame
    animation.seek((frame / fps) * 1500);
  }, [frame, fps]);

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
