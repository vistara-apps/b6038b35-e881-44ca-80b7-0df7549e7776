'use client';

import { useState } from 'react';
import { Copy, Check, Heart, Share } from 'lucide-react';
import { copyToClipboard, getStyleColor } from '@/lib/utils';
import type { Response } from '@/lib/types';

interface ResponseCardProps {
  response: Response;
  variant?: 'default' | 'editable';
  onSave?: (responseId: string) => void;
  onShare?: (response: Response) => void;
}

export function ResponseCard({ 
  response, 
  variant = 'default',
  onSave,
  onShare 
}: ResponseCardProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(response.generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(response.responseId);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(response);
    }
  };

  return (
    <div className="response-card group">
      {/* Style Tag */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r ${getStyleColor(response.styleTag)} text-white`}>
          {response.styleTag.charAt(0).toUpperCase() + response.styleTag.slice(1)}
        </span>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-surface transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-muted" />
            )}
          </button>
          
          {onSave && (
            <button
              onClick={handleSave}
              className="p-1.5 rounded-md hover:bg-surface transition-colors"
              title="Save response"
            >
              <Heart className={`w-4 h-4 ${saved ? 'text-red-400 fill-current' : 'text-muted'}`} />
            </button>
          )}
          
          {onShare && (
            <button
              onClick={handleShare}
              className="p-1.5 rounded-md hover:bg-surface transition-colors"
              title="Share response"
            >
              <Share className="w-4 h-4 text-muted" />
            </button>
          )}
        </div>
      </div>

      {/* Response Text */}
      <p className="text-fg leading-relaxed cursor-pointer" onClick={handleCopy}>
        {response.generatedText}
      </p>

      {/* Context Tag */}
      {response.contextTag && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted">
            Context: {response.contextTag.replace('_', ' ')}
          </span>
        </div>
      )}
    </div>
  );
}
