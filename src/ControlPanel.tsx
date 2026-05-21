import type { ReactNode } from 'react';
import type { PosterSettings } from './types';

interface Props {
  settings: PosterSettings;
  onChange: <K extends keyof PosterSettings>(key: K, value: PosterSettings[K]) => void;
  onRandom: () => void;
  onReset: () => void;
  onExport: () => void;
}

export function ControlPanel({ settings, onChange, onRandom, onReset, onExport }: Props) {
  return (
    <aside className="panel">
      <h1>Line Tension Poster Generator</h1>
      <Select label="画布比例" value={settings.ratio} onChange={(v) => onChange('ratio', v as PosterSettings['ratio'])} options={[
        ['portrait', '竖版'], ['square', '方形'], ['landscape', '横版'],
      ]} />
      <Field label="背景颜色"><input type="color" value={settings.background} onChange={(e) => onChange('background', e.target.value)} /></Field>
      <Range label="形状数量" min={4} max={36} step={1} value={settings.shapeCount} onChange={(v) => onChange('shapeCount', v)} />
      <Range label="形状柔软度" min={0} max={1} step={0.01} value={settings.softness} onChange={(v) => onChange('softness', v)} />
      <Range label="形状随机程度" min={0} max={1} step={0.01} value={settings.shapeRandomness} onChange={(v) => onChange('shapeRandomness', v)} />
      <Range label="线条数量" min={1} max={12} step={1} value={settings.lineCount} onChange={(v) => onChange('lineCount', v)} />
      <Range label="线条粗细" min={2} max={60} step={1} value={settings.lineWidth} onChange={(v) => onChange('lineWidth', v)} />
      <Range label="线条角度随机" min={0} max={1.5} step={0.01} value={settings.lineAngleJitter} onChange={(v) => onChange('lineAngleJitter', v)} />
      <Range label="勒紧强度" min={0} max={1} step={0.01} value={settings.tensionStrength} onChange={(v) => onChange('tensionStrength', v)} />
      <Field label="线条颜色"><input type="color" value={settings.lineColor} onChange={(e) => onChange('lineColor', e.target.value)} /></Field>
      <Field label="主标题"><input value={settings.title} onChange={(e) => onChange('title', e.target.value)} /></Field>
      <Field label="副标题"><input value={settings.subtitle} onChange={(e) => onChange('subtitle', e.target.value)} /></Field>
      <Field label="年份"><input value={settings.year} onChange={(e) => onChange('year', e.target.value)} /></Field>
      <Field label="中文标题"><input value={settings.cnTitle} onChange={(e) => onChange('cnTitle', e.target.value)} /></Field>
      <div className="actions">
        <button onClick={onRandom}>随机生成</button>
        <button onClick={onReset}>重置</button>
        <button onClick={onExport}>导出 PNG</button>
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function Range({ label, min, max, step, value, onChange }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  return <Field label={`${label} (${value.toFixed(step < 1 ? 2 : 0)})`}><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} /></Field>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return <Field label={label}><select value={value} onChange={(e) => onChange(e.target.value)}>{options.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></Field>;
}
