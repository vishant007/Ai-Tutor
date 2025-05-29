# AI Tutor Backend

A Next.js 14-based multi-agent tutoring system that leverages Google's Gemini API to provide intelligent, specialized responses to educational queries. The system implements a sophisticated multi-agent architecture with specialized tutors for different subjects, optimized response handling, and robust error management.

## Core Features

### Multi-Agent Architecture
- 🤖 **Tutor Agent**: Main orchestrator that classifies queries and delegates to specialized agents
- 🧮 **Math Agent**: Handles mathematical queries with built-in calculator integration
- 📚 **Physics Agent**: Specialized in physics concepts with integrated constants database
- 🏛️ **History Agent**: Expert in Indian history with comprehensive coverage of different periods
- 🔄 **Intent Classification**: Smart query routing using Gemini's classification capabilities

### Optimization & Performance
- ⚡ **Model Selection**: Dynamic model selection based on availability and capabilities
- 🔄 **Retry Mechanism**: Exponential backoff for API failures
- 🚦 **Rate Limiting**: Configurable request throttling
- 📊 **Request Queue**: Efficient request queuing system
- 🔍 **Caching**: Response caching for frequently asked questions

### Security & Reliability
- 🔒 **API Key Management**: Secure handling of Gemini API keys
- 🛡️ **Rate Limiting**: Protection against abuse
- ⚠️ **Error Handling**: Comprehensive error management
- ✅ **Input Validation**: Strict input validation and sanitization

## Tech Stack

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with responsive design
- **State Management**: React Hooks
- **Math Rendering**: KaTeX for mathematical expressions

### Backend
- **Runtime**: Node.js
- **API Framework**: Next.js API Routes
- **AI Integration**: Google Gemini API
- **Rate Limiting**: Express Rate Limit
- **Error Handling**: Custom error middleware

### Development Tools
- **Package Manager**: npm/yarn
- **Type Checking**: TypeScript
- **Code Quality**: ESLint
- **Testing**: Jest
- **Version Control**: Git
- **CI/CD**: GitHub Actions

### Infrastructure
- **Hosting**: Vercel
- **Environment Variables**: Vercel Environment Config
- **API Security**: CORS, Rate Limiting, Security Headers
- **Monitoring**: Vercel Analytics

### Dependencies
```json
{
  "dependencies": {
    "@google/generative-ai": "^0.2.0",
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "katex": "^0.16.22",
    "express-rate-limit": "^7.1.5"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "jest": "^29.7.0",
    "eslint": "^8.56.0",
    "@types/react": "^18.3.23",
    "@types/node": "^20.17.52"
  }
}
```

## Technical Implementation

### Agent System Architecture
1. **Tutor Agent (Orchestrator)**
   - Implements query classification using Gemini
   - Routes queries to specialized agents
   - Handles general queries directly
   - Manages error states and fallbacks

2. **Math Agent**
   - Two-tier response system:
     - Direct calculation for simple expressions
     - Gemini-powered explanations for complex problems
   - Built-in calculator integration
   - Step-by-step solution generation

3. **Physics Agent**
   - Context-aware responses with physics constants
   - Structured explanation format
   - Real-world examples and analogies
   - Historical context integration

4. **History Agent**
   - Comprehensive coverage of Indian history:
     - Ancient period
     - Medieval period
     - Modern history
   - Structured responses with:
     - Historical context and background
     - Key events and figures
     - Significance and impact
     - Cultural and social aspects
   - Focus on:
     - Historical accuracy
     - Chronological presentation
     - Cultural sensitivity
     - Multiple perspectives
     - Broader historical themes

### Gemini API Integration
- **Model Selection Strategy**
  - Primary: gemini-2.0-flash (optimized for speed)
  - Fallback: gemini-pro (general purpose)
  - Vision capabilities: gemini-pro-vision
- **Response Optimization**
  - Temperature: 0.7 (balanced creativity/accuracy)
  - Top-K: 40 (diverse responses)
  - Top-P: 0.95 (controlled randomness)
  - Max Output Tokens: 1024 (comprehensive answers)

### Performance Optimizations
1. **Request Management**
   - Queue-based request handling
   - Rate limit compliance
   - Retry with exponential backoff
   - Request deduplication

2. **Response Processing**
   - Structured prompt engineering
   - Context-aware responses
   - Efficient error handling
   - Response validation

## Setup & Deployment

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key

### Environment Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-tutor.git
   cd ai-tutor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Required variables:
   ```
   GEMINI_API_KEY=your_api_key_here
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

### Development
```bash
npm run dev
```
API available at `http://localhost:3000/api/query`

### Testing
```bash
npm test        # Run test suite
npm run test:watch  # Watch mode
```

## API Usage

### Query Endpoint
```bash
POST /api/query
Content-Type: application/json

{
  "question": "What is the speed of light?"
}
```

### Agent-Specific Endpoints
```bash
POST /api/agents/math
POST /api/agents/physics
POST /api/agents/history
```

## Project Structure
```
src/
├── agents/
│   ├── tutorAgent.ts    # Main orchestrator
│   ├── mathAgent.ts     # Math-specific agent
│   ├── physicsAgent.ts  # Physics-specific agent
│   └── historyAgent.ts  # History-specific agent
├── lib/
│   ├── geminiClient.ts  # Gemini API integration
│   └── types.ts         # Type definitions
├── pages/
│   ├── api/            # API routes
│   └── index.tsx       # Main UI
└── tools/              # Utility tools and helpers
```

## Example Queries

### Math
- "Solve the quadratic equation x² + 5x + 6 = 0"
- "What is the derivative of sin(x)?"

### Physics
- "Explain the concept of relativity"
- "What is the relationship between force and acceleration?"

### History
- "Tell me about the Indus Valley Civilization"
- "What were the key events of the Indian Independence Movement?"
- "Explain the significance of the Gupta Empire"
- "What were the major achievements of the Mauryan Empire?"

