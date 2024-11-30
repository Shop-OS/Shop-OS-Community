import anime from 'animejs';
import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

const MaskResizeEffect = ({ children, contentStyle, delay = 3000 }) => {
  const maskRef = useRef(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  useEffect(() => {
    const animation = anime
      .timeline({ autoplay: false })
      // Initial clipPath to hide the content
      .add({
        targets: maskRef.current,
        clipPath: ['polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)'],
        duration: 700,
      })
      // Expand the clipPath to reveal the content (start from top-right)
      .add({
        targets: maskRef.current,
        clipPath: ['polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)'],
        duration: 1500,
        easing: 'easeInOutQuad',
      })
      // Reverse the animation with a delay
      .add({
        targets: maskRef.current,
        clipPath: ['polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)'],
        duration: 1200,
        easing: 'easeInOutQuad',
        delay: delay,
      });

    // Sync with Remotion's frame
    animation.seek((frame / fps) * 1500);

    return () => animation.pause();
  }, [frame, fps, delay]);

  return (
    <div style={{ ...contentStyle, overflow: 'hidden' }}>
      <div
        ref={maskRef}
        style={{
          width: '100%',
          height: '100%',
          clipPath: 'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MaskResizeEffect;
