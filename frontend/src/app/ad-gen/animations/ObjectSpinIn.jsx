import anime from 'animejs';
import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

const ObjectSpinIn = ({ children }) => {
  const ref = useRef(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  useEffect(() => {
    anime({
      targets: ref.current,
      scale: [0, 1],
      rotate: [-180, 0],
      duration: 3000,
      easing: 'easeOutElastic(1, .3)',
      autoplay: false,
    });
  }, []);

  useEffect(() => {
    const animation = anime({
      targets: ref.current,
      scale: [0, 1],
      rotate: [-180, 0],
      duration: 3000,
      easing: 'easeOutElastic(1, .3)',
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

export default ObjectSpinIn;
