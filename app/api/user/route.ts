import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import type { User, PersonaSettings } from '@/lib/types';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Default persona settings
const DEFAULT_PERSONA: PersonaSettings = {
  tone: 'balanced',
  humor_level: 'moderate',
  sarcasm_level: 'light',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get user data from Redis
    const userData = await redis.get(`user:${userId}`);

    if (!userData) {
      // Create new user if doesn't exist
      const newUser: User = {
        userId,
        username: `user_${userId.slice(0, 8)}`,
        subscriptionTier: 'free',
        preferredStyle: 'witty',
        savedResponses: [],
        personaSettings: DEFAULT_PERSONA,
      };

      await redis.set(`user:${userId}`, JSON.stringify(newUser));

      return NextResponse.json({
        success: true,
        user: newUser,
      });
    }

    const user: User = JSON.parse(userData as string);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, username, preferredStyle, personaSettings } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get existing user or create new one
    const existingUserData = await redis.get(`user:${userId}`);
    const existingUser: User = existingUserData
      ? JSON.parse(existingUserData as string)
      : {
          userId,
          username: username || `user_${userId.slice(0, 8)}`,
          subscriptionTier: 'free',
          preferredStyle: 'witty',
          savedResponses: [],
          personaSettings: DEFAULT_PERSONA,
        };

    // Update user data
    const updatedUser: User = {
      ...existingUser,
      username: username || existingUser.username,
      preferredStyle: preferredStyle || existingUser.preferredStyle,
      personaSettings: personaSettings || existingUser.personaSettings,
    };

    await redis.set(`user:${userId}`, JSON.stringify(updatedUser));

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subscriptionTier } = body;

    if (!userId || !subscriptionTier) {
      return NextResponse.json(
        { success: false, error: 'userId and subscriptionTier are required' },
        { status: 400 }
      );
    }

    // Get existing user
    const existingUserData = await redis.get(`user:${userId}`);
    if (!existingUserData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const existingUser: User = JSON.parse(existingUserData as string);

    // Update subscription tier
    const updatedUser: User = {
      ...existingUser,
      subscriptionTier,
    };

    await redis.set(`user:${userId}`, JSON.stringify(updatedUser));

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

