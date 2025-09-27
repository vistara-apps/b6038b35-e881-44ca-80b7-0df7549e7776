# WittyReply - Base Mini App

Your pocket AI for instant, witty comebacks. A production-ready Next.js Base Mini App that generates quick, witty, and confident responses to awkward, provocative, or strange questions for young social media users.

## 🚀 Features

- 🤖 **AI-Powered Response Generation**: Get 3-5 contextually relevant witty replies using OpenAI GPT-4
- 🎭 **Multiple Styles**: Choose from sarcastic, humorous, playful, witty, or clever responses
- 💎 **Base Integration**: Connect your Base wallet for premium features and payments
- 📱 **Mobile-First Design**: Optimized for mobile use with beautiful, responsive UI
- 🎨 **Context-Aware**: Specify situation type (social media, work, party, personal) for better responses
- 💰 **Subscription Model**: Tiered pricing with free, premium ($5/mo), and pro ($10/mo) plans
- 💾 **Response Library**: Save and manage your favorite responses
- 🎯 **Practice Scenarios**: AI-powered practice sessions with personalized feedback
- 🔄 **Real-time Generation**: Instant response generation with loading states
- 🌐 **Farcaster Integration**: Share responses directly to Farcaster (planned)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **React**: React 19 (required for OnchainKit)
- **Blockchain**: Base (via OnchainKit & Minikit)
- **Styling**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety
- **AI**: OpenAI GPT-4o-mini API
- **Database**: Upstash Redis for data persistence
- **Deployment**: Vercel-ready with environment configuration

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- Upstash Redis account (for data persistence)
- Base wallet (for testing payments)

## 🚀 Getting Started

1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd wittyreply-base-miniapp
   npm install
   ```

2. **Environment Setup**:
   Copy `.env.example` to `.env.local` and add your API keys:
   ```bash
   # Required
   OPENAI_API_KEY=your_openai_api_key_here
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url_here
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token_here

   # Optional (for production Base app)
   NEXT_PUBLIC_BASE_APP_ID=your_base_app_id_here
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Open**: http://localhost:3000

## 📁 Project Structure

```
app/
├── api/                    # API routes
│   ├── generate/          # Response generation endpoint
│   ├── user/              # User management
│   ├── responses/         # Saved responses
│   ├── practice/          # Practice scenarios
│   └── subscription/      # Subscription management
├── components/            # Reusable UI components
│   ├── AppShell.tsx      # Main app layout with wallet
│   ├── ChatInput.tsx     # User input with suggestions
│   ├── ResponseCard.tsx  # Response display with actions
│   ├── StyleSelector.tsx # Style selection component
│   ├── ContextSelector.tsx # Context/situation selector
│   ├── SavedResponses.tsx # Saved responses management
│   ├── PracticeScenarios.tsx # Practice mode component
│   └── SubscriptionGate.tsx # Premium features gate
├── layout.tsx            # Root layout with providers
├── page.tsx             # Main app page with tabs
├── providers.tsx        # OnchainKit provider setup
└── globals.css          # Global styles and theme system

lib/
├── types.ts             # TypeScript interfaces and types
└── utils.ts             # Utility functions and helpers
```

## 🔌 API Documentation

### Response Generation API
**POST** `/api/generate`

Generates witty responses based on user input and preferences.

**Request Body:**
```json
{
  "query": "Why do you always wear sunglasses?",
  "style": "sarcastic",
  "context": "social_media",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "responses": [
    {
      "responseId": "resp_123",
      "originalQuery": "Why do you always wear sunglasses?",
      "generatedText": "Because I'm so bright, I need shade from my own awesomeness.",
      "styleTag": "sarcastic",
      "contextTag": "social_media"
    }
  ]
}
```

### User Management API
**GET** `/api/user?userId=user_123`

Retrieves user profile and subscription information.

**POST** `/api/user`

Creates or updates user profile.

### Saved Responses API
**GET** `/api/responses?userId=user_123`

Retrieves user's saved responses.

**POST** `/api/responses`

Saves a response to user's library.

### Practice Scenarios API
**GET** `/api/practice?userId=user_123&scenarioType=awkward_party`

Retrieves practice session history.

**POST** `/api/practice`

Submits user response for AI feedback.

**PUT** `/api/practice`

Generates a random practice scenario.

### Subscription API
**GET** `/api/subscription?userId=user_123`

Retrieves subscription information.

**POST** `/api/subscription`

Creates subscription payment intent.

## 🎨 Design System

### Colors
- **Background**: `hsl(230, 20%, 12%)` - Dark navy
- **Accent**: `hsl(180, 60%, 45%)` - Teal/cyan
- **Primary**: `hsl(240, 70%, 50%)` - Blue
- **Surface**: `hsl(230, 20%, 18%)` - Darker navy
- **Text**: Light colors for contrast

### Typography
- **Display**: 5xl, extrabold for headings
- **Heading**: 2xl, semibold for section headers
- **Body**: base, leading-7 for content
- **Small**: sm for metadata

### Components
- **Glass Card**: Semi-transparent cards with blur effects
- **Response Cards**: Interactive cards with hover states
- **Gradient Buttons**: Eye-catching call-to-action buttons
- **Segmented Controls**: Style and context selectors

## 💰 Business Model

### Subscription Tiers

**Free Tier**
- 3 responses per day
- Basic styles only
- Limited saved responses (10)

**Premium ($5/month)**
- Unlimited responses
- All response styles
- 100 saved responses
- Practice scenarios with AI feedback

**Pro ($10/month)**
- Everything in Premium
- Persona training exercises
- 1000 saved responses
- Priority support
- Exclusive content

### Payment Integration
- Uses Base wallet for payments
- Coinbase Commerce integration (planned)
- Subscription management via smart contracts

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**:
   - Import your GitHub repository to Vercel
   - Configure environment variables in Vercel dashboard

2. **Environment Variables**:
   ```
   OPENAI_API_KEY=sk-...
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...
   NEXT_PUBLIC_BASE_APP_ID=your_app_id
   ```

3. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Node Version: 18+

4. **Deploy**:
   ```bash
   vercel --prod
   ```

### Base App Configuration

For production Base Mini App deployment:

1. **Register App**: Register your app on Base
2. **Configure Minikit**: Set up Base Minikit integration
3. **Smart Contracts**: Deploy subscription management contracts
4. **Frame Integration**: Configure Farcaster frames for sharing

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper TypeScript types
4. Test thoroughly on mobile and desktop
5. Submit a pull request with detailed description

## 📄 License

MIT License - see LICENSE file for details.

## 🔒 Security

- API keys stored securely in environment variables
- Rate limiting implemented for free tier users
- Input validation on all API endpoints
- Redis data encryption for sensitive user data

## 📞 Support

For support or questions:
- Create an issue on GitHub
- Contact the development team
- Check the API documentation for integration help
