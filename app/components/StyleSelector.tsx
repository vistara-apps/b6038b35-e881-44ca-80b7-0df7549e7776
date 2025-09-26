'use client';

import { useState } from 'react';
import type { ResponseStyle } from '@/lib/types';

interface StyleSelectorProps {
  selectedStyle: ResponseStyle;
  onStyleChange: (style: ResponseStyle) => void;
  variant?: 'default' | 'segmented';
}

const styles: { value: ResponseStyle; label: string; description: string }[] = [
  { value: 'sarcastic', label: 'Sarcastic', description: 'Sharp and witty' },
  { value: 'humorous', label: 'Humorous', description: 'Light and funny' },
  { value: 'playful', label: 'Playful', description: 'Fun and teasing' },
  { value: 'witty', label: 'Witty', description: 'Clever and smart' },
  { value: 'clever', label: 'Clever', description: 'Intelligent and sharp' },
];

export function StyleSelector({ 
  selectedStyle, 
  onStyleChange, 
  variant = 'default' 
}: StyleSelectorProps) {
  if (variant === 'segmented') {
    return (
      <div className="flex bg-surface rounded-lg p-1 border border-border">
        {styles.map((style) => (
          <button
            key={style.value}
            onClick={() => onStyleChange(style.value)}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              selectedStyle === style.value
                ? 'bg-accent text-bg shadow-sm'
                : 'text-muted hover:text-fg'
            }`}
          >
            {style.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-fg">Choose your style:</h3>
      <div className="grid grid-cols-2 gap-2">
        {styles.map((style) => (
          <button
            key={style.value}
            onClick={() => onStyleChange(style.value)}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedStyle === style.value
                ? 'border-accent bg-accent/10'
                : 'border-border bg-surface hover:border-accent/50'
            }`}
          >
            <div className="font-medium text-fg">{style.label}</div>
            <div className="text-xs text-muted mt-1">{style.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
