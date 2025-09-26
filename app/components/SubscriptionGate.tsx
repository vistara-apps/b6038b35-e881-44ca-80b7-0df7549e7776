'use client';

import { useState } from 'react';
import { Crown, Check, Zap } from 'lucide-react';

interface SubscriptionGateProps {
  currentTier: 'free' | 'premium' | 'pro';
  onUpgrade: (tier: 'premium' | 'pro') => void;
  children: React.ReactNode;
  requiredTier: 'premium' | 'pro';
}

export function SubscriptionGate({ 
  currentTier, 
  onUpgrade, 
  children, 
  requiredTier 
}: SubscriptionGateProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  const hasAccess = () => {
    if (requiredTier === 'premium') {
      return currentTier === 'premium' || currentTier === 'pro';
    }
    return currentTier === 'pro';
  };

  if (hasAccess()) {
    return <>{children}</>;
  }

  const plans = [
    {
      tier: 'premium' as const,
      name: 'Premium',
      price: '$5/mo',
      icon: Crown,
      features: [
        'Unlimited responses',
        'Advanced styles',
        'Personalization',
        'Response history'
      ]
    },
    {
      tier: 'pro' as const,
      name: 'Pro',
      price: '$10/mo',
      icon: Zap,
      features: [
        'Everything in Premium',
        'AI practice scenarios',
        'Persona training',
        'Priority support',
        'Exclusive content'
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {/* Locked Content Preview */}
      <div className="relative">
        <div className="opacity-30 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setShowUpgrade(true)}
            className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Crown className="w-5 h-5" />
            Upgrade to {requiredTier === 'premium' ? 'Premium' : 'Pro'}
          </button>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-2xl glass-card border border-border rounded-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Upgrade Your Plan</h2>
              <p className="text-muted">Unlock premium features and get unlimited witty responses</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const isRecommended = plan.tier === requiredTier;
                
                return (
                  <div
                    key={plan.tier}
                    className={`p-6 rounded-lg border transition-all ${
                      isRecommended 
                        ? 'border-accent bg-accent/10' 
                        : 'border-border bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      {isRecommended && (
                        <span className="px-2 py-1 text-xs bg-accent text-bg rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    
                    <div className="text-3xl font-bold mb-4">{plan.price}</div>
                    
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => onUpgrade(plan.tier)}
                      className={`w-full py-3 rounded-lg font-medium transition-all ${
                        isRecommended
                          ? 'btn-primary'
                          : 'bg-surface border border-border hover:border-accent'
                      }`}
                    >
                      Choose {plan.name}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowUpgrade(false)}
                className="text-muted hover:text-fg transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
