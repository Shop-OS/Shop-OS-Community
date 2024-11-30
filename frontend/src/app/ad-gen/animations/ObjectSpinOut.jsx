import anime from 'animejs';
import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

const ObjectSpinOut = ({ children }) => {
  const ref = useRef(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  useEffect(() => {
    anime({
      targets: ref.current,
      scale: [1, 0],
      rotate: [0, 180],
      duration: 3000,
      delay: 800,
      easing: 'easeInElastic(1, .8)',
      autoplay: false,
    });
  }, []);

  useEffect(() => {
    const animation = anime({
      targets: ref.current,
      scale: [1, 0],
      rotate: [0, 180],
      duration: 3000,
      delay: 800,
      easing: 'easeInElastic(1, .8)',
      autoplay: false,
    });

    animation.seek((frame / fps) * 1500);
  }, [frame, fps]);

  return (
    <div ref={ref} className="w-full h-full">
      {children}
    </div>
  );
};

export default ObjectSpinOut;
