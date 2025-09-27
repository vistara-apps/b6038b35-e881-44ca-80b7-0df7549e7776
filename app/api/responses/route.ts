import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import type { SavedResponse, Response } from '@/lib/types';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

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

    // Get user's saved responses
    const savedResponseIds = await redis.smembers(`user:${userId}:saved_responses`);

    const savedResponses: SavedResponse[] = [];
    for (const responseId of savedResponseIds) {
      const responseData = await redis.get(`saved_response:${responseId}`);
      if (responseData) {
        savedResponses.push(JSON.parse(responseData as string));
      }
    }

    // Sort by timestamp (most recent first)
    savedResponses.sort((a, b) => new Date(b.customNotes?.timestamp || 0).getTime() - new Date(a.customNotes?.timestamp || 0).getTime());

    return NextResponse.json({
      success: true,
      responses: savedResponses,
    });
  } catch (error) {
    console.error('Error fetching saved responses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch saved responses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, response, customNotes } = body;

    if (!userId || !response) {
      return NextResponse.json(
        { success: false, error: 'userId and response are required' },
        { status: 400 }
      );
    }

    // Check user's subscription tier for save limits
    const userData = await redis.get(`user:${userId}`);
    const userTier = userData ? JSON.parse(userData as string).subscriptionTier : 'free';

    const maxSaves = userTier === 'free' ? 10 : userTier === 'premium' ? 100 : 1000;
    const currentSaves = await redis.scard(`user:${userId}:saved_responses`);

    if (currentSaves >= maxSaves) {
      return NextResponse.json(
        { success: false, error: `Maximum saved responses limit reached (${maxSaves})` },
        { status: 400 }
      );
    }

    // Create saved response
    const savedResponseId = `saved_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const savedResponse: SavedResponse = {
      savedResponseId,
      userId,
      responseId: response.responseId,
      customNotes: {
        ...customNotes,
        timestamp: new Date().toISOString(),
      },
    };

    // Store the original response if not already stored
    await redis.set(`response:${response.responseId}`, JSON.stringify(response));

    // Store saved response
    await redis.set(`saved_response:${savedResponseId}`, JSON.stringify(savedResponse));

    // Add to user's saved responses set
    await redis.sadd(`user:${userId}:saved_responses`, savedResponseId);

    return NextResponse.json({
      success: true,
      savedResponse,
    });
  } catch (error) {
    console.error('Error saving response:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save response' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const savedResponseId = searchParams.get('savedResponseId');

    if (!userId || !savedResponseId) {
      return NextResponse.json(
        { success: false, error: 'userId and savedResponseId are required' },
        { status: 400 }
      );
    }

    // Remove from user's saved responses set
    await redis.srem(`user:${userId}:saved_responses`, savedResponseId);

    // Delete the saved response
    await redis.del(`saved_response:${savedResponseId}`);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting saved response:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete saved response' },
      { status: 500 }
    );
  }
}

