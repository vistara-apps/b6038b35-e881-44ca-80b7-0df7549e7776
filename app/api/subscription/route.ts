import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Subscription plans
const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['3 responses per day', 'Basic styles', 'Limited saves'],
  },
  premium: {
    name: 'Premium',
    price: 5,
    features: ['Unlimited responses', 'All styles', '100 saved responses', 'Practice scenarios'],
  },
  pro: {
    name: 'Pro',
    price: 10,
    features: ['Everything in Premium', 'Persona training', 'Priority support', '1000 saved responses'],
  },
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

    // Get user subscription info
    const userData = await redis.get(`user:${userId}`);
    const user = userData ? JSON.parse(userData as string) : null;

    const subscriptionInfo = {
      currentTier: user?.subscriptionTier || 'free',
      plans: SUBSCRIPTION_PLANS,
      features: SUBSCRIPTION_PLANS[user?.subscriptionTier || 'free'].features,
    };

    return NextResponse.json({
      success: true,
      subscription: subscriptionInfo,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription info' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tier, paymentMethod } = body;

    if (!userId || !tier) {
      return NextResponse.json(
        { success: false, error: 'userId and tier are required' },
        { status: 400 }
      );
    }

    if (!SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS]) {
      return NextResponse.json(
        { success: false, error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    // Get current user
    const userData = await redis.get(`user:${userId}`);
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const user = JSON.parse(userData as string);

    // For free tier, just update immediately
    if (tier === 'free') {
      const updatedUser = { ...user, subscriptionTier: tier };
      await redis.set(`user:${userId}`, JSON.stringify(updatedUser));

      return NextResponse.json({
        success: true,
        subscription: {
          tier,
          status: 'active',
          features: SUBSCRIPTION_PLANS[tier].features,
        },
      });
    }

    // For paid tiers, create payment intent
    const plan = SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS];

    // In a real implementation, integrate with Coinbase Commerce or similar
    // For now, simulate payment processing
    const paymentIntent = {
      id: `payment_${Date.now()}`,
      amount: plan.price,
      currency: 'USD',
      status: 'pending',
      tier,
    };

    // Store payment intent
    await redis.set(`payment:${paymentIntent.id}`, JSON.stringify({
      ...paymentIntent,
      userId,
      createdAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      paymentIntent,
      message: `Redirecting to payment for ${plan.name} subscription ($${plan.price}/month)`,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

// Handle payment confirmation webhook
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, status } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { success: false, error: 'paymentId and status are required' },
        { status: 400 }
      );
    }

    // Get payment intent
    const paymentData = await redis.get(`payment:${paymentId}`);
    if (!paymentData) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }

    const payment = JSON.parse(paymentData as string);

    if (status === 'completed') {
      // Update user subscription
      const userData = await redis.get(`user:${payment.userId}`);
      if (userData) {
        const user = JSON.parse(userData as string);
        const updatedUser = { ...user, subscriptionTier: payment.tier };
        await redis.set(`user:${payment.userId}`, JSON.stringify(updatedUser));

        // Store subscription record
        await redis.set(`subscription:${payment.userId}`, JSON.stringify({
          userId: payment.userId,
          tier: payment.tier,
          startDate: new Date().toISOString(),
          paymentId,
        }));
      }
    }

    // Update payment status
    await redis.set(`payment:${paymentId}`, JSON.stringify({
      ...payment,
      status,
      updatedAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      message: `Payment ${status}`,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

