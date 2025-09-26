'use client';

import { useState, useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { ChatInput } from './components/ChatInput';
import { ResponseCard } from './components/ResponseCard';
import { StyleSelector } from './components/StyleSelector';
import { SubscriptionGate } from './components/SubscriptionGate';
import { generateMockResponses } from '@/lib/utils';
import type { Response, ResponseStyle, ContextType } from '@/lib/types';

export default function HomePage() {
  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ResponseStyle>('witty');
  const [responses, setResponses] = useState<Response[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userTier, setUserTier] = useState<'free' | 'premium' | 'pro'>('free');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Show example query on load
    const timer = setTimeout(() => {
      setCurrentQuery("Why do you always wear sunglasses?");
      handleGenerateResponse("Why do you always wear sunglasses?");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleGenerateResponse = async (query: string) => {
    setIsGenerating(true);
    setShowWelcome(false);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponses = generateMockResponses(query, selectedStyle);
      const responseObjects: Response[] = mockResponses.map((text, index) => ({
        responseId: `${Date.now()}-${index}`,
        originalQuery: query,
        generatedText: text,
        styleTag: selectedStyle,
        contextTag: 'general' as ContextType,
      }));
      
      setResponses(responseObjects);
    } catch (error) {
      console.error('Failed to generate responses:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveResponse = (responseId: string) => {
    console.log('Saving response:', responseId);
    // Implement save functionality
  };

  const handleShareResponse = (response: Response) => {
    console.log('Sharing response:', response);
    // Implement share functionality
  };

  const handleUpgrade = (tier: 'premium' | 'pro') => {
    console.log('Upgrading to:', tier);
    // Implement upgrade functionality
    setUserTier(tier);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome Section */}
        {showWelcome && (
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Your Pocket AI for Instant Comebacks
            </h2>
            <p className="text-muted text-lg mb-6">
              Generate quick, witty, and confident responses to any awkward situation
            </p>
          </div>
        )}

        {/* Current Query Display */}
        {currentQuery && !showWelcome && (
          <div className="glass-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-2">
              {currentQuery}
            </h2>
            <p className="text-muted text-sm">
              Generating {selectedStyle} responses...
            </p>
          </div>
        )}

        {/* Style Selector */}
        <StyleSelector
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
          variant="segmented"
        />

        {/* Responses */}
        {isGenerating ? (
          <div className="space-y-4">
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
        ) : (
          <div className="space-y-4">
            {responses.map((response) => (
              <ResponseCard
                key={response.responseId}
                response={response}
                onSave={handleSaveResponse}
                onShare={handleShareResponse}
              />
            ))}
          </div>
        )}

        {/* Chat Input */}
        <div className="sticky bottom-4">
          <ChatInput
            onSubmit={handleGenerateResponse}
            placeholder="Ask me anything awkward..."
            variant="withSuggestions"
            disabled={isGenerating}
          />
        </div>

        {/* Premium Features Preview */}
        <SubscriptionGate
          currentTier={userTier}
          onUpgrade={handleUpgrade}
          requiredTier="premium"
        >
          <div className="glass-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-4">🎭 Practice Scenarios</h3>
            <p className="text-muted mb-4">
              Practice your wit with AI-powered scenarios and get personalized feedback.
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-surface rounded-lg border border-border">
                <strong>Scenario:</strong> Someone at a party asks "Why are you so quiet?"
              </div>
              <div className="p-3 bg-surface rounded-lg border border-border">
                <strong>Your Response:</strong> [Practice your comeback here]
              </div>
            </div>
          </div>
        </SubscriptionGate>
      </div>
    </AppShell>
  );
}
