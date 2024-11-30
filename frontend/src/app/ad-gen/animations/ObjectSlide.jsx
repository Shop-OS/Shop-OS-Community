import anime from 'animejs';
import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

const ObjectSlide = ({ children, contentStyle }) => {
  const maskRef = useRef(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Function to reset the initial state of the animation
  const resetAnimationState = () => {
    anime.set(maskRef.current, {
      translateX: '-50%',
      opacity: 1,
    });
  };

  useEffect(() => {
    const animation = anime
      .timeline({ autoplay: false })
      .add({
        targets: maskRef.current,
        scale: [1.5, 1],
        translateX: '-50%',
        opacity: [0, 1],
        duration: 1200,
        easing: 'easeInOutQuad',
      })
      .add({
        targets: maskRef.current,
        translateX: ['-50%', '0%'], // Moves the mask
        duration: 1500,
        easing: 'easeInOutQuad',
        delay: 1300,
      })
      .add({
        targets: maskRef.current,
        translateX: ['0%', '-50%'], // Moves the mask
        duration: 1500,
        easing: 'easeInOutQuad',
        delay: 7000, // Delay of 2 seconds after the first animation
      })
      .add({
        targets: maskRef.current,
        translateX: '-50%',
        opacity: [1, 0],
        scale: [1, 0],
        duration: 1200,
        easing: 'easeInOutQuad',
      });

    if (frame === 0) {
      resetAnimationState();
    }

    animation.seek((frame / fps) * 1500);

    return () => animation.pause();
  }, [fps, frame]);

  return (
    // <div style={contentStyle} ref={maskRef}>
    <div style={{ ...contentStyle }}>
      <div className="w-full h-full" ref={maskRef}>
        {children}
      </div>
    </div>
  );
};

export default ObjectSlide;
