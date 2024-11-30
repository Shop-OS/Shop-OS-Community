import anime from 'animejs';
import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

const MaskCenterSlideFadeEffect = ({ children, contentStyle }) => {
  const maskRef = useRef(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Function to reset the initial state of the animation
  const resetAnimationState = () => {
    anime.set(maskRef.current, {
      translateX: '-50%',
      opacity: 1,
      clipPath: [
        'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
        'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      ],
    });
  };

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
        scale: [1.2, 1],
        opacity: [0, 1],
        easing: 'easeInOutQuint',
      })
      .add({
        targets: maskRef.current,
        translateX: ['-50%', '60%'], // Moves the mask
        duration: 800,
        easing: 'easeInOutQuint',
        delay: 900,
      })
      .add({
        targets: maskRef.current,
        translateX: ['60%', '100%'], // Moves the mask
        opacity: [1, 0],
        duration: 1000,
        easing: 'easeInOutQuint',
        delay: 8000,
      });

    if (frame === 0) {
      resetAnimationState();
    }

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

export default MaskCenterSlideFadeEffect;
