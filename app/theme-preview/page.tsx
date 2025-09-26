'use client';

import { useTheme } from '../components/ThemeProvider';
import { AppShell } from '../components/AppShell';
import { ResponseCard } from '../components/ResponseCard';
import { StyleSelector } from '../components/StyleSelector';
import type { Response } from '@/lib/types';

const themes = [
  { value: 'default', label: 'Finance Pro', description: 'Dark navy with gold accents' },
  { value: 'celo', label: 'CELO', description: 'Black with yellow accents' },
  { value: 'solana', label: 'Solana', description: 'Purple with magenta accents' },
  { value: 'base', label: 'Base', description: 'Dark blue with Base blue accents' },
  { value: 'coinbase', label: 'Coinbase', description: 'Navy with Coinbase blue accents' },
];

const sampleResponse: Response = {
  responseId: 'sample-1',
  originalQuery: 'Why do you always wear sunglasses?',
  generatedText: "I'm trying to hide my glowing superpowers.",
  styleTag: 'sarcastic',
  contextTag: 'general',
};

export default function ThemePreviewPage() {
  const { theme, setTheme } = useTheme();

  return (
    <AppShell variant="compact">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Theme Preview</h1>
          <p className="text-muted">Preview different blockchain themes</p>
        </div>

        {/* Theme Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value as any)}
              className={`p-4 rounded-lg border text-left transition-all ${
                theme === themeOption.value
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-surface hover:border-accent/50'
              }`}
            >
              <div className="font-medium text-fg">{themeOption.label}</div>
              <div className="text-sm text-muted mt-1">{themeOption.description}</div>
              {theme === themeOption.value && (
                <div className="mt-2 text-xs text-accent">✓ Active</div>
              )}
            </button>
          ))}
        </div>

        {/* Preview Components */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Style Selector Preview</h3>
            <StyleSelector
              selectedStyle="sarcastic"
              onStyleChange={() => {}}
              variant="segmented"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Response Card Preview</h3>
            <ResponseCard response={sampleResponse} />
          </div>

          <div className="glass-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-4">Glass Card Preview</h3>
            <p className="text-muted">
              This is how glass cards look in the current theme. They have a subtle
              backdrop blur effect and semi-transparent background.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="btn-primary px-4 py-2 rounded-lg">
              Primary Button
            </button>
            <button className="px-4 py-2 rounded-lg bg-surface border border-border hover:border-accent transition-colors">
              Secondary Button
            </button>
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Color Palette</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="w-full h-12 bg-bg border border-border rounded"></div>
              <div className="text-sm text-center">Background</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-12 bg-surface border border-border rounded"></div>
              <div className="text-sm text-center">Surface</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-12 bg-accent rounded"></div>
              <div className="text-sm text-center">Accent</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-12 bg-primary rounded"></div>
              <div className="text-sm text-center">Primary</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
