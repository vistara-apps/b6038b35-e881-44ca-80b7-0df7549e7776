'use client';

import { useState, useEffect } from 'react';
import { Send, RefreshCw, Star } from 'lucide-react';
import type { PracticeSession, ScenarioType } from '@/lib/types';

interface PracticeScenariosProps {
  userId: string;
}

const SCENARIO_TYPES: { value: ScenarioType; label: string; icon: string }[] = [
  { value: 'awkward_party', label: 'Party Scenarios', icon: '🎉' },
  { value: 'work_meeting', label: 'Work Meetings', icon: '💼' },
  { value: 'social_media_troll', label: 'Social Media', icon: '📱' },
  { value: 'interview', label: 'Interviews', icon: '👔' },
  { value: 'date', label: 'Dates', icon: '💕' },
];

export function PracticeScenarios({ userId }: PracticeScenariosProps) {
  const [currentScenario, setCurrentScenario] = useState<string>('');
  const [userResponse, setUserResponse] = useState('');
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<ScenarioType>('awkward_party');
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRandomScenario();
    fetchPracticeHistory();
  }, [selectedType]);

  const fetchRandomScenario = async () => {
    try {
      const response = await fetch('/api/practice', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenarioType: selectedType }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentScenario(data.scenario);
        setUserResponse('');
        setFeedback('');
      }
    } catch (error) {
      console.error('Error fetching scenario:', error);
    }
  };

  const fetchPracticeHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/practice?userId=${userId}&scenarioType=${selectedType}`);
      const data = await response.json();

      if (data.success) {
        setSessions(data.sessions.slice(0, 5)); // Show last 5 sessions
      }
    } catch (error) {
      console.error('Error fetching practice history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async () => {
    if (!userResponse.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/practice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          scenarioType: selectedType,
          userResponse: userResponse.trim(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFeedback(data.session.aiFeedback);
        fetchPracticeHistory(); // Refresh history
      } else {
        setFeedback('Failed to get feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      setFeedback('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const parseFeedback = (feedbackText: string) => {
    const lines = feedbackText.split('\n');
    const scoreMatch = feedbackText.match(/Score.*?(\d+)\/10/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

    return { score, fullFeedback: feedbackText };
  };

  const { score, fullFeedback } = parseFeedback(feedback);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Practice Your Wit</h2>
        <p className="text-muted">
          Hone your social skills with AI-powered feedback on real scenarios.
        </p>
      </div>

      {/* Scenario Type Selector */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-fg">Choose Scenario Type:</h3>
        <div className="grid grid-cols-2 gap-2">
          {SCENARIO_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedType === type.value
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-surface hover:border-accent/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{type.icon}</span>
                <span className="font-medium text-sm">{type.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Scenario */}
      <div className="glass-card p-6 rounded-lg border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Current Scenario</h3>
          <button
            onClick={fetchRandomScenario}
            className="p-2 rounded-lg bg-surface border border-border hover:border-accent transition-colors"
            title="Get new scenario"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 bg-surface rounded-lg border border-border mb-4">
          <p className="text-fg">{currentScenario || 'Loading scenario...'}</p>
        </div>

        {/* Response Input */}
        <div className="space-y-4">
          <textarea
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            placeholder="Type your witty response here..."
            className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-fg placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none"
            rows={3}
          />

          <button
            onClick={handleSubmitResponse}
            disabled={!userResponse.trim() || isSubmitting}
            className="w-full px-4 py-3 bg-gradient-to-r from-accent to-primary text-bg rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-bg"></div>
                Getting Feedback...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Get AI Feedback
              </>
            )}
          </button>
        </div>

        {/* Feedback Display */}
        {feedback && (
          <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-yellow-400" />
              <h4 className="font-semibold">AI Feedback</h4>
              {score && (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  score >= 8 ? 'bg-green-500/20 text-green-400' :
                  score >= 6 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {score}/10
                </span>
              )}
            </div>
            <p className="text-sm text-muted whitespace-pre-line">{fullFeedback}</p>
          </div>
        )}
      </div>

      {/* Practice History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Practice Sessions</h3>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-surface rounded-lg border border-border animate-pulse">
                <div className="h-4 bg-border rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-border rounded w-full mb-1"></div>
                <div className="h-3 bg-border rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.sessionId} className="p-4 bg-surface rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted">
                    {new Date(session.timestamp).toLocaleDateString()}
                  </span>
                  <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">
                    {session.scenarioType.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-fg mb-2">
                  <strong>Your response:</strong> {session.userResponse}
                </p>
                <p className="text-xs text-muted">
                  {session.aiFeedback.length > 100
                    ? `${session.aiFeedback.substring(0, 100)}...`
                    : session.aiFeedback
                  }
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted">No practice sessions yet. Start practicing!</p>
          </div>
        )}
      </div>
    </div>
  );
}

