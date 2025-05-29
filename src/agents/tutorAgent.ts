import { GeminiClient } from '@/lib/geminiClient';
import { MathAgent } from './mathAgent';
import { PhysicsAgent } from './physicsAgent';
import { HistoryAgent } from './historyAgent';

export type QueryIntent = 'MATH' | 'PHYSICS' | 'HISTORY' | 'OTHER';

export class TutorAgent {
  private geminiClient: GeminiClient;
  private mathAgent: MathAgent;
  private physicsAgent: PhysicsAgent;
  private historyAgent: HistoryAgent;

  constructor(geminiClient: GeminiClient) {
    this.geminiClient = geminiClient;
    this.mathAgent = new MathAgent(geminiClient);
    this.physicsAgent = new PhysicsAgent(geminiClient);
    this.historyAgent = new HistoryAgent(geminiClient);
  }

  private async classifyIntent(query: string): Promise<QueryIntent> {
    const response = await this.geminiClient.classifyIntent(query);
    
    if (response.error) {
      throw new Error(`Intent classification failed: ${response.error}`);
    }

    const intent = response.text.trim().toUpperCase() as QueryIntent;
    return ['MATH', 'PHYSICS', 'HISTORY', 'OTHER'].includes(intent) ? intent : 'OTHER';
  }

  async handleQuery(query: string): Promise<string> {
    try {
      if (!query || query.trim().length === 0) {
        throw new Error('Query cannot be empty');
      }

      const intent = await this.classifyIntent(query);

      switch (intent) {
        case 'MATH':
          return this.mathAgent.solveMath(query);
        case 'PHYSICS':
          return this.physicsAgent.explainPhysics(query);
        case 'HISTORY':
          return this.historyAgent.explainHistory(query);
        default:
          return this.handleGeneralQuery(query);
      }
    } catch (error) {
      throw new Error(`Tutor agent error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async handleGeneralQuery(query: string): Promise<string> {
    const prompt = `
      You are a helpful tutor. Please provide a clear and educational response to:
      ${query}
      
      Focus on explaining concepts clearly and providing helpful examples if relevant.
    `;

    const response = await this.geminiClient.generateText(prompt);
    
    if (response.error) {
      throw new Error(response.error);
    }

    return response.text;
  }
} 