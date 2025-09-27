import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import OpenAI from 'openai';
import type { PracticeSession, ScenarioType } from '@/lib/types';

// Initialize clients
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Practice scenarios by type
const SCENARIOS: Record<ScenarioType, string[]> = {
  awkward_party: [
    "Someone at a party asks 'Why are you so quiet?'",
    "A friend introduces you to someone and they say 'I've heard so much about you'",
    "Someone spills a drink on you and says 'Oops, sorry about that'",
    "A group is talking about politics and asks your opinion on a controversial topic",
    "Someone compliments your outfit but you can tell they don't mean it",
  ],
  work_meeting: [
    "Your boss asks 'How's that project coming along?' when you're behind schedule",
    "A colleague says 'You seem stressed lately' during a team meeting",
    "Someone asks 'What's your background in this field?' and you're self-taught",
    "Your manager says 'We need to talk about your performance' privately",
    "A coworker asks 'Why did you choose this career path?'",
  ],
  social_media_troll: [
    "Someone comments 'This post is boring' on your content",
    "A troll says 'You think you're so smart, don't you?'",
    "Someone DMs 'Why do you post so much?'",
    "A follower comments 'This is just clickbait'",
    "Someone says 'Your opinion doesn't matter'",
  ],
  interview: [
    "Interviewer asks 'What's your biggest weakness?'",
    "They ask 'Where do you see yourself in 5 years?'",
    "Interviewer says 'You seem nervous' during the interview",
    "They ask 'Why did you leave your last job?' about a difficult situation",
    "Someone asks 'What's your salary expectation?'",
  ],
  date: [
    "Your date asks 'So, what do you do for fun?'",
    "They say 'You seem different from your online profile'",
    "Someone asks 'Why are you still single?'",
    "Your date says 'Tell me about your exes'",
    "They ask 'What's your idea of a perfect date?'",
  ],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const scenarioType = searchParams.get('scenarioType') as ScenarioType;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get user's practice sessions
    const sessionIds = await redis.smembers(`user:${userId}:practice_sessions`);

    const sessions: PracticeSession[] = [];
    for (const sessionId of sessionIds) {
      const sessionData = await redis.get(`practice_session:${sessionId}`);
      if (sessionData) {
        sessions.push(JSON.parse(sessionData as string));
      }
    }

    // Sort by timestamp (most recent first)
    sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Filter by scenario type if provided
    const filteredSessions = scenarioType
      ? sessions.filter(session => session.scenarioType === scenarioType)
      : sessions;

    return NextResponse.json({
      success: true,
      sessions: filteredSessions,
    });
  } catch (error) {
    console.error('Error fetching practice sessions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch practice sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, scenarioType, userResponse } = body;

    if (!userId || !scenarioType || !userResponse) {
      return NextResponse.json(
        { success: false, error: 'userId, scenarioType, and userResponse are required' },
        { status: 400 }
      );
    }

    // Check user's subscription tier for practice limits
    const userData = await redis.get(`user:${userId}`);
    const userTier = userData ? JSON.parse(userData as string).subscriptionTier : 'free';

    if (userTier === 'free') {
      const today = new Date().toISOString().split('T')[0];
      const dailyPractices = await redis.get(`user:${userId}:practice_count:${today}`);
      const count = dailyPractices ? parseInt(dailyPractices as string) : 0;

      if (count >= 5) {
        return NextResponse.json(
          { success: false, error: 'Daily practice limit reached (5). Upgrade for unlimited practice!' },
          { status: 400 }
        );
      }

      await redis.set(`user:${userId}:practice_count:${today}`, (count + 1).toString());
    }

    // Generate AI feedback
    const feedbackPrompt = `You are a witty response coach. Analyze this user's response to a social scenario and provide constructive feedback.

Scenario Type: ${scenarioType}
User's Response: "${userResponse}"

Provide feedback in this format:
1. Score (1-10): [score]/10
2. Strengths: [2-3 positive aspects]
3. Areas for improvement: [1-2 suggestions]
4. Suggested alternative: [a better witty response]

Keep feedback encouraging and specific. Focus on wit, confidence, and appropriateness.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: feedbackPrompt },
        { role: 'user', content: userResponse }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiFeedback = completion.choices[0]?.message?.content || 'Great effort! Keep practicing to refine your witty responses.';

    // Create practice session
    const sessionId = `practice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: PracticeSession = {
      sessionId,
      userId,
      scenarioType: scenarioType as ScenarioType,
      userResponse,
      aiFeedback,
      timestamp: new Date(),
    };

    // Store session
    await redis.set(`practice_session:${sessionId}`, JSON.stringify(session));

    // Add to user's practice sessions
    await redis.sadd(`user:${userId}:practice_sessions`, sessionId);

    // Keep only last 100 sessions per user
    const allSessions = await redis.smembers(`user:${userId}:practice_sessions`);
    if (allSessions.length > 100) {
      const sessionsToDelete = allSessions.slice(0, allSessions.length - 100);
      for (const sessionId of sessionsToDelete) {
        await redis.del(`practice_session:${sessionId}`);
        await redis.srem(`user:${userId}:practice_sessions`, sessionId);
      }
    }

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('Error creating practice session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create practice session' },
      { status: 500 }
    );
  }
}

// Get random scenario for practice
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenarioType } = body;

    const scenarios = scenarioType && SCENARIOS[scenarioType as ScenarioType]
      ? SCENARIOS[scenarioType as ScenarioType]
      : Object.values(SCENARIOS).flat();

    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    return NextResponse.json({
      success: true,
      scenario: randomScenario,
      type: scenarioType || 'mixed',
    });
  } catch (error) {
    console.error('Error getting random scenario:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get random scenario' },
      { status: 500 }
    );
  }
}

