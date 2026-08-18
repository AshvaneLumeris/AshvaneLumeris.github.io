import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sliders,
  Volume2,
  VolumeX,
  Sparkles,
  Grid,
  Box,
  Share2,
  Waves,
  Magnet,
  Zap,
  RotateCcw,
  Eye,
  EyeOff,
  Radio,
  Orbit,
  Disc3,
  Sun,
  Flame,
  Infinity as InfinityIcon,
  Github,
} from 'lucide-react';
import { VisualMode, MouseInteractionType, ColorTheme } from './VisualCanvas';
import { sound } from '../utils/sound';

interface InteractiveHUDProps {
  mode: VisualMode;
  onSetMode: (mode: VisualMode) => void;
  interactionType: MouseInteractionType;
  onSetInteractionType: (type: MouseInteractionType) => void;
  particleDensity: number;
  onSetParticleDensity: (val: number) => void;
  speedMultiplier: number;
  onSetSpeedMultiplier: (val: number) => void;
  elasticity: number;
  onSetElasticity: (val: number) => void;
  colorTheme: ColorTheme;
  onSetColorTheme: (theme: ColorTheme) => void;
  showTrails: boolean;
  onToggleTrails: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  zenMode: boolean;
  onToggleZenMode: () => void;
}

const MODES: { id: VisualMode; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'fluid-vortex', label: 'Vortex Fluid', icon: <Sparkles className="w-3.5 h-3.5" />, desc: 'Curl noise vector field' },
  { id: 'solar-magnetosphere', label: 'Magnetosphere', icon: <Sun className="w-3.5 h-3.5" />, desc: 'Dipole magnetic plasma filaments' },
  { id: 'chaotic-attractor', label: 'Lorenz Attractor', icon: <InfinityIcon className="w-3.5 h-3.5" />, desc: 'Phase-space chaotic strange attractor' },
  { id: 'supernova-burst', label: 'Supernova Burst', icon: <Flame className="w-3.5 h-3.5" />, desc: 'Relativistic kinetic particle burst' },
  { id: 'quantum-nebula', label: 'Quantum Nebula', icon: <Orbit className="w-3.5 h-3.5" />, desc: 'Orbital celestial swarm' },
  { id: 'gravitational-lens', label: 'Black Hole Lens', icon: <Disc3 className="w-3.5 h-3.5" />, desc: 'Spacetime curvature deflection' },
  { id: 'elastic-lattice', label: 'Elastic Lattice', icon: <Grid className="w-3.5 h-3.5" />, desc: 'Hooke spring mesh grid' },
  { id: 'geometric-polytope', label: '3D Hyper-Cage', icon: <Box className="w-3.5 h-3.5" />, desc: '3D Matrix perspective cage' },
  { id: 'kinetic-constellation', label: 'Constellation', icon: <Share2 className="w-3.5 h-3.5" />, desc: 'Distance node graph' },
  { id: 'wave-distortion', label: 'Wave Matrix', icon: <Waves className="w-3.5 h-3.5" />, desc: 'Interference waveforms' },
];

const INTERACTIONS: { id: MouseInteractionType; label: string; icon: React.ReactNode }[] = [
  { id: 'repel', label: 'Repel', icon: <Zap className="w-3.5 h-3.5" /> },
  { id: 'attract', label: 'Attract', icon: <Magnet className="w-3.5 h-3.5" /> },
  { id: 'vortex', label: 'Swirl', icon: <RotateCcw className="w-3.5 h-3.5" /> },
  { id: 'pulse', label: 'Pulse', icon: <Radio className="w-3.5 h-3.5" /> },
  { id: 'warp', label: 'Warp', icon: <Waves className="w-3.5 h-3.5" /> },
];

const THEMES: { id: ColorTheme; label: string; preview: string }[] = [
  { id: 'titanium', label: 'Titanium', preview: 'bg-zinc-200' },
  { id: 'amber-gold', label: 'Amber Gold', preview: 'bg-amber-400' },
  { id: 'cyber-cyan', label: 'Cyber Cyan', preview: 'bg-sky-400' },
  { id: 'aurora-violet', label: 'Aurora Violet', preview: 'bg-purple-400' },
  { id: 'monochrome', label: 'Monochrome', preview: 'bg-zinc-500' },
];

