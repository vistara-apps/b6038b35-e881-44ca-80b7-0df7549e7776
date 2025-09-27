'use client';

import type { ContextType } from '@/lib/types';

interface ContextSelectorProps {
  selectedContext: ContextType;
  onContextChange: (context: ContextType) => void;
}

const contexts: { value: ContextType; label: string; description: string; icon: string }[] = [
  { value: 'general', label: 'General', description: 'Any situation', icon: '💬' },
  { value: 'social_media', label: 'Social Media', description: 'Online interactions', icon: '📱' },
  { value: 'work', label: 'Work', description: 'Professional settings', icon: '💼' },
  { value: 'party', label: 'Party', description: 'Social gatherings', icon: '🎉' },
  { value: 'personal', label: 'Personal', description: 'One-on-one conversations', icon: '👥' },
];

export function ContextSelector({ selectedContext, onContextChange }: ContextSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-fg">Context:</h3>
      <div className="grid grid-cols-2 gap-2">
        {contexts.map((context) => (
          <button
            key={context.value}
            onClick={() => onContextChange(context.value)}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedContext === context.value
                ? 'border-accent bg-accent/10'
                : 'border-border bg-surface hover:border-accent/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{context.icon}</span>
              <div>
                <div className="font-medium text-fg text-sm">{context.label}</div>
                <div className="text-xs text-muted mt-0.5">{context.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

