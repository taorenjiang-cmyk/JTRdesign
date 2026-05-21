import { useMemo, useState } from 'react';
import { CanvasPreview } from './CanvasPreview';
import { ControlPanel } from './ControlPanel';
import { buildLayout, defaultSettings } from './generator';
import type { PosterSettings } from './types';

export default function App() {
  const [settings, setSettings] = useState<PosterSettings>(defaultSettings);
  const [exportSignal, setExportSignal] = useState(0);

  const layout = useMemo(() => buildLayout(settings), [settings]);

  const mutate = <K extends keyof PosterSettings>(key: K, value: PosterSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const randomize = () => {
    setSettings((prev) => ({
      ...prev,
      seed: Math.floor(Math.random() * 1000000),
      shapeCount: Math.floor(8 + Math.random() * 22),
      lineCount: Math.floor(2 + Math.random() * 7),
      lineWidth: Math.floor(8 + Math.random() * 24),
      tensionStrength: 0.2 + Math.random() * 0.75,
    }));
  };

  return (
    <div className="app">
      <ControlPanel
        settings={settings}
        onChange={mutate}
        onRandom={randomize}
        onReset={() => setSettings(defaultSettings)}
        onExport={() => setExportSignal(Date.now())}
      />
      <main className="preview-wrap">
        <CanvasPreview layout={layout} settings={settings} exportSignal={exportSignal} />
      </main>
    </div>
  );
}
