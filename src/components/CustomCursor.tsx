import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [cursorState, setCursorState] = useState<'default' | 'pointer' | 'canvas' | 'drag'>('default');
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // High-performance spring interpolation
  const springConfig = { damping: 28, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const dotConfig = { damping: 45, stiffness: 900, mass: 0.1 };
  const dotX = useSpring(mouseX, dotConfig);
  const dotY = useSpring(mouseY, dotConfig);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('button, a, input, textarea, [role="button"], [data-magnetic]')) {
        setCursorState('pointer');
      } else if (target.closest('canvas, [data-canvas-zone]')) {
        setCursorState('canvas');
      } else if (target.closest('[data-draggable]')) {
        setCursorState('drag');
      } else {
        setCursorState('default');
      }
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [mouseX, mouseY, visible]);

  if (isTouch || !visible) return null;

  const isPointer = cursorState === 'pointer';
  const isCanvas = cursorState === 'canvas';
  const isDrag = cursorState === 'drag';

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Outer physics ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border flex items-center justify-center backdrop-blur-[1px]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isPointer ? 48 : isCanvas ? 54 : isDrag ? 44 : 26,
          height: isPointer ? 48 : isCanvas ? 54 : isDrag ? 44 : 26,
          borderColor: isPointer
            ? 'rgba(255, 255, 255, 0.6)'
            : isCanvas
            ? 'rgba(244, 244, 245, 0.4)'
            : 'rgba(255, 255, 255, 0.25)',
          backgroundColor: isPointer
            ? 'rgba(255, 255, 255, 0.08)'
            : isCanvas
            ? 'rgba(255, 255, 255, 0.03)'
            : 'transparent',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      >
        {isCanvas && (
          <span className="text-[9px] font-mono tracking-widest text-zinc-300 uppercase">
            SIM
          </span>
        )}
        {isDrag && (
          <span className="text-[9px] font-mono tracking-widest text-zinc-300 uppercase">
            DRAG
          </span>
        )}
      </motion.div>

      {/* Core precision dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isPointer ? 6 : 4,
          height: isPointer ? 6 : 4,
          opacity: isCanvas || isDrag ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
};
