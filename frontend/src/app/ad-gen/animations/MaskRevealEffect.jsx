import anime from 'animejs';
import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

const MaskRevealEffect = ({ children, contentStyle, reverse }) => {
  const maskRef = useRef(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  useEffect(() => {
    const animation = anime
      .timeline({ autoplay: false })
      .add({
        targets: maskRef.current,
        clipPath: [
          'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        ],
        duration: 2000,
        easing: 'easeInOutQuint',
      })
      .add({
        targets: maskRef.current,
        translateY: reverse ? ['100%', '0%'] : ['0%', '100%'],
        duration: 2000,
        easing: 'easeInOutQuint',
        delay: reverse ? 0 : 9000,
      })
      .add({
        targets: maskRef.current,
        translateY: reverse && ['0%', '100%'],
        duration: 2000,
        easing: 'easeInOutQuint',
        delay: 9000,
      });

    // Sync with Remotion's frame
    animation.seek((frame / fps) * 3000);

    return () => animation.pause();
  }, [frame, fps, reverse]);

  return (
    <div style={{ ...contentStyle, overflow: 'hidden' }}>
      <div
        ref={maskRef}
        style={{
          width: '100%',
          height: '80px',
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MaskRevealEffect;
