import anime from 'animejs';
import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

const MaskCenterEffect = ({ children, contentStyle }) => {
  const maskRef = useRef(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  useEffect(() => {
    const animation = anime
      .timeline({ autoplay: false })
      .add({
        targets: maskRef.current,
        clipPath: [
          'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
          'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        ],
        duration: 1200,
        easing: 'easeInOutQuad',
      })
      .add({
        targets: maskRef.current,
        translateX: ['-50%', '0%'], // Moves the mask
        duration: 1200,
        easing: 'easeOutExpo',
        delay: 1000,
      })
      .add({
        targets: maskRef.current,
        translateX: ['0%', '-50%'], // Moves the mask
        duration: 1200,
        easing: 'easeOutExpo',
        delay: 7000,
      })
      .add({
        targets: maskRef.current,
        clipPath: [
          'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
        ],
        duration: 1200,
        easing: 'easeInOutQuad',
        delay: 800,
      });

    // Sync with Remotion's frame
    animation.seek((frame / fps) * 1500); // Total duration is 12000ms

    return () => animation.pause();
  }, [frame, fps]);

  return (
    <div style={{ ...contentStyle }}>
      <div
        ref={maskRef}
        style={{
          width: '100%',
          height: '100%',
          clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MaskCenterEffect;
