import anime from 'animejs/lib/anime.es.js';
import React, { useEffect, useRef, useState } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export type SlideProps = {
  exitStyle?: React.CSSProperties;
  enterStyle?: React.CSSProperties;
  children: React.ReactNode;
};

const SlidePresentation: React.FC<SlideProps> = ({ children, exitStyle, enterStyle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ref = useRef<HTMLDivElement>(null);

  const [animation, setAnimation] = useState<anime.AnimeInstance | null>(null);

  // Using a useEffect, because anime needs to get the ref once it's mounted
  useEffect(() => {
    setAnimation(() => {
      return anime
        .timeline({
          loop: false,
        })
        .add({
          targets: ref.current,
          scale: [5, 1],
          easing: 'easeOutCirc',
          duration: 800,
          delay: (el, i) => 800 * i,
        })
        .add({
          targets: ref.current,
          opacity: [0, 1],
          easing: 'easeOutCirc',
          duration: 800,
          delay: 0,
        })
        .add({
          targets: ref.current,
          translateX: [0, 450], // Move it to the right
          easing: 'easeInOutSine',
          duration: 1500,
          delay: 0,
        })
        .add({
          targets: ref.current,
          translateX: [450, 0], // Move it back to the left
          easing: 'easeInOutSine',
          duration: 1500,
        });
    });
  }, []);

  useEffect(() => {
    if (!animation) {
      return;
    }

    // Sync with Remotion's frame
    animation.seek((frame / fps) * animation.duration);
  }, [frame, fps, animation]);

  return (
    <AbsoluteFill>
      <div ref={ref}>{children}</div>
    </AbsoluteFill>
  );
};

export const PopUp: React.FC<SlideProps> = (props) => {
  return <SlidePresentation {...props} />;
};
