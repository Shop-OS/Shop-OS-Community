import anime from 'animejs';
import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

const MoveSlideInEffect = ({ children, contentStyle, delay = 4000 }) => {
  const maskRef = useRef(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  useEffect(() => {
    const animation = anime
      .timeline({ autoplay: false })
      // .add({
      //   targets: maskRef.current,
      //   translateY: ["100%", "0%"], // Moves the mask
      //   // scale: [1.5, 1],
      //   duration: 1000,
      //   easing: "easeInOutQuad",
      // })
      .add({
        targets: maskRef.current,
        // translateY: ["100%", "0%"], // Moves the mask
        scale: [1.2, 1],
        duration: 1000,
        easing: 'easeInOutQuad',
      })
      .add({
        targets: maskRef.current,
        scale: [1, 1.2],
        // translateY: ["0%", "60%"], // Moves the mask
        // opacity: [1, 0],
        duration: 800,
        easing: 'easeInOutQuad',
        delay: delay,
      })
      .add({
        targets: maskRef.current,
        // scale: [1, 1.2],
        translateY: ['0%', '40%'], // Moves the mask
        opacity: [1, 0],
        duration: 400,
        easing: 'easeInOutQuad',
      });

    // Sync with Remotion's frame
    animation.seek((frame / fps) * 1500); // Total duration is 12000ms

    return () => animation.pause();
  }, [frame, fps, delay]);

  return (
    // <div className="relative overflow-hidden min-w-56 h-24">
    <div style={contentStyle} ref={maskRef}>
      <div className="w-full h-full">{children}</div>
    </div>
    // </div>
  );
};

export default MoveSlideInEffect;
