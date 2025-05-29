import { GeminiClient } from '@/lib/geminiClient';
import { Constants } from '@/tools/constants';

export class PhysicsAgent {
  private geminiClient: GeminiClient;

  constructor(geminiClient: GeminiClient) {
    this.geminiClient = geminiClient;
  }

  async explainPhysics(query: string): Promise<string> {
    try {
      // First, check if any physics constants are relevant to the query
      const relevantConstants = Constants.findConstantsInText(query);
      let constantsContext = '';

      if (relevantConstants.length > 0) {
        constantsContext = '\nRelevant physics constants:\n' + 
          relevantConstants.map(constant => 
            Constants.formatConstant(constant)
          ).join('\n');
      }

      const prompt = `
        You are a physics tutor. Please explain the following physics concept or problem:
        ${query}
        ${constantsContext}
        
        Provide a clear explanation that:
        1. Uses the relevant constants if applicable
        2. Explains the underlying principles
        3. Shows step-by-step reasoning
        4. Uses appropriate units and scientific notation
        5. Includes real-world examples to illustrate the concepts
        6. Uses analogies where helpful
        7. Highlights key formulas and their applications
        8. Explains the historical context if relevant
        
        Format your response in a clear, structured way with:
        - A brief introduction
        - Main concepts explained with examples
        - Key formulas and their meaning
        - Real-world applications
        - A summary of key points
      `;

      const response = await this.geminiClient.generateText(prompt);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return response.text;
    } catch (error) {
      throw new Error(`Physics agent error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 