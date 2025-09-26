# WittyReply - Base Mini App

Your pocket AI for instant, witty comebacks. A Next.js Base Mini App that generates quick, witty, and confident responses to awkward, provocative, or strange questions.

## Features

- 🤖 **AI-Powered Response Generation**: Get 3-5 contextually relevant witty replies
- 🎭 **Multiple Styles**: Choose from sarcastic, humorous, playful, witty, or clever responses
- 💎 **Base Integration**: Connect your Base wallet for premium features
- 📱 **Mobile-First Design**: Optimized for mobile use with beautiful UI
- 🎨 **Multiple Themes**: Support for different blockchain themes (Base, CELO, Solana, etc.)
- 💰 **Subscription Model**: Tiered pricing with free, premium, and pro plans

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **React**: React 19 (required for OnchainKit)
- **Blockchain**: Base (via OnchainKit)
- **Styling**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety
- **AI**: OpenAI API (configurable)

## Getting Started

1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd wittyreply-base-miniapp
   npm install
   ```

2. **Environment Setup**:
   Copy `.env.local` and add your API keys:
   ```bash
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_key
   OPENAI_API_KEY=your_openai_key
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Open**: http://localhost:3000

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── AppShell.tsx    # Main app layout
│   ├── ChatInput.tsx   # User input component
│   ├── ResponseCard.tsx # Response display
│   ├── StyleSelector.tsx # Style selection
│   └── SubscriptionGate.tsx # Premium features gate
├── theme-preview/      # Theme preview page
├── layout.tsx          # Root layout
├── page.tsx           # Main page
├── providers.tsx      # OnchainKit provider
└── globals.css        # Global styles with theme system

lib/
├── types.ts           # TypeScript interfaces
└── utils.ts           # Utility functions
```

## Key Components

### AppShell
Main application layout with header, wallet connection, and settings.

### ChatInput
Input component for user queries with suggestions and form handling.

### ResponseCard
Displays generated responses with copy, save, and share functionality.

### StyleSelector
Allows users to choose response style (sarcastic, humorous, etc.).

### SubscriptionGate
Gates premium features behind subscription tiers.

## Theme System

The app supports multiple blockchain themes:
- **Default**: Finance-inspired dark navy with gold accents
- **CELO**: Black background with yellow accents
- **Solana**: Purple theme with magenta accents
- **Base**: Dark blue with Base brand colors
- **Coinbase**: Navy with Coinbase blue accents

Themes can be switched via URL parameter: `?theme=celo`

## Business Model

- **Free Tier**: Limited responses and basic styles
- **Premium ($5/mo)**: Unlimited responses, advanced styles, personalization
- **Pro ($10/mo)**: AI practice scenarios, persona training, priority support

## API Integration

The app is designed to integrate with:
- **OpenAI API**: For AI response generation
- **Base Minikit**: For wallet integration and payments
- **Upstash Redis**: For caching and rate limiting

## Deployment

The app is optimized for deployment on Vercel or similar platforms:

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
