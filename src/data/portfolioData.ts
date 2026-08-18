import { Project, Experiment, SystemSpec } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'chronos-gl',
    title: 'Chronos WebGL',
    tagline: 'GPGPU Time-Series Particle & Vector Field Engine',
    category: 'WebGL & Graphics',
    year: '2026',
    featured: true,
    metrics: {
      fps: '60 FPS @ 500k particles',
      bundleSize: '14.2 KB (brotli)',
      latency: '< 1.2ms compute',
    },
    description:
      'A zero-dependency GPGPU simulation engine that simulates millions of kinetic fluid particles on the GPU using ping-pong framebuffers, compute textures, and custom fragment shaders.',
    techStack: ['WebGL 2.0', 'GLSL', 'TypeScript', 'Eulerian Grid Solvers', 'Vite'],
    githubUrl: 'https://github.com/ashvanelumeris/chronos-webgl',
    demoUrl: 'https://ashvanelumeris.github.io/chronos-webgl',
    highlights: [
      'Dual-pass ping-pong FBOs for real-time velocity advection and pressure projection',
      'Adaptive sub-stepping preserving numerical stability during rapid mouse cursor bursts',
      'Dynamic LOD downsampling for low-power mobile GPUs',
      'Zero garbage-collection allocations inside the core render loop'
    ],
    codeSnippet: `// GPGPU Ping-Pong Advection Shader Pass
#version 300 es
precision highp float;

uniform sampler2D u_velocityTexture;
 uniform vec2 u_resolution;
uniform float u_deltaTime;
uniform float u_viscosity;

out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 vel = texture(u_velocityTexture, uv).xy;
  vec2 traceBack = uv - vel * (u_deltaTime / u_resolution);
  vec2 advectedVel = texture(u_velocityTexture, traceBack).xy;
  
  // Dissipation and vorticity confinement
  fragColor = vec4(advectedVel * (1.0 - u_viscosity * u_deltaTime), 0.0, 1.0);
}`,
    previewType: 'particles',
  },
  {
    id: 'aetheria-motion',
    title: 'Aetheria Kinetic UI',
    tagline: 'Spring Physics & Layout-Preserving Animation Primitives',
    category: 'Kinetic UI',
    year: '2026',
    featured: true,
    metrics: {
      fps: '120 Hz ProMotion Sync',
      bundleSize: '8.7 KB gzipped',
      latency: '0 layout thrashing',
    },
    description:
      'A micro-library of layout-preserving physics primitives. Seamlessly reconciles FLIP (First, Last, Invert, Play) transformations with non-linear spring dynamics and magnetic pointer tracking.',
    techStack: ['TypeScript', 'Web Animations API', 'Matrix Transforms', 'RAF Scheduler'],
    githubUrl: 'https://github.com/ashvanelumeris/aetheria-motion',
    demoUrl: 'https://ashvanelumeris.github.io/aetheria-motion',
    highlights: [
      'Automatic transform matrix decomposition without triggering layout recalculations',
      'Hardware-accelerated compositor thread offloading',
      'Continuous velocity retention through interruptible user drags',
      'Fluid cursor magnetic snapping and spring damping'
    ],
    codeSnippet: `// Micro-Spring Solver with Damping Ratio
export class SpringSystem {
  private pos = 0;
  private vel = 0;
  constructor(public stiffness = 170, public damping = 26, public mass = 1) {}

  update(target: number, dt: number): number {
    const force = -this.stiffness * (this.pos - target);
    const dampingForce = -this.damping * this.vel;
    const accel = (force + dampingForce) / this.mass;
    this.vel += accel * dt;
    this.pos += this.vel * dt;
    return this.pos;
  }
}`,
    previewType: 'mesh',
  },
  {
    id: 'lumeris-dsp',
    title: 'Neuralis Audio DSP',
    tagline: 'Browser-Based Spectral Phase Vocoder & Tactile Synth',
    category: 'Audio DSP',
    year: '2025',
    featured: true,
    metrics: {
      fps: '60 FPS Spectrogram',
      bundleSize: '18.4 KB',
      latency: '< 5.8ms buffer',
    },
    description:
      'Real-time frequency-domain audio synthesizer and micro-acoustics generator. Features custom AudioWorklet nodes for granular time-stretching without pitch modulation.',
    techStack: ['Web Audio API', 'AudioWorklet', 'FFT (Fast Fourier Transform)', 'Canvas 2D'],
    githubUrl: 'https://github.com/ashvanelumeris/neuralis-dsp',
    demoUrl: 'https://ashvanelumeris.github.io/neuralis-dsp',
    highlights: [
      'Zero main-thread blocking via dedicated AudioWorklet DSP processor',
      'Real-time 2048-point Fast Fourier Transform visualizer with linear & bark frequency scales',
      'Procedural parametric acoustics for haptic UI confirmation feedback',
      'Biquad resonant filter sweep responsive to pointer elevation'
    ],
    codeSnippet: `// AudioWorklet Processor for Phase Vocoder Granulator
class GranularProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const channel = output[0];
    for (let i = 0; i < channel.length; ++i) {
      // Synthesize grain envelope with Tukey window
      channel[i] = this.synthesizeGrainSample();
    }
    return true;
  }
}
registerProcessor('granular-dsp', GranularProcessor);`,
    previewType: 'waveform',
  },
  {
    id: 'syllable-typo',
    title: 'Syllable Kinetic Typo',
    tagline: 'Variable Font Deformation & Kinetic Text Pipeline',
    category: 'Systems & Tools',
    year: '2025',
    featured: false,
    metrics: {
      fps: '60 FPS continuous',
      bundleSize: '6.1 KB',
      latency: 'Zero render delay',
    },
    description:
      'High-dynamic-range typography engine that modulates variable font axes (wght, wdth, slnt, opsz) based on distance fields, cursor acceleration vectors, and acoustic RMS.',
    techStack: ['Variable OpenType', 'CSS Font Variation Settings', 'Vector Math', 'IntersectionObserver'],
    githubUrl: 'https://github.com/ashvanelumeris/syllable-typo',
    demoUrl: 'https://ashvanelumeris.github.io/syllable-typo',
    highlights: [
      'Real-time Euclidean distance field matrix mapping to variable font axes',
      'Bézier curve interpolation between typographic states',
      'Per-glyph kinetic stagger offsets',
      'Sub-pixel anti-aliasing optimization for high-density OLED displays'
    ],
    codeSnippet: `// Dynamic Variable Font Axis Modulator
const calculateFontAxis = (glyphPos: { x: number; y: number }, cursor: { x: number; y: number }) => {
  const dx = cursor.x - glyphPos.x;
  const dy = cursor.y - glyphPos.y;
  const distance = Math.hypot(dx, dy);
  const proximity = Math.max(0, 1 - distance / 320);
  
  const wght = 300 + Math.round(proximity * 600); // 300 -> 900
  const wdth = 75 + Math.round(proximity * 50);   // 75% -> 125%
  return \`"wght" \${wght}, "wdth" \${wdth}\`;
};`,
    previewType: 'typography',
  },
  {
    id: 'voronoi-spatial',
    title: 'Voronoi Spatial Partitioner',
    tagline: 'Delaunay Triangulation & Multi-Threaded Grid Indexer',
    category: 'Systems & Tools',
    year: '2025',
    featured: false,
    metrics: {
      fps: '144 FPS rendering',
      bundleSize: '9.3 KB',
      latency: '< 0.8ms query',
    },
    description:
      'Computational geometry pipeline implementing Bowyer-Watson triangulation and Fortune’s sweep-line algorithm in WebAssembly for high-throughput spatial querying.',
    techStack: ['WebAssembly / Rust', 'TypeScript', 'SIMD', 'HTML5 Canvas'],
    githubUrl: 'https://github.com/ashvanelumeris/voronoi-spatial',
    demoUrl: 'https://ashvanelumeris.github.io/voronoi-spatial',
    highlights: [
      'Sub-millisecond Voronoi cell relaxes with Lloyd iterations',
      'Dual Delaunay-Voronoi mesh generation in parallel WebWorkers',
      'Interactive point perturbation with elastic damping'
    ],
    codeSnippet: `// Delaunay Triangulation Circumcircle Test
function inCircle(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, px: number, py: number): boolean {
  const dx = ax - px; const dy = ay - py;
  const ex = bx - px; const ey = by - py;
  const fx = cx - px; const fy = cy - py;
  return (dx*dx + dy*dy) * (ex*fy - ey*fx) -
         (ex*ex + ey*ey) * (dx*fy - dy*fx) +
         (fx*fx + fy*fy) * (dx*ey - dy*ex) > 0;
}`,
    previewType: 'mesh',
  },
];

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'vortex-particles',
    title: 'Vector Field Particles',
    category: 'Fluid Mechanics',
    description: 'Dynamic particle swarm guided by curl noise vector fields and cursor gravity wells.',
    interactiveControls: ['Particles Count', 'Viscosity', 'Vortex Force', 'Color Temperature'],
  },
  {
    id: 'spring-mesh',
    title: 'Elastic Spring Topology',
    category: 'Deformable Physics',
    description: 'Interactive point mass lattice connected by Hooke-law damped spring constraints.',
    interactiveControls: ['Lattice Tension', 'Damping Factor', 'Pluck Impulse', 'Wireframe Mode'],
  },
  {
    id: 'kinetic-typography',
    title: 'Variable Font Warp',
    category: 'Kinetic Type',
    description: 'Variable typography modulated by cursor proximity, optical size, and glyph elastic drift.',
    interactiveControls: ['Axis Weight', 'Tracking Expansion', 'Stagger Offset', 'Optical Size'],
  },
  {
    id: 'audio-spectrogram',
    title: 'Harmonic Synthesizer',
    category: 'Acoustic DSP',
    description: 'Direct frequency synthesis with real-time waveform phase rendering and harmonics control.',
    interactiveControls: ['Fundamental Freq', 'Harmonic Spread', 'Gain Envelope', 'Oscilloscope'],
  },
];

