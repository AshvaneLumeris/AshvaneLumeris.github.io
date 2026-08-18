import React, { useRef, useEffect } from 'react';
import { motion, useSpring } from 'motion/react';
import { ColorTheme } from './VisualCanvas';

interface KineticCharProps {
  char: string;
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>;
  colorTheme: ColorTheme;
}

const KineticChar: React.FC<KineticCharProps> = ({ char, mousePosRef, colorTheme }) => {
  const charRef = useRef<HTMLSpanElement | null>(null);

  // Motion springs for smooth 60fps physics without triggering React renders
  const springX = useSpring(0, { damping: 14, stiffness: 280, mass: 0.5 });
  const springY = useSpring(0, { damping: 14, stiffness: 280, mass: 0.5 });
  const springRotate = useSpring(0, { damping: 14, stiffness: 280, mass: 0.5 });
  const springScale = useSpring(1, { damping: 14, stiffness: 280, mass: 0.5 });

  useEffect(() => {
    let animId: number;

    const updatePhysics = () => {
      if (charRef.current) {
        const rect = charRef.current.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;

        const mx = mousePosRef.current.x;
        const my = mousePosRef.current.y;

        const dx = mx - charCenterX;
        const dy = my - charCenterY;
        const dist = Math.hypot(dx, dy);
        const maxDist = 240;

        if (dist < maxDist && dist > 0) {
          const factor = 1 - dist / maxDist;
          const pushStrength = factor * 45;
          const angle = Math.atan2(dy, dx);

          springX.set(-Math.cos(angle) * pushStrength);
          springY.set(-Math.sin(angle) * pushStrength);
          springRotate.set((dx / maxDist) * 22);
          springScale.set(1 + factor * 0.18);
        } else {
          springX.set(0);
          springY.set(0);
          springRotate.set(0);
          springScale.set(1);
        }
      }
      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [mousePosRef, springX, springY, springRotate, springScale]);

  if (char === ' ') {
    return <span className="inline-block w-4 md:w-8" />;
  }

  const getTextColor = () => {
    switch (colorTheme) {
      case 'amber-gold':
        return 'text-amber-100 selection:bg-amber-400 selection:text-zinc-950';
      case 'cyber-cyan':
        return 'text-sky-100 selection:bg-sky-400 selection:text-zinc-950';
      case 'aurora-violet':
        return 'text-purple-100 selection:bg-purple-400 selection:text-zinc-950';
      default:
        return 'text-white selection:bg-zinc-100 selection:text-zinc-950';
    }
  };

  return (
    <motion.span
      ref={charRef}
      style={{
        x: springX,
        y: springY,
        rotate: springRotate,
        scale: springScale,
      }}
      className={`inline-block relative select-none font-mono font-bold tracking-tight ${getTextColor()} transition-colors duration-300`}
    >
      {char}
    </motion.span>
  );
};

interface KineticTypographyProps {
  colorTheme?: ColorTheme;
}

export const KineticTypography: React.FC<KineticTypographyProps> = ({ colorTheme = 'titanium' }) => {
  const mousePosRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const title = 'ASHVANE LUMERIS';
  const subtitle = 'KINETIC PHYSICS • INTERACTIVE VISUAL ENGINE';

  return (
    <div
      id="kinetic-typography-stage"
      className="relative z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
    >
      {/* Clean Per-Character Kinetic Hero Typography (Icon removed from hero) */}
      <div className="flex flex-wrap justify-center items-center text-4xl sm:text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-none mb-3">
        {title.split('').map((c, i) => (
          <KineticChar
            key={i}
            char={c}
            mousePosRef={mousePosRef}
            colorTheme={colorTheme}
          />
        ))}
      </div>

      {/* Subtitle Minimalist Telemetry Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="flex items-center gap-3 text-[10px] sm:text-xs font-mono text-zinc-400 tracking-widest uppercase mt-2 select-none"
      >
        <span className="h-[1px] w-6 sm:w-10 bg-zinc-700" />
        <span>{subtitle}</span>
        <span className="h-[1px] w-6 sm:w-10 bg-zinc-700" />
      </motion.div>
    </div>
  );
};