export const InteractiveHUD: React.FC<InteractiveHUDProps> = ({
  mode,
  onSetMode,
  interactionType,
  onSetInteractionType,
  particleDensity,
  onSetParticleDensity,
  speedMultiplier,
  onSetSpeedMultiplier,
  elasticity,
  onSetElasticity,
  colorTheme,
  onSetColorTheme,
  showTrails,
  onToggleTrails,
  soundEnabled,
  onToggleSound,
  zenMode,
  onToggleZenMode,
}) => {
  const [controlsOpen, setControlsOpen] = useState(false);

  // Dynamic Theme Stroke for Header Icon
  const getThemeColor = () => {
    switch (colorTheme) {
      case 'amber-gold':
        return '#fbbf24';
      case 'cyber-cyan':
        return '#38bdf8';
      case 'aurora-violet':
        return '#c084fc';
      case 'monochrome':
        return '#a1a1aa';
      default:
        return '#ffffff';
    }
  };

  return (
    <>
      {/* Floating Zen Mode, Sound Controls & GitHub Dev Link (top-right) */}
      <div className="fixed top-5 right-5 z-40 flex items-center gap-2">
        <a
          id="hud-github-dev-link"
          href="https://github.com/AshvaneLumeris"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors backdrop-blur-md flex items-center justify-center group"
          title="GitHub: Ashvane Lumeris (Developer)"
          aria-label="GitHub Profile"
        >
          <Github className="w-4 h-4 transition-transform group-hover:scale-110" />
        </a>

        <button
          id="hud-sound-toggle-btn"
          onClick={() => {
            onToggleSound();
            sound.playClick();
          }}
          className="p-2.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors backdrop-blur-md"
          title={soundEnabled ? 'Mute Audio Feedback' : 'Unmute Audio Feedback'}
          aria-label="Toggle Audio"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
        </button>

        <button
          id="hud-zen-toggle-btn"
          onClick={() => {
            onToggleZenMode();
            sound.playClick();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors backdrop-blur-md"
          title={zenMode ? 'Exit Zen Mode (Show Controls)' : 'Enter Zen Mode (Full Screen Visual)'}
        >
          {zenMode ? <Eye className="w-3.5 h-3.5 text-zinc-400" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-400" />}
          <span>{zenMode ? 'SHOW UI' : 'ZEN MODE'}</span>
        </button>
      </div>

      {/* Top Left Persistent Header Badge with Visual Icon / Logo beside ASHVANE LUMERIS */}
      <div className="fixed top-5 left-5 z-40 flex items-center gap-3">
        <a
          href="https://github.com/AshvaneLumeris"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-md shadow-lg group select-none hover:border-zinc-700 transition-colors cursor-pointer"
          title="Ashvane Lumeris — Developer GitHub"
        >
          {/* Detailed Geometric Logo / Emblem beside header */}
          <svg
            className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Diamond */}
            <polygon
              points="50,6 94,50 50,94 6,50"
              stroke={getThemeColor()}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* Inner Core */}
            <polygon
              points="50,26 74,50 50,74 26,50"
              stroke={getThemeColor()}
              strokeWidth="4"
              strokeDasharray="5 5"
            />
            {/* Singularity Center */}
            <circle cx="50" cy="50" r="7" fill={getThemeColor()} />
          </svg>

          <span className="text-xs font-mono font-bold text-zinc-100 tracking-wider">
            ASHVANE LUMERIS
          </span>
          <span className="text-[10px] font-mono text-zinc-500 border-l border-zinc-800 pl-2">
            v1.0
          </span>
        </a>
      </div>

      {/* Main Bottom Visual HUD Controller */}
      <AnimatePresence>
        {!zenMode && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-4xl"
          >
            <div className="rounded-2xl bg-zinc-950/90 border border-zinc-800/90 shadow-2xl backdrop-blur-xl p-3 text-zinc-200">
              {/* Primary Mode Switcher Ribbon with 10 visual engines */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                {MODES.map((m) => {
                  const isActive = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      id={`hud-mode-${m.id}`}
                      onClick={() => {
                        onSetMode(m.id);
                        sound.playClick();
                      }}
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80'
                      }`}
                    >
                      {m.icon}
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-bar: Physics Interaction Types, Themes, & Expandable Physics Tweaks */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/80 text-[11px] font-mono gap-2 flex-wrap sm:flex-nowrap">
                {/* Cursor Interactions */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                  <span className="text-zinc-500 uppercase tracking-wider text-[9px] mr-1 hidden sm:inline">
                    Cursor:
                  </span>
                  {INTERACTIONS.map((inter) => {
                    const active = interactionType === inter.id;
                    return (
                      <button
                        key={inter.id}
                        id={`hud-inter-${inter.id}`}
                        onClick={() => {
                          onSetInteractionType(inter.id);
                          sound.playClick();
                        }}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
                          active
                            ? 'bg-zinc-800 text-white border border-zinc-700'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                        }`}
                      >
                        {inter.icon}
                        <span>{inter.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Theme Selector & Physics Expander */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-zinc-900/90 px-2 py-1 rounded-lg border border-zinc-800">
                    {THEMES.map((th) => (
                      <button
                        key={th.id}
                        onClick={() => {
                          onSetColorTheme(th.id);
                          sound.playClick();
                        }}
                        title={th.label}
                        className={`w-3.5 h-3.5 rounded-full ${th.preview} transition-transform ${
                          colorTheme === th.id ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    id="hud-params-toggle-btn"
                    onClick={() => setControlsOpen(!controlsOpen)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                      controlsOpen
                        ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Physics</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Parameter Adjustment Tray */}
              <AnimatePresence>
                {controlsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-zinc-800/80 mt-2.5 pt-2.5 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono"
                  >
                    <div>
                      <div className="flex justify-between text-zinc-400 mb-1 text-[10px]">
                        <span>DENSITY</span>
                        <span>{particleDensity.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.1"
                        value={particleDensity}
                        onChange={(e) => onSetParticleDensity(parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-200"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-zinc-400 mb-1 text-[10px]">
                        <span>VELOCITY</span>
                        <span>{speedMultiplier.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.4"
                        max="2.5"
                        step="0.1"
                        value={speedMultiplier}
                        onChange={(e) => onSetSpeedMultiplier(parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-200"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-zinc-400 mb-1 text-[10px]">
                        <span>SPRING TENSION</span>
                        <span>{elasticity.toFixed(1)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="1.5"
                        step="0.1"
                        value={elasticity}
                        onChange={(e) => onSetElasticity(parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-200"
                      />
                    </div>

                    <div className="flex items-center justify-between sm:justify-center">
                      <button
                        onClick={onToggleTrails}
                        className={`px-3 py-1.5 rounded-lg border text-[11px] transition-colors w-full ${
                          showTrails
                            ? 'bg-zinc-800 border-zinc-600 text-white'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {showTrails ? 'Trails: ON' : 'Trails: OFF'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
