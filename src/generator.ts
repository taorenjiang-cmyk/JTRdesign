import type { PosterLayout, PosterRatio, PosterSettings, PosterSize, SoftShape, TensionLine, TextBlock } from './types';

const ratioMap: Record<PosterRatio, PosterSize> = {
  portrait: { width: 900, height: 1300 },
  square: { width: 1080, height: 1080 },
  landscape: { width: 1300, height: 900 },
};

const rng = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let n = Math.imul(t ^ (t >>> 15), 1 | t);
    n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
};

export function buildLayout(settings: PosterSettings): PosterLayout {
  const size = ratioMap[settings.ratio];
  const random = rng(settings.seed);

  const grid = Math.ceil(Math.sqrt(settings.shapeCount));
  const cellW = size.width / grid;
  const cellH = size.height / grid;

  const shapes: SoftShape[] = Array.from({ length: settings.shapeCount }, (_, i) => {
    const gx = i % grid;
    const gy = Math.floor(i / grid);
    const jitter = settings.shapeRandomness;
    const w = cellW * (0.45 + random() * 0.6);
    const h = cellH * (0.45 + random() * 0.6);
    return {
      x: gx * cellW + cellW * 0.2 + (random() - 0.5) * cellW * jitter,
      y: gy * cellH + cellH * 0.2 + (random() - 0.5) * cellH * jitter,
      w,
      h,
      radius: Math.min(w, h) * (0.15 + settings.softness * 0.5),
      wobble: 6 + settings.shapeRandomness * 22,
    };
  });

  const lines: TensionLine[] = Array.from({ length: settings.lineCount }, () => ({
    x: random() * size.width,
    y: random() * size.height,
    length: Math.hypot(size.width, size.height) * 1.4,
    angle: (-0.6 + random() * 1.2) + (random() - 0.5) * settings.lineAngleJitter,
  }));

  const texts = generateTextBlocks(settings, size, random);

  return { size, shapes, lines, texts };
}

function generateTextBlocks(settings: PosterSettings, size: PosterSize, random: () => number): TextBlock[] {
  const entries = [settings.title, settings.subtitle, settings.year, settings.cnTitle].filter(Boolean);
  return entries.map((content, i) => ({
    content,
    x: size.width * (0.08 + random() * 0.78),
    y: size.height * (0.1 + random() * 0.8),
    size: Math.max(20, size.width * (i === 0 ? 0.08 : 0.03 + random() * 0.02)),
    rotate: -30 + random() * 60,
    scaleX: 0.7 + random() * 0.9,
    scaleY: 0.7 + random() * 0.9,
    weight: i === 0 ? 900 : 500 + Math.floor(random() * 4) * 100,
    letterSpacing: random() * 5,
  }));
}

export const defaultSettings: PosterSettings = {
  ratio: 'portrait',
  background: '#2a2a2a',
  shapeCount: 12,
  softness: 0.65,
  shapeRandomness: 0.45,
  lineCount: 4,
  lineWidth: 16,
  lineColor: '#2740ff',
  lineOpacity: 0.85,
  lineAngleJitter: 0.45,
  tensionStrength: 0.5,
  title: 'COMPOUND',
  subtitle: 'LINE TENSION EXPERIMENT',
  year: '2026',
  cnTitle: '线性张力海报',
  textColor: '#101010',
  seed: 42,
};