export const SYSTEM_SPECS: SystemSpec[] = [
  {
    metric: '60 - 120 FPS',
    value: 'Deterministic Render Cycle',
    subtext: 'Hardware compositor acceleration with zero garbage collector interruptions.',
  },
  {
    metric: '< 15 KB',
    value: 'Ultra-Lean Micro-Bundles',
    subtext: 'Modular tree-shakeable architecture without bloated UI framework ballast.',
  },
  {
    metric: '0 Layout Thrashing',
    value: 'Transform-Only Matrix Animation',
    subtext: 'GPU-backed translations and CSS will-change optimizations for silky continuous motion.',
  },
  {
    metric: '100% Procedural',
    value: 'Zero Heavy Media Assets',
    subtext: 'Micro-acoustics synthesized via Web Audio and vector visuals computed in Canvas 2D / WebGL.',
  },
];

export const SKILL_MATRIX = [
  { category: 'Creative & Graphics', skills: ['WebGL 2.0 / GLSL', 'Canvas 2D Optimization', 'Three.js / React Three Fiber', 'Shader Math & Raymarching', 'GPGPU Particles', 'Generative Geometry'] },
  { category: 'Kinetic & Interaction', skills: ['Framer Motion / Motion One', 'Spring Dynamics & Euler Solvers', 'FLIP Layout Transitions', 'Gesture Recognition', 'Web Animations API', 'Variable OpenType'] },
  { category: 'Architecture & Performance', skills: ['TypeScript Strict Typings', 'Web Workers / Comlink', 'Web Audio API / AudioWorklet', 'Vite & Custom Rollup Plugins', 'WebAssembly (Rust/C++)', 'Core Web Vitals 100/100'] },
];

export const TERMINAL_COMMANDS = [
  { command: 'help', description: 'List all available terminal commands' },
  { command: 'about', description: 'Display Ashvane Lumeris profile and philosophy' },
  { command: 'projects', description: 'List flagship engineering projects with links' },
  { command: 'experiments', description: 'Show interactive kinetic experiments' },
  { command: 'stack', description: 'Inspect tech stack and engineering competencies' },
  { command: 'contact', description: 'Print email, GitHub, and secure contact channels' },
  { command: 'cat resume', description: 'Display ASCII resume summary' },
  { command: 'fps', description: 'Toggle real-time performance telemetry' },
  { command: 'audio', description: 'Toggle procedural micro-acoustics audio engine' },
  { command: 'clear', description: 'Clear the terminal output screen' },
];
