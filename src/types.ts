export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'WebGL & Graphics' | 'Kinetic UI' | 'Systems & Tools' | 'Audio DSP';
  year: string;
  featured: boolean;
  metrics: {
    fps: string;
    bundleSize: string;
    latency: string;
  };
  description: string;
  techStack: string[];
  githubUrl: string;
  demoUrl: string;
  highlights: string[];
  codeSnippet: string;
  previewType: 'particles' | 'waveform' | 'mesh' | 'typography';
}

export interface Experiment {
  id: string;
  title: string;
  category: string;
  description: string;
  interactiveControls: string[];
}

export interface SystemSpec {
  metric: string;
  value: string;
  subtext: string;
}

export interface TerminalCommand {
  command: string;
  description: string;
}
