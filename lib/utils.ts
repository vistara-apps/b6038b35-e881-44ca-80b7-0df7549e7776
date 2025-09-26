import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';
    document.body.prepend(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
    } catch (error) {
      console.error('Failed to copy text: ', error);
    } finally {
      textArea.remove();
    }
    
    return Promise.resolve();
  }
}

export function formatSubscriptionTier(tier: string): string {
  switch (tier) {
    case 'free':
      return 'Free';
    case 'premium':
      return 'Premium';
    case 'pro':
      return 'Pro';
    default:
      return 'Free';
  }
}

export function getStyleColor(style: string): string {
  switch (style) {
    case 'sarcastic':
      return 'from-cyan-400 to-teal-500';
    case 'humorous':
      return 'from-yellow-400 to-orange-500';
    case 'playful':
      return 'from-pink-400 to-purple-500';
    case 'witty':
      return 'from-green-400 to-emerald-500';
    case 'clever':
      return 'from-blue-400 to-indigo-500';
    default:
      return 'from-gray-400 to-gray-500';
  }
}

export function generateMockResponses(query: string, style: string): string[] {
  const responses: Record<string, string[]> = {
    sarcastic: [
      "Oh wow, what a groundbreaking question. I'm sure no one's ever thought of that before.",
      "Let me consult my crystal ball... oh wait, it's telling me to use Google.",
      "That's definitely the most important thing we should be discussing right now."
    ],
    humorous: [
      "Well, that's one way to break the ice... with a sledgehammer!",
      "I'd answer that, but my comedy writer is on vacation.",
      "That question deserves a standing ovation... for its creativity!"
    ],
    playful: [
      "Ooh, someone's feeling curious today! I like it.",
      "That's like asking why pizza tastes better at 2 AM - some mysteries are meant to be enjoyed!",
      "You know what? I'm just going to pretend you asked me about my favorite color instead."
    ],
    witty: [
      "That's a question that would make Socrates proud... or confused.",
      "I see we're diving straight into the deep philosophical waters today.",
      "That's either very profound or I need more coffee to understand it."
    ],
    clever: [
      "Interesting angle - most people approach it from the obvious direction.",
      "That's the kind of question that separates the thinkers from the followers.",
      "I appreciate someone who asks the questions others are afraid to ask."
    ]
  };

  return responses[style] || responses.witty;
}
