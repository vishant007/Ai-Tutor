import { 
  GoogleGenerativeAI, 
  GenerativeModel
} from '@google/generative-ai';

interface Model {
  name: string;
  displayName: string;
  description: string;
  supportedGenerationMethods?: string[];
  rateLimit: {
    rpm: number;
    rpd: number;
  };
}

interface ListModelsResponse {
  models: Model[];
}

export interface GeminiResponse {
  text: string;
  error?: string;
}

export class GeminiClient {
  private model!: GenerativeModel;
  private maxRetries: number = 3;
  private baseDelay: number = 1000;
  private readonly FALLBACK_MODEL = 'chat-bison-001';
  
  // Rate limiting
  private requestCount: number = 0;
  private lastResetTime: number = Date.now();
  private dailyRequestCount: number = 0;
  private lastDailyReset: number = Date.now();
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue: boolean = false;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.initializeModel(apiKey);
  }

  private async initializeModel(apiKey: string): Promise<void> {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const models = await this.listAvailableModels(genAI);
      const selectedModel = this.selectModel(models);
      
      console.log(`Selected model: ${selectedModel.name} (${selectedModel.displayName})`);
      console.log(`Rate limits: ${selectedModel.rateLimit.rpm} RPM, ${selectedModel.rateLimit.rpd} RPD`);
      
      this.model = genAI.getGenerativeModel({ 
        model: selectedModel.name,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });
    } catch (error) {
      console.error('Failed to initialize model:', error);
      throw new Error('Failed to initialize AI model');
    }
  }

  private async listAvailableModels(genAI: GoogleGenerativeAI): Promise<Model[]> {
    try {
      return [
        {
          name: 'gemini-2.0-flash',
          displayName: 'Gemini 2.0 Flash',
          description: 'Latest Gemini model optimized for speed and efficiency',
          supportedGenerationMethods: ['generateContent'],
          rateLimit: {
            rpm: 15,  // More conservative limit for the free tier
            rpd: 1500
          }
        },
        {
          name: 'gemini-pro',
          displayName: 'Gemini Pro',
          description: 'Latest Gemini model for text generation',
          supportedGenerationMethods: ['generateContent'],
          rateLimit: {
            rpm: 60,
            rpd: 1500
          }
        },
        {
          name: 'gemini-pro-vision',
          displayName: 'Gemini Pro Vision',
          description: 'Latest Gemini model for vision and text',
          supportedGenerationMethods: ['generateContent'],
          rateLimit: {
            rpm: 15,
            rpd: 1500
          }
        }
      ];
    } catch (error) {
      console.error('Failed to list models:', error);
      return [];
    }
  }

  private selectModel(models: Model[]): Model {
    // Try to find gemini-2.0-flash first
    const flashModel = models.find(model => model.name === 'gemini-2.0-flash');
    if (flashModel) {
      return flashModel;
    }

    // Fallback to other models that support generateContent
    const contentModel = models.find(model => 
      model.supportedGenerationMethods?.includes('generateContent')
    );

    if (contentModel) {
      return contentModel;
    }

    // Fallback to chat-bison-001 if no suitable model found
    return {
      name: this.FALLBACK_MODEL,
      displayName: 'Chat Bison',
      description: 'Fallback model for text generation',
      supportedGenerationMethods: ['generateContent'],
      rateLimit: {
        rpm: 60,
        rpd: 1500
      }
    };
  }

  private async checkRateLimits(): Promise<void> {
    const now = Date.now();
    const oneMinute = 60 * 1000;
    const oneDay = 24 * 60 * 60 * 1000;

    // Reset counters if needed
    if (now - this.lastResetTime >= oneMinute) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }

    if (now - this.lastDailyReset >= oneDay) {
      this.dailyRequestCount = 0;
      this.lastDailyReset = now;
    }

    // Check if we've hit the rate limits
    if (this.requestCount >= 60) { // Using the more conservative limit
      const waitTime = oneMinute - (now - this.lastResetTime);
      await this.delay(waitTime);
      this.requestCount = 0;
      this.lastResetTime = Date.now();
    }

    if (this.dailyRequestCount >= 1500) {
      const waitTime = oneDay - (now - this.lastDailyReset);
      await this.delay(waitTime);
      this.dailyRequestCount = 0;
      this.lastDailyReset = Date.now();
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retryCount: number = 0
  ): Promise<T> {
    try {
      await this.checkRateLimits();
      this.requestCount++;
      this.dailyRequestCount++;
      return await operation();
    } catch (error) {
      if (retryCount >= this.maxRetries) {
        throw error;
      }

      const delay = this.baseDelay * Math.pow(2, retryCount);
      await this.delay(delay);
      return this.retryWithBackoff(operation, retryCount + 1);
    }
  }

  async generateText(prompt: string): Promise<GeminiResponse> {
    try {
      const result = await this.retryWithBackoff(async () => {
        const response = await this.model.generateContent(prompt);
        const text = response.response.text();
        if (!text) {
          throw new Error('Empty response from AI model');
        }
        return text;
      });

      return { text: result };
    } catch (error) {
      console.error('AI model error:', error);
      return {
        text: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async classifyIntent(prompt: string): Promise<GeminiResponse> {
    const classificationPrompt = `
      Classify the following question into one of these categories:
      - MATH: For questions about mathematics, calculations, or numerical problems
      - PHYSICS: For questions about physics concepts, formulas, or physical phenomena
      - OTHER: For any other type of question
      
      Question: ${prompt}
      
      Respond with only one word: MATH, PHYSICS, or OTHER
    `;

    return this.generateText(classificationPrompt);
  }
} 