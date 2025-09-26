'use client';

import { useState } from 'react';
import { Settings2, User, Sparkles } from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';

interface AppShellProps {
  children: React.ReactNode;
  variant?: 'default' | 'compact';
}

export function AppShell({ children, variant = 'default' }: AppShellProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-bg" />
              </div>
              <h1 className="text-xl font-bold">WittyReply</h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Wallet>
                <ConnectWallet>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border hover:border-accent transition-colors">
                    <Avatar className="w-6 h-6" />
                    <Name className="text-sm" />
                  </div>
                </ConnectWallet>
              </Wallet>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-surface border border-border hover:border-accent transition-colors"
              >
                <Settings2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="fixed top-16 right-4 z-50 w-64 glass-card border border-border rounded-lg shadow-dropdown">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Settings</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Tone Context</span>
                <span className="text-sm">None</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Tone Contains</span>
                <select className="text-sm bg-surface border border-border rounded px-2 py-1">
                  <option>Generic reply content</option>
                  <option>Custom context</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Custom Context</span>
                <span className="text-sm text-orange-400">Custom & Witty</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`max-w-3xl mx-auto px-4 ${variant === 'compact' ? 'py-2' : 'py-4'}`}>
        {children}
      </main>
    </div>
  );
}
