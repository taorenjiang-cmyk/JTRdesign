export type PosterRatio = 'portrait' | 'square' | 'landscape';

export interface PosterSize {
  width: number;
  height: number;
}

export interface PosterSettings {
  ratio: PosterRatio;
  background: string;
  shapeCount: number;
  softness: number;
  shapeRandomness: number;
  lineCount: number;
  lineWidth: number;
  lineColor: string;
  lineOpacity: number;
  lineAngleJitter: number;
  tensionStrength: number;
  title: string;
  subtitle: string;
  year: string;
  cnTitle: string;
  textColor: string;
  seed: number;
}

export interface SoftShape {
  x: number;
  y: number;
  w: number;
  h: number;
  radius: number;
  wobble: number;
}

export interface TensionLine {
  x: number;
  y: number;
  length: number;
  angle: number;
}

export interface TextBlock {
  content: string;
  x: number;
  y: number;
  size: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  weight: number;
  letterSpacing: number;
}

export interface PosterLayout {
  size: PosterSize;
  shapes: SoftShape[];
  lines: TensionLine[];
  texts: TextBlock[];
}
