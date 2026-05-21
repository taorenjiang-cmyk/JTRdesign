import { useEffect, useRef } from 'react';
import type { PosterLayout, PosterSettings, SoftShape, TensionLine } from './types';

interface Props {
  layout: PosterLayout;
  settings: PosterSettings;
  exportSignal: number;
}

export function CanvasPreview({ layout, settings, exportSignal }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = layout.size.width;
    canvas.height = layout.size.height;

    ctx.fillStyle = settings.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    layout.shapes.forEach((shape) => drawShape(ctx, shape));
    layout.lines.forEach((line) => drawTensionLine(ctx, line, settings, false));
    layout.lines.forEach((line) => drawTensionLine(ctx, line, settings, true));

    ctx.fillStyle = settings.textColor;
    layout.texts.forEach((t) => {
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.rotate((t.rotate * Math.PI) / 180);
      ctx.scale(t.scaleX, t.scaleY);
      ctx.font = `${t.weight} ${t.size}px Inter, Arial, sans-serif`;
      ctx.letterSpacing = `${t.letterSpacing}px`;
      ctx.fillText(t.content, 0, 0);
      ctx.restore();
    });
  }, [layout, settings]);

  useEffect(() => {
    if (!exportSignal) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `line-tension-${Date.now()}.png`;
    a.click();
  }, [exportSignal]);

  return <canvas ref={canvasRef} className="poster-canvas" />;
}

function drawShape(ctx: CanvasRenderingContext2D, shape: SoftShape) {
  const { x, y, w, h, radius, wobble } = shape;
  const cx = x + w / 2;
  const cy = y + h / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  const points = 16;
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * Math.PI * 2;
    const rx = w / 2 + Math.sin(t * 3.2) * wobble;
    const ry = h / 2 + Math.cos(t * 2.8) * wobble;
    const px = Math.cos(t) * Math.max(radius, rx * 0.7);
    const py = Math.sin(t) * Math.max(radius, ry * 0.7);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = '#f7f7f7';
  ctx.fill();
  ctx.restore();
}

function drawTensionLine(ctx: CanvasRenderingContext2D, line: TensionLine, settings: PosterSettings, highlight: boolean) {
  ctx.save();
  ctx.translate(line.x, line.y);
  ctx.rotate(line.angle);
  ctx.globalAlpha = highlight ? 0.18 : settings.lineOpacity;
  ctx.strokeStyle = highlight ? '#ffffff' : settings.lineColor;
  ctx.lineWidth = highlight ? settings.lineWidth * (settings.tensionStrength * 1.8) : settings.lineWidth;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-line.length / 2, 0);
  ctx.lineTo(line.length / 2, 0);
  ctx.stroke();

  if (!highlight) {
    // 创建“勒痕”视觉：在线条附近做透明压痕
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 0.08 + settings.tensionStrength * 0.2;
    ctx.lineWidth = settings.lineWidth * (1.8 + settings.tensionStrength * 1.8);
    ctx.beginPath();
    ctx.moveTo(-line.length / 2, settings.lineWidth * 0.2);
    ctx.lineTo(line.length / 2, settings.lineWidth * 0.2);
    ctx.stroke();
  }

  ctx.restore();
}
