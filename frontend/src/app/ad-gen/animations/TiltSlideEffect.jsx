import anime from 'animejs';
import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

const TiltSlideEffect = ({ children, contentStyle }) => {
  const maskRef = useRef(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  useEffect(() => {
    const animation = anime
      .timeline({ autoplay: false })
      .add({
        targets: maskRef.current,
        translateY: ['50%', '0%'],
        opacity: [0, 1],
        duration: 1200,
        easing: 'easeOutCirc',
      })
      .add({
        targets: maskRef.current,
        rotate: [0, 20], // Tilt right
        duration: 600,
        easing: 'easeOutCirc',
      })
      .add({
        targets: maskRef.current,
        rotate: [20, 0], // Straighten
        translateX: ['-50%', '0%'], // Moves the mask
        duration: 600,
        easing: 'easeInOutQuad',
      })
      // .add({
      //   targets: maskRef.current,
      //   translateX: ["-50%", "0%"], // Moves the mask
      //   duration: 1500,
      //   easing: "easeInOutQuad",
      // })
      .add({
        targets: maskRef.current,
        translateX: ['0%', '-50%'], // Moves the mask
        duration: 1500,
        easing: 'easeInOutQuad',
        delay: 7000, // Delay of 2 seconds after the first animation
      })
      .add({
        targets: maskRef.current,
        opacity: [1, 0],
        duration: 1200,
        easing: 'easeOutCirc',
      });

    animation.seek((frame / fps) * 1500);

    return () => animation.pause();
  }, [fps, frame]);

  return (
    <div style={contentStyle} ref={maskRef}>
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

export default TiltSlideEffect;
