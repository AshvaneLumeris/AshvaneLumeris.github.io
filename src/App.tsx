/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VisualCanvas, VisualMode, MouseInteractionType, ColorTheme } from './components/VisualCanvas';
import { KineticTypography } from './components/KineticTypography';
import { InteractiveHUD } from './components/InteractiveHUD';
import { CustomCursor } from './components/CustomCursor';
import { sound } from './utils/sound';

export default function App() {
  const [mode, setMode] = useState<VisualMode>('fluid-vortex');
  const [interactionType, setInteractionType] = useState<MouseInteractionType>('repel');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('titanium');
  const [showTrails, setShowTrails] = useState(false);
  const [particleDensity, setParticleDensity] = useState(1.0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [elasticity, setElasticity] = useState(0.8);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [zenMode, setZenMode] = useState(false);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#09090b] text-[#f4f4f5] font-sans select-none flex items-center justify-center">
      {/* Precision Custom Cursor */}
      <CustomCursor />

      {/* Real-time Hardware Accelerated Visual Simulation Canvas */}
      <VisualCanvas
        mode={mode}
        interactionType={interactionType}
        particleDensity={particleDensity}
        speedMultiplier={speedMultiplier}
        elasticity={elasticity}
        colorTheme={colorTheme}
        showTrails={showTrails}
      />

      {/* Kinetic Typography Layer with Custom Geometric Icon / Logo */}
      <div className="relative z-10 w-full flex items-center justify-center pointer-events-none">
        <KineticTypography colorTheme={colorTheme} />
      </div>

      {/* Minimal Floating HUD Controller */}
      <InteractiveHUD
        mode={mode}
        onSetMode={setMode}
        interactionType={interactionType}
        onSetInteractionType={setInteractionType}
        particleDensity={particleDensity}
        onSetParticleDensity={setParticleDensity}
        speedMultiplier={speedMultiplier}
        onSetSpeedMultiplier={setSpeedMultiplier}
        elasticity={elasticity}
        onSetElasticity={setElasticity}
        colorTheme={colorTheme}
        onSetColorTheme={setColorTheme}
        showTrails={showTrails}
        onToggleTrails={() => setShowTrails(!showTrails)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        zenMode={zenMode}
        onToggleZenMode={() => setZenMode(!zenMode)}
      />
    </div>
  );
}
