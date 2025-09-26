'use client';

import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (query: string) => void;
  placeholder?: string;
  variant?: 'default' | 'withSuggestions';
  disabled?: boolean;
}

export function ChatInput({ 
  onSubmit, 
  placeholder = "Ask me anything awkward...", 
  variant = 'default',
  disabled = false 
}: ChatInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onSubmit(query.trim());
      setQuery('');
    }
  };

  const suggestions = [
    "Why do you always wear sunglasses?",
    "That's an interesting choice...",
    "Are you always this quiet?",
    "What's your deal?"
  ];

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-4 py-4 pr-12 bg-surface border border-border rounded-lg text-fg placeholder-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!query.trim() || disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-accent to-primary text-bg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

      {variant === 'withSuggestions' && (
        <div className="space-y-2">
          <p className="text-sm text-muted">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setQuery(suggestion)}
                className="px-3 py-2 text-sm bg-surface border border-border rounded-lg hover:border-accent transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
