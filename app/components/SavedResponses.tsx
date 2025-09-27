'use client';

import { useState, useEffect } from 'react';
import { ResponseCard } from './ResponseCard';
import { copyToClipboard } from '@/lib/utils';
import type { SavedResponse, Response } from '@/lib/types';

interface SavedResponsesProps {
  userId: string;
}

export function SavedResponses({ userId }: SavedResponsesProps) {
  const [savedResponses, setSavedResponses] = useState<SavedResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedResponses();
  }, [userId]);

  const fetchSavedResponses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/responses?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setSavedResponses(data.responses);
      } else {
        setError(data.error || 'Failed to load saved responses');
      }
    } catch (err) {
      setError('Failed to load saved responses');
      console.error('Error fetching saved responses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResponse = async (savedResponseId: string) => {
    try {
      const response = await fetch(`/api/responses?userId=${userId}&savedResponseId=${savedResponseId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setSavedResponses(prev => prev.filter(sr => sr.savedResponseId !== savedResponseId));
      } else {
        console.error('Failed to delete response:', data.error);
      }
    } catch (err) {
      console.error('Error deleting response:', err);
    }
  };

  const handleShareResponse = (response: Response) => {
    // Implement sharing functionality
    console.log('Sharing response:', response);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Saved Responses</h2>
        {[1, 2, 3].map((i) => (
          <div key={i} className="response-card animate-pulse">
            <div className="h-4 bg-surface rounded w-20 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-surface rounded"></div>
              <div className="h-4 bg-surface rounded w-4/5"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted mb-4">{error}</p>
        <button
          onClick={fetchSavedResponses}
          className="px-4 py-2 bg-accent text-bg rounded-lg hover:shadow-lg transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (savedResponses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">💾</div>
        <h3 className="text-lg font-semibold mb-2">No Saved Responses Yet</h3>
        <p className="text-muted">
          Save your favorite witty responses to access them anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Saved Responses</h2>
        <span className="text-sm text-muted">
          {savedResponses.length} saved
        </span>
      </div>

      <div className="space-y-4">
        {savedResponses.map((savedResponse) => (
          <div key={savedResponse.savedResponseId} className="relative">
            <ResponseCard
              response={savedResponse.responseId ? {
                responseId: savedResponse.responseId,
                originalQuery: 'Saved response', // This would need to be fetched from the response data
                generatedText: 'Response text', // This would need to be fetched from the response data
                styleTag: 'witty',
                contextTag: 'general',
              } : {
                responseId: savedResponse.savedResponseId,
                originalQuery: 'Unknown query',
                generatedText: 'Response not available',
                styleTag: 'witty',
                contextTag: 'general',
              }}
              onSave={() => {}} // Already saved
              onShare={handleShareResponse}
            />

            {/* Delete button */}
            <button
              onClick={() => handleDeleteResponse(savedResponse.savedResponseId)}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete saved response"
            >
              🗑️
            </button>

            {/* Custom notes */}
            {savedResponse.customNotes && (
              <div className="mt-2 p-3 bg-surface rounded-lg border border-border">
                <p className="text-xs text-muted">
                  Saved on {new Date(savedResponse.customNotes.timestamp || savedResponse.customNotes.savedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

