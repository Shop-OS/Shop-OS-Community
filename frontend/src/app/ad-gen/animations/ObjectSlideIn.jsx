import anime from 'animejs';
import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

const ObjectSlideIn = ({ children, contentStyle }) => {
  const maskRef = useRef(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  useEffect(() => {
    const animation = anime.timeline({ autoplay: false }).add({
      targets: maskRef.current,
      translateY: ['-100%', '0%'], // Moves the mask
      duration: 1500,
      easing: 'easeInOutQuad',
    });

    return () => animation.pause();
  }, []);

  useEffect(() => {
    const animation = anime({
      targets: maskRef.current,
      translateY: ['-100%', '0%'],
      easing: 'easeInOutQuad',
      autoplay: false,
    });

    // Sync with Remotion's frame
    animation.seek((frame / fps) * 1500);
  }, [frame, fps]);

  return (
    // <div className="relative overflow-hidden min-w-56 h-24">
    <div style={contentStyle} ref={maskRef}>
      <div className="w-full h-full">{children}</div>
    </div>
    // </div>
  );
};

export default ObjectSlideIn;
