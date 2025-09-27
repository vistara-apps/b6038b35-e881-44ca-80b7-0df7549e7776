'use client';

import { useState, useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { ChatInput } from './components/ChatInput';
import { ResponseCard } from './components/ResponseCard';
import { StyleSelector } from './components/StyleSelector';
import { SubscriptionGate } from './components/SubscriptionGate';
import { ContextSelector } from './components/ContextSelector';
import { SavedResponses } from './components/SavedResponses';
import { PracticeScenarios } from './components/PracticeScenarios';
import type { Response, ResponseStyle, ContextType, User } from '@/lib/types';

export default function HomePage() {
  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ResponseStyle>('witty');
  const [selectedContext, setSelectedContext] = useState<ContextType>('general');
  const [responses, setResponses] = useState<Response[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState<'generate' | 'practice' | 'saved'>('generate');
  const [userId, setUserId] = useState<string>('anonymous');

  useEffect(() => {
    // Initialize user
    const initUser = async () => {
      try {
        // For demo purposes, use a fixed user ID
        // In production, this would come from wallet connection
        const demoUserId = 'demo_user_' + Date.now();
        setUserId(demoUserId);

        const response = await fetch(`/api/user?userId=${demoUserId}`);
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to initialize user:', error);
      }
    };

    initUser();
  }, []);

  const handleGenerateResponse = async (query: string) => {
    if (!user) return;

    setIsGenerating(true);
    setShowWelcome(false);
    setCurrentQuery(query);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          style: selectedStyle,
          context: selectedContext,
          userId: userId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResponses(data.responses);
      } else {
        console.error('Failed to generate responses:', data.error);
        // Fallback to mock responses
        const mockResponses: Response[] = [
          {
            responseId: `${Date.now()}-fallback-1`,
            originalQuery: query,
            generatedText: "That's an interesting question! Let me think of a witty response...",
            styleTag: selectedStyle,
            contextTag: selectedContext,
          },
        ];
        setResponses(mockResponses);
      }
    } catch (error) {
      console.error('Failed to generate responses:', error);
      // Fallback response
      const fallbackResponse: Response = {
        responseId: `${Date.now()}-fallback`,
        originalQuery: query,
        generatedText: "Oops! Something went wrong. Try again in a moment.",
        styleTag: selectedStyle,
        contextTag: selectedContext,
      };
      setResponses([fallbackResponse]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveResponse = async (response: Response) => {
    if (!user) return;

    try {
      const saveResponse = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          response,
          customNotes: {
            savedAt: new Date().toISOString(),
          },
        }),
      });

      const data = await saveResponse.json();
      if (data.success) {
        console.log('Response saved successfully');
        // Update user data
        const userResponse = await fetch(`/api/user?userId=${userId}`);
        const userData = await userResponse.json();
        if (userData.success) {
          setUser(userData.user);
        }
      } else {
        console.error('Failed to save response:', data.error);
      }
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  const handleShareResponse = (response: Response) => {
    // Implement Farcaster sharing
    console.log('Sharing response:', response);
    // In production, integrate with Farcaster frames
  };

  const handleUpgrade = async (tier: 'premium' | 'pro') => {
    if (!user) return;

    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          tier,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Update user data
        const userResponse = await fetch(`/api/user?userId=${userId}`);
        const userData = await userResponse.json();
        if (userData.success) {
          setUser(userData.user);
        }
      } else {
        console.error('Failed to upgrade:', data.error);
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    }
  };

  if (!user) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted">Loading your witty profile...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex bg-surface rounded-lg p-1 border border-border">
          {[
            { id: 'generate', label: 'Generate', icon: '✨' },
            { id: 'practice', label: 'Practice', icon: '🎭' },
            { id: 'saved', label: 'Saved', icon: '💾' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-accent text-bg shadow-sm'
                  : 'text-muted hover:text-fg'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <>
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

            {/* Style and Context Selectors */}
            <div className="space-y-4">
              <StyleSelector
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
                variant="segmented"
              />

              <ContextSelector
                selectedContext={selectedContext}
                onContextChange={setSelectedContext}
              />
            </div>

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
                    onSave={() => handleSaveResponse(response)}
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
          </>
        )}

        {/* Practice Tab */}
        {activeTab === 'practice' && (
          <SubscriptionGate
            currentTier={user.subscriptionTier}
            onUpgrade={handleUpgrade}
            requiredTier="premium"
          >
            <PracticeScenarios userId={userId} />
          </SubscriptionGate>
        )}

        {/* Saved Tab */}
        {activeTab === 'saved' && (
          <SavedResponses userId={userId} />
        )}

        {/* Subscription Info */}
        <div className="text-center text-sm text-muted">
          Current Plan: <span className="font-medium text-fg">{user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}</span>
          {user.subscriptionTier === 'free' && (
            <button
              onClick={() => handleUpgrade('premium')}
              className="ml-2 text-accent hover:underline"
            >
              Upgrade →
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
