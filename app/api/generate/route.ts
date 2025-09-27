import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { GenerateResponseRequest, GenerateResponseResponse, Response, ResponseStyle, ContextType } from '@/lib/types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const STYLE_PROMPTS: Record<ResponseStyle, string> = {
  sarcastic: "Respond with sharp, witty sarcasm that playfully mocks the situation while being clever and not mean-spirited.",
  humorous: "Respond with light-hearted humor that makes people laugh and diffuses tension.",
  playful: "Respond with fun, teasing banter that's flirty and engaging.",
  witty: "Respond with clever wordplay and intelligent observations that show quick thinking.",
  clever: "Respond with intelligent, insightful replies that demonstrate wisdom and thoughtfulness.",
};

const CONTEXT_PROMPTS: Record<ContextType, string> = {
  social_media: "This is for social media interaction. Keep it concise and engaging for online audiences.",
  work: "This is a professional work setting. Keep responses appropriate and maintain professionalism.",
  party: "This is at a social gathering or party. Keep it fun and light-hearted.",
  personal: "This is a personal conversation. Be authentic and considerate.",
  general: "This is a general conversation. Adapt to be broadly appropriate.",
};

export async function POST(request: NextRequest) {
  try {
    const body: GenerateResponseRequest = await request.json();
    const { query, style, context, userId } = body;

    if (!query || !style) {
      return NextResponse.json(
        { success: false, error: 'Query and style are required' },
        { status: 400 }
      );
    }

    // Check rate limits for free users
    if (!userId || userId === 'anonymous') {
      // Implement rate limiting logic here
      // For now, allow unlimited for demo
    }

    const systemPrompt = `You are WittyReply, an AI that generates clever, confident responses to awkward or challenging social situations.

Style: ${STYLE_PROMPTS[style]}
Context: ${CONTEXT_PROMPTS[context || 'general']}

Generate 3-5 different witty response options for the user's query. Each response should be:
- Concise (under 280 characters)
- Contextually appropriate
- Clever and engaging
- True to the requested style

Return only the response options as a JSON array of strings.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cost-effective model
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      max_tokens: 500,
      temperature: 0.8, // Creative but consistent
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the response as JSON array
    let responseTexts: string[];
    try {
      responseTexts = JSON.parse(response);
      if (!Array.isArray(responseTexts)) {
        throw new Error('Response is not an array');
      }
    } catch (parseError) {
      // Fallback: split by newlines if JSON parsing fails
      responseTexts = response.split('\n').filter(text => text.trim().length > 0);
    }

    // Ensure we have at least 3 responses
    while (responseTexts.length < 3) {
      responseTexts.push(`That's ${style} indeed! Here's another take: ${query}`);
    }

    // Create Response objects
    const responses: Response[] = responseTexts.slice(0, 5).map((text, index) => ({
      responseId: `${Date.now()}-${index}`,
      originalQuery: query,
      generatedText: text.trim(),
      styleTag: style,
      contextTag: context || 'general',
    }));

    const result: GenerateResponseResponse = {
      responses,
      success: true,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating response:', error);

    // Fallback to mock responses if API fails
    const mockResponses: Response[] = [
      {
        responseId: `${Date.now()}-fallback-1`,
        originalQuery: body.query || 'Unknown query',
        generatedText: "That's an interesting question! I'm processing the best witty response for you.",
        styleTag: body.style || 'witty',
        contextTag: body.context || 'general',
      },
      {
        responseId: `${Date.now()}-fallback-2`,
        originalQuery: body.query || 'Unknown query',
        generatedText: "Give me a moment to craft the perfect comeback...",
        styleTag: body.style || 'witty',
        contextTag: body.context || 'general',
      },
    ];

    return NextResponse.json({
      responses: mockResponses,
      success: true,
      error: 'Using fallback responses due to API error',
    });
  }
}

