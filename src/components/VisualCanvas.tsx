import React, { useEffect, useRef } from 'react';

export type VisualMode =
  | 'fluid-vortex'
  | 'quantum-nebula'
  | 'gravitational-lens'
  | 'solar-magnetosphere'
  | 'chaotic-attractor'
  | 'supernova-burst'
  | 'elastic-lattice'
  | 'geometric-polytope'
  | 'kinetic-constellation'
  | 'wave-distortion';

export type MouseInteractionType = 'repel' | 'attract' | 'vortex' | 'warp' | 'pulse';

export type ColorTheme = 'titanium' | 'amber-gold' | 'cyber-cyan' | 'monochrome' | 'aurora-violet';

interface VisualCanvasProps {
  mode: VisualMode;
  interactionType: MouseInteractionType;
  particleDensity: number; // 0.5 to 2.5
  speedMultiplier: number; // 0.4 to 2.5
  elasticity: number; // 0.1 to 1.5
  colorTheme: ColorTheme;
  showTrails: boolean;
}

export const VisualCanvas: React.FC<VisualCanvasProps> = ({
  mode,
  interactionType,
  particleDensity,
  speedMultiplier,
  elasticity,
  colorTheme,
  showTrails,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    vx: 0,
    vy: 0,
    prevX: -1000,
    prevY: -1000,
    isDown: false,
    clickImpulse: 0,
    shockwaves: [] as { x: number; y: number; radius: number; maxRadius: number; strength: number; alpha: number }[],
  });

  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Palette Derivation
    const getPalette = () => {
      switch (colorTheme) {
        case 'amber-gold':
          return {
            primary: '#fbbf24',
            secondary: '#f59e0b',
            accent: '#d97706',
            highlight: '#fef3c7',
            dim: '#78350f',
            rgba: (a: number) => `rgba(251, 191, 36, ${a})`,
          };
        case 'cyber-cyan':
          return {
            primary: '#38bdf8',
            secondary: '#0ea5e9',
            accent: '#06b6d4',
            highlight: '#e0f2fe',
            dim: '#0369a1',
            rgba: (a: number) => `rgba(56, 189, 248, ${a})`,
          };
        case 'aurora-violet':
          return {
            primary: '#c084fc',
            secondary: '#a855f7',
            accent: '#818cf8',
            highlight: '#faf5ff',
            dim: '#581c87',
            rgba: (a: number) => `rgba(192, 132, 252, ${a})`,
          };
        case 'monochrome':
          return {
            primary: '#e4e4e7',
            secondary: '#a1a1aa',
            accent: '#71717a',
            highlight: '#ffffff',
            dim: '#3f3f46',
            rgba: (a: number) => `rgba(228, 228, 231, ${a})`,
          };
        case 'titanium':
        default:
          return {
            primary: '#ffffff',
            secondary: '#d4d4d8',
            accent: '#a1a1aa',
            highlight: '#ffffff',
            dim: '#52525b',
            rgba: (a: number) => `rgba(244, 244, 245, ${a})`,
          };
      }
    };

    const palette = getPalette();

    // Standard & Heavy Particle Sets
    const baseCount =
      mode === 'fluid-vortex'
        ? 1000
        : mode === 'quantum-nebula'
        ? 1200
        : mode === 'gravitational-lens'
        ? 850
        : mode === 'solar-magnetosphere'
        ? 900
        : mode === 'supernova-burst'
        ? 1400
        : mode === 'kinetic-constellation'
        ? 140
        : 400;

    const count = Math.floor(baseCount * particleDensity);

    interface Particle {
      x: number;
      y: number;
      ox: number;
      oy: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      baseAlpha: number;
      color: string;
      angle: number;
      orbitRadius: number;
      orbitSpeed: number;
      energy: number;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const distFromCenter = Math.hypot(x - width / 2, y - height / 2);

      const randColor =
        Math.random() > 0.85
          ? palette.highlight
          : Math.random() > 0.5
          ? palette.primary
          : Math.random() > 0.25
          ? palette.secondary
          : palette.accent;

      particles.push({
        x,
        y,
        ox: x,
        oy: y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.2,
        color: randColor,
        angle: Math.random() * Math.PI * 2,
        orbitRadius: distFromCenter,
        orbitSpeed: (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        energy: Math.random(),
        life: Math.random() * 100,
        maxLife: 80 + Math.random() * 80,
      });
    }

    // Lorenz Attractor Trace Array
    const attractorPoints: { x: number; y: number; z: number }[] = [];
    let lx = 0.1, ly = 0, lz = 0;
    const sigma = 10, rho = 28, beta = 8 / 3;
    const dt = 0.009;
    for (let i = 0; i < 2000; i++) {
      const dx = sigma * (ly - lx) * dt;
      const dy = (lx * (rho - lz) - ly) * dt;
      const dz = (lx * ly - beta * lz) * dt;
      lx += dx;
      ly += dy;
      lz += dz;
      attractorPoints.push({ x: lx, y: ly, z: lz });
    }

    // Elastic Lattice Mesh
    const cols = Math.floor(width / 42);
    const rows = Math.floor(height / 42);
    const meshPoints: { x: number; y: number; ox: number; oy: number; vx: number; vy: number }[] = [];
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const x = (c / cols) * width;
        const y = (r / rows) * height;
        meshPoints.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
      }
    }

    // 3D Polytope Vertices
    const phi = (1 + Math.sqrt(5)) / 2;
    const raw3DVertices = [
      [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
      [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
      [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1],
      [ 0, 0,  phi * 1.5], [ 0, 0, -phi * 1.5],
      [ phi * 1.5, 0, 0], [-phi * 1.5, 0, 0],
      [ 0,  phi * 1.5, 0], [ 0, -phi * 1.5, 0]
    ];
    const polytopeVertices = raw3DVertices.map((v) => {
      const len = Math.hypot(v[0], v[1], v[2]);
      return { x: (v[0] / len) * 200, y: (v[1] / len) * 200, z: (v[2] / len) * 200 };
    });

    let rotX = 0, rotY = 0, rotZ = 0;
    let targetRotX = 0, targetRotY = 0;

    // Mouse Listeners
    const onMouseMove = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      mouse.vx = (e.clientX - mouse.prevX) * 0.45;
      mouse.vy = (e.clientY - mouse.prevY) * 0.45;
      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      targetRotY = (e.clientX / width - 0.5) * Math.PI * 1.8;
      targetRotX = (e.clientY / height - 0.5) * Math.PI * 1.8;
    };

    const onMouseDown = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      mouse.isDown = true;
      mouse.clickImpulse = 38;

      mouse.shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: Math.max(width, height) * 0.55,
        strength: 28,
        alpha: 0.85,
      });

      // Supernova specific burst triggers
      if (mode === 'supernova-burst') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const angle = Math.random() * Math.PI * 2;
          const burstSpd = Math.random() * 16 + 4;
          p.x = e.clientX;
          p.y = e.clientY;
          p.vx = Math.cos(angle) * burstSpd;
          p.vy = Math.sin(angle) * burstSpd;
          p.life = p.maxLife;
        }
      }
    };

    const onMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    const onMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      mouseRef.current.isDown = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    // Main Render Loop
    let time = 0;

    const render = () => {
      time += 0.016 * speedMultiplier;

      // Background clearing / phosphor trailing
      if (showTrails) {
        ctx.fillStyle = 'rgba(9, 9, 11, 0.22)';
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, width, height);
      }

      const mouse = mouseRef.current;
      if (mouse.clickImpulse > 0) {
        mouse.clickImpulse *= 0.91;
        if (mouse.clickImpulse < 0.1) mouse.clickImpulse = 0;
      }

      // Shockwaves
      for (let s = mouse.shockwaves.length - 1; s >= 0; s--) {
        const sw = mouse.shockwaves[s];
        sw.radius += (sw.maxRadius - sw.radius) * 0.08 + 4;
        sw.alpha *= 0.94;

        ctx.strokeStyle = palette.rgba(sw.alpha * 0.75);
        ctx.lineWidth = Math.max(1, (1 - sw.radius / sw.maxRadius) * 3);
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (sw.alpha < 0.02 || sw.radius >= sw.maxRadius * 0.95) {
          mouse.shockwaves.splice(s, 1);
        }
      }

      // ----------------------------------------------------------------------
      // MODE 1: FLUID VORTEX
      // ----------------------------------------------------------------------
      if (mode === 'fluid-vortex') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const noiseScale = 0.0032;
          const noiseAngle =
            Math.sin(p.x * noiseScale + time * 0.7) * Math.cos(p.y * noiseScale + time * 0.5) * Math.PI * 4;

          p.vx += Math.cos(noiseAngle) * 0.22 * speedMultiplier;
          p.vy += Math.sin(noiseAngle) * 0.22 * speedMultiplier;

          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = mouse.isDown ? 300 : 190;

          if (dist < maxDist && dist > 1) {
            const normDist = 1 - dist / maxDist;
            if (interactionType === 'repel') {
              p.vx -= (dx / dist) * normDist * 2.8;
              p.vy -= (dy / dist) * normDist * 2.8;
            } else if (interactionType === 'attract') {
              p.vx += (dx / dist) * normDist * 2.2;
              p.vy += (dy / dist) * normDist * 2.2;
            } else if (interactionType === 'vortex') {
              p.vx += (-dy / dist) * normDist * 3.8 + mouse.vx * 0.08;
              p.vy += (dx / dist) * normDist * 3.8 + mouse.vy * 0.08;
            } else if (interactionType === 'warp') {
              p.vx += Math.sin(dist * 0.06 + time * 2) * normDist * 3.5;
              p.vy += Math.cos(dist * 0.06 + time * 2) * normDist * 3.5;
            } else if (interactionType === 'pulse') {
              const pulse = Math.sin(time * 6 - dist * 0.08) * 3;
              p.vx += (dx / dist) * pulse * normDist;
              p.vy += (dy / dist) * pulse * normDist;
            }

            if (mouse.clickImpulse > 0) {
              p.vx -= (dx / dist) * mouse.clickImpulse * 0.35;
              p.vy -= (dy / dist) * mouse.clickImpulse * 0.35;
            }
          }

          p.vx *= 0.94;
          p.vy *= 0.94;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ----------------------------------------------------------------------
      // MODE 2: SOLAR MAGNETOSPHERE (NEW VISUAL)
      // ----------------------------------------------------------------------
      else if (mode === 'solar-magnetosphere') {
        const pole1X = mouse.x > 0 ? mouse.x : width * 0.4;
        const pole1Y = mouse.y > 0 ? mouse.y : height * 0.5;
        const pole2X = width - pole1X;
        const pole2Y = height - pole1Y;

        // Draw Dipole Magnetosphere Field Lines
        ctx.lineWidth = 0.8;
        const numLines = 36;
        for (let l = 0; l < numLines; l++) {
          const theta = (l / numLines) * Math.PI * 2;
          ctx.strokeStyle = palette.rgba(0.08 + (l % 4 === 0 ? 0.12 : 0));
          ctx.beginPath();
          let curX = pole1X + Math.cos(theta) * 20;
          let curY = pole1Y + Math.sin(theta) * 20;
          ctx.moveTo(curX, curY);

          for (let step = 0; step < 40; step++) {
            const d1x = curX - pole1X;
            const d1y = curY - pole1Y;
            const r1 = Math.hypot(d1x, d1y) + 10;

            const d2x = curX - pole2X;
            const d2y = curY - pole2Y;
            const r2 = Math.hypot(d2x, d2y) + 10;

            const fx = (d1x / Math.pow(r1, 2.2)) - (d2x / Math.pow(r2, 2.2));
            const fy = (d1y / Math.pow(r1, 2.2)) - (d2y / Math.pow(r2, 2.2));
            const fMag = Math.hypot(fx, fy) + 0.0001;

            curX += (fx / fMag) * 16;
            curY += (fy / fMag) * 16;
            ctx.lineTo(curX, curY);
          }
          ctx.stroke();
        }

        // Charged Plasma Particles along magnetic field
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const d1x = p.x - pole1X;
          const d1y = p.y - pole1Y;
          const r1 = Math.hypot(d1x, d1y) + 15;

          const d2x = p.x - pole2X;
          const d2y = p.y - pole2Y;
          const r2 = Math.hypot(d2x, d2y) + 15;

          const bx = (-d1y / Math.pow(r1, 1.8)) + (d2y / Math.pow(r2, 1.8));
          const by = (d1x / Math.pow(r1, 1.8)) - (d2x / Math.pow(r2, 1.8));

          p.vx += bx * 350 * speedMultiplier;
          p.vy += by * 350 * speedMultiplier;

          p.vx *= 0.92;
          p.vy *= 0.92;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ----------------------------------------------------------------------
      // MODE 3: CHAOTIC LORENZ ATTRACTOR (NEW VISUAL)
      // ----------------------------------------------------------------------
      else if (mode === 'chaotic-attractor') {
        const cx = width / 2;
        const cy = height / 2;
        const scale = Math.min(width, height) * 0.024;

        rotX += (targetRotX - rotX) * 0.05 + 0.004 * speedMultiplier;
        rotY += (targetRotY - rotY) * 0.05 + 0.007 * speedMultiplier;

        ctx.lineWidth = 1.0;
        ctx.beginPath();

        for (let i = 0; i < attractorPoints.length; i++) {
          const pt = attractorPoints[i];
          const x1 = pt.x * Math.cos(rotY) - pt.z * Math.sin(rotY);
          const z1 = pt.x * Math.sin(rotY) + pt.z * Math.cos(rotY);

          const y2 = (pt.y - 25) * Math.cos(rotX) - z1 * Math.sin(rotX);
          const z2 = (pt.y - 25) * Math.sin(rotX) + z1 * Math.cos(rotX);

          const projScale = 500 / (500 + z2 * scale + 150);
          const sx = cx + x1 * scale * projScale;
          const sy = cy + y2 * scale * projScale;

          if (i === 0) {
            ctx.moveTo(sx, sy);
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.strokeStyle = palette.rgba(0.4);
        ctx.stroke();

        // Orbiting phase tracer particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const ptIdx = Math.floor((time * 40 + i * 5) % attractorPoints.length);
          const pt = attractorPoints[ptIdx];

          const x1 = pt.x * Math.cos(rotY) - pt.z * Math.sin(rotY);
          const z1 = pt.x * Math.sin(rotY) + pt.z * Math.cos(rotY);
          const y2 = (pt.y - 25) * Math.cos(rotX) - z1 * Math.sin(rotX);
          const z2 = (pt.y - 25) * Math.sin(rotX) + z1 * Math.cos(rotX);
          const projScale = 500 / (500 + z2 * scale + 150);

          p.x = cx + x1 * scale * projScale + (p.vx * 15);
          p.y = cy + y2 * scale * projScale + (p.vy * 15);

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ----------------------------------------------------------------------
      // MODE 4: SUPERNOVA BURST (NEW VISUAL)
      // ----------------------------------------------------------------------
      else if (mode === 'supernova-burst') {
        const originX = mouse.x > 0 ? mouse.x : width / 2;
        const originY = mouse.y > 0 ? mouse.y : height / 2;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.life -= 0.6 * speedMultiplier;

          if (p.life <= 0) {
            p.x = originX + (Math.random() - 0.5) * 20;
            p.y = originY + (Math.random() - 0.5) * 20;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 12 + 2;
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
            p.life = p.maxLife;
          }

          p.vx *= 0.985;
          p.vy *= 0.985;
          p.x += p.vx;
          p.y += p.vy;

          const fade = p.life / p.maxLife;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = fade * p.baseAlpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (1 + (1 - fade) * 2), 0, Math.PI * 2);
          ctx.fill();
        }

        // Central Core Pulsar
        ctx.beginPath();
        const coreRadius = 24 + Math.sin(time * 8) * 8;
        const coreGrad = ctx.createRadialGradient(originX, originY, 0, originX, originY, coreRadius * 2);
        coreGrad.addColorStop(0, palette.highlight);
        coreGrad.addColorStop(0.4, palette.rgba(0.4));
        coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = coreGrad;
        ctx.arc(originX, originY, coreRadius * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // ----------------------------------------------------------------------
      // MODE 5: QUANTUM NEBULA
      // ----------------------------------------------------------------------
      else if (mode === 'quantum-nebula') {
        const cx = mouse.x > 0 ? mouse.x : width / 2;
        const cy = mouse.y > 0 ? mouse.y : height / 2;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.angle += p.orbitSpeed * speedMultiplier;
          const wobble = Math.sin(time * 2 + p.energy * 10) * 20;
          const r = p.orbitRadius + wobble;

          const targetX = cx + Math.cos(p.angle) * r;
          const targetY = cy + Math.sin(p.angle) * (r * 0.65);

          p.x += (targetX - p.x) * 0.08;
          p.y += (targetY - p.y) * 0.08;

          const distToCenter = Math.hypot(p.x - cx, p.y - cy);
          const glowAlpha = Math.max(0.1, 1 - distToCenter / (width * 0.5)) * p.baseAlpha;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = glowAlpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (1 + p.energy), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ----------------------------------------------------------------------
      // MODE 6: GRAVITATIONAL LENS
      // ----------------------------------------------------------------------
      else if (mode === 'gravitational-lens') {
        const lensX = mouse.x > 0 ? mouse.x : width / 2;
        const lensY = mouse.y > 0 ? mouse.y : height / 2;
        const einsteinRadius = 140;

        ctx.lineWidth = 1;
        for (let ring = 1; ring <= 3; ring++) {
          ctx.strokeStyle = palette.rgba(0.25 / ring);
          ctx.beginPath();
          ctx.arc(lensX, lensY, einsteinRadius * (ring * 0.5), 0, Math.PI * 2);
          ctx.stroke();
        }

        const grad = ctx.createRadialGradient(lensX, lensY, 5, lensX, lensY, einsteinRadius * 1.5);
        grad.addColorStop(0, '#000000');
        grad.addColorStop(0.5, 'rgba(0,0,0,0.85)');
        grad.addColorStop(0.8, palette.rgba(0.15));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(lensX, lensY, einsteinRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.ox += p.vx * speedMultiplier;
          p.oy += p.vy * speedMultiplier;

          if (p.ox < 0) p.ox = width;
          if (p.ox > width) p.ox = 0;
          if (p.oy < 0) p.oy = height;
          if (p.oy > height) p.oy = 0;

          const dx = p.ox - lensX;
          const dy = p.oy - lensY;
          const dist = Math.hypot(dx, dy);

          if (dist > 5) {
            const deflection = (einsteinRadius * einsteinRadius) / dist;
            p.x = p.ox + (dx / dist) * deflection;
            p.y = p.oy + (dy / dist) * deflection;
          } else {
            p.x = p.ox;
            p.y = p.oy;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ----------------------------------------------------------------------
      // MODE 7: ELASTIC LATTICE
      // ----------------------------------------------------------------------
      else if (mode === 'elastic-lattice') {
        const k = elasticity * 0.14;
        const damping = 0.88;

        for (let i = 0; i < meshPoints.length; i++) {
          const pt = meshPoints[i];
          const fOx = (pt.ox - pt.x) * k;
          const fOy = (pt.oy - pt.y) * k;

          pt.vx += fOx;
          pt.vy += fOy;

          const dx = mouse.x - pt.x;
          const dy = mouse.y - pt.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = mouse.isDown ? 260 : 160;

          if (dist < maxDist && dist > 0) {
            const factor = Math.pow(1 - dist / maxDist, 2);
            if (interactionType === 'repel') {
              pt.vx -= (dx / dist) * factor * 16;
              pt.vy -= (dy / dist) * factor * 16;
            } else if (interactionType === 'attract') {
              pt.vx += (dx / dist) * factor * 14;
              pt.vy += (dy / dist) * factor * 14;
            } else if (interactionType === 'vortex') {
              pt.vx += (-dy / dist) * factor * 18;
              pt.vy += (dx / dist) * factor * 18;
            } else if (interactionType === 'pulse') {
              const pulse = Math.sin(time * 5 - dist * 0.05) * 12;
              pt.vx += (dx / dist) * factor * pulse;
              pt.vy += (dy / dist) * factor * pulse;
            }

            if (mouse.clickImpulse > 0) {
              pt.vx -= (dx / dist) * mouse.clickImpulse * 1.8;
              pt.vy -= (dy / dist) * mouse.clickImpulse * 1.8;
            }
          }

          pt.vx *= damping;
          pt.vy *= damping;
          pt.x += pt.vx;
          pt.y += pt.vy;
        }

        ctx.lineWidth = 0.8;
        for (let r = 0; r <= rows; r++) {
          for (let c = 0; c <= cols; c++) {
            const idx = r * (cols + 1) + c;
            const pt = meshPoints[idx];
            if (!pt) continue;

            if (c < cols) {
              const rightPt = meshPoints[idx + 1];
              const disp = Math.hypot(pt.x - pt.ox, pt.y - pt.oy);
              const alpha = Math.min(0.85, 0.07 + disp * 0.035);
              ctx.strokeStyle = palette.rgba(alpha);
              ctx.beginPath();
              ctx.moveTo(pt.x, pt.y);
              ctx.lineTo(rightPt.x, rightPt.y);
              ctx.stroke();
            }

            if (r < rows) {
              const bottomPt = meshPoints[idx + (cols + 1)];
              const disp = Math.hypot(pt.x - pt.ox, pt.y - pt.oy);
              const alpha = Math.min(0.85, 0.07 + disp * 0.035);
              ctx.strokeStyle = palette.rgba(alpha);
              ctx.beginPath();
              ctx.moveTo(pt.x, pt.y);
              ctx.lineTo(bottomPt.x, bottomPt.y);
              ctx.stroke();
            }

            ctx.fillStyle = palette.highlight;
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // ----------------------------------------------------------------------
      // MODE 8: 3D GEOMETRIC POLYTOPE
      // ----------------------------------------------------------------------
      else if (mode === 'geometric-polytope') {
        rotX += (targetRotX - rotX) * 0.05 + 0.006 * speedMultiplier;
        rotY += (targetRotY - rotY) * 0.05 + 0.009 * speedMultiplier;
        rotZ += 0.003 * speedMultiplier;

        const centerX = width / 2;
        const centerY = height / 2;
        const scale = Math.min(width, height) * 0.32;

        const projected = polytopeVertices.map((v) => {
          let x1 = v.x * Math.cos(rotY) - v.z * Math.sin(rotY);
          let z1 = v.x * Math.sin(rotY) + v.z * Math.cos(rotY);

          let y2 = v.y * Math.cos(rotX) - z1 * Math.sin(rotX);
          let z2 = v.y * Math.sin(rotX) + z1 * Math.cos(rotX);

          let x3 = x1 * Math.cos(rotZ) - y2 * Math.sin(rotZ);
          let y3 = x1 * Math.sin(rotZ) + y2 * Math.cos(rotZ);

          const fov = 480;
          const projScale = fov / (fov + z2 + 220);

          let screenX = centerX + x3 * projScale * (scale / 100);
          let screenY = centerY + y3 * projScale * (scale / 100);

          return { x: screenX, y: screenY, z: z2, scale: projScale };
        });

        for (let i = 0; i < projected.length; i++) {
          for (let j = i + 1; j < projected.length; j++) {
            const p1 = projected[i];
            const p2 = projected[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

            if (dist < scale * 1.6) {
              const depthAlpha = ((p1.z + p2.z) / 450 + 0.65) * 0.4;
              ctx.strokeStyle = palette.rgba(Math.max(0.06, Math.min(0.85, depthAlpha)));
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        for (const pt of projected) {
          ctx.fillStyle = palette.highlight;
          ctx.globalAlpha = Math.max(0.25, Math.min(0.95, (pt.z + 220) / 440));
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3.2 * pt.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ----------------------------------------------------------------------
      // MODE 9: KINETIC CONSTELLATION
      // ----------------------------------------------------------------------
      else if (mode === 'kinetic-constellation') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx * speedMultiplier;
          p.y += p.vy * speedMultiplier;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = 220;

          if (dist < maxDist && dist > 0) {
            const factor = (1 - dist / maxDist) * 3.5;
            if (interactionType === 'repel') {
              p.x -= (dx / dist) * factor;
              p.y -= (dy / dist) * factor;
            } else if (interactionType === 'attract') {
              p.x += (dx / dist) * factor;
              p.y += (dy / dist) * factor;
            }
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 1.2, 0, Math.PI * 2);
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const cDist = Math.hypot(p.x - p2.x, p.y - p2.y);
            const maxConnect = 140;

            if (cDist < maxConnect) {
              const alpha = (1 - cDist / maxConnect) * 0.28;
              ctx.strokeStyle = palette.rgba(alpha);
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // ----------------------------------------------------------------------
      // MODE 10: WAVE DISTORTION
      // ----------------------------------------------------------------------
      else if (mode === 'wave-distortion') {
        const lineCount = 42;
        const lineSpacing = height / lineCount;
        ctx.lineWidth = 1.1;

        for (let l = 0; l < lineCount; l++) {
          const baseY = l * lineSpacing + lineSpacing / 2;
          ctx.beginPath();
          const lineAlpha = 0.08 + (l % 4 === 0 ? 0.16 : 0.04);
          ctx.strokeStyle = palette.rgba(lineAlpha);

          for (let x = 0; x <= width; x += 14) {
            const wave1 = Math.sin(x * 0.005 + time * 1.6 + l * 0.22) * 20;
            const wave2 = Math.cos(x * 0.013 - time * 0.9 + l * 0.3) * 10;

            let myOffset = 0;
            const dx = mouse.x - x;
            const dy = mouse.y - baseY;
            const dist = Math.hypot(dx, dy);
            if (dist < 240 && dist > 0) {
              const factor = Math.cos((dist / 240) * Math.PI * 0.5);
              myOffset = (interactionType === 'repel' ? 1 : -1) * factor * 60;
            }

            const finalY = baseY + wave1 + wave2 + myOffset;
            if (x === 0) ctx.moveTo(x, finalY);
            else ctx.lineTo(x, finalY);
          }
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [mode, interactionType, particleDensity, speedMultiplier, elasticity, colorTheme, showTrails]);

  return (
    <canvas
      ref={canvasRef}
      id="master-visual-canvas"
      className="fixed inset-0 w-full h-full cursor-crosshair z-0 select-none block"
      style={{ touchAction: 'none' }}
    />
  );
};
