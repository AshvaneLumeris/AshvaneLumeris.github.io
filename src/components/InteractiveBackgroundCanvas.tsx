import React, { useEffect, useRef } from 'react';

interface CanvasProps {
  mode?: 'particles' | 'grid' | 'constellation' | 'minimal';
  interactive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export const InteractiveBackgroundCanvas: React.FC<CanvasProps> = ({
  mode = 'constellation',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, prevX: -1000, prevY: -1000, active: false });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    const particleCount = mode === 'minimal' ? 25 : mode === 'particles' ? 90 : 60;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 1.5 + 0.8,
          alpha: Math.random() * 0.4 + 0.2,
          color: Math.random() > 0.85 ? '#e4e4e7' : '#71717a',
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const mouse = mouseRef.current;
      mouse.vx = e.clientX - mouse.prevX;
      mouse.vy = e.clientY - mouse.prevY;
      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    handleResize();

    let time = 0;

    const render = () => {
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      // Draw subtle architectural grid coordinate markers if in grid/constellation mode
      if (mode === 'grid' || mode === 'constellation') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
        ctx.lineWidth = 1;
        const gridSize = 80;
        
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Base ambient drift
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse physics (repulsion + velocity swirl)
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = 140;

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 1.8;
            p.x -= (dx / dist) * force * 3;
            p.y -= (dy / dist) * force * 3;
            p.x += mouse.vx * 0.04;
            p.y += mouse.vy * 0.04;
          }
        }

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect constellation neighbors
        if (mode === 'constellation' || mode === 'particles') {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.hypot(dx, dy);
            const connectDist = 110;

            if (dist < connectDist) {
              const alpha = (1 - dist / connectDist) * 0.12;
              ctx.strokeStyle = `rgba(228, 228, 231, ${alpha})`;
              ctx.lineWidth = 0.75;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [mode, interactive]);

  return (
    <canvas
      ref={canvasRef}
      id="interactive-bg-canvas"
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
