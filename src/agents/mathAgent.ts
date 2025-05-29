import { GeminiClient, GeminiResponse } from '@/lib/geminiClient';
import { Calculator } from '@/tools/calculator';

export class MathAgent {
  private geminiClient: GeminiClient;

  constructor(geminiClient: GeminiClient) {
    this.geminiClient = geminiClient;
  }

  async solveMath(query: string): Promise<string> {
    try {
      // First, try to extract and evaluate any mathematical expressions
      const expression = Calculator.extractExpression(query);
      if (expression) {
        try {
          const result = Calculator.evaluate(expression);
          return `The result of ${expression} is ${result}.`;
        } catch (error) {
          // If calculation fails, continue with Gemini explanation
        }
      }

      // If no expression found or calculation failed, use Gemini for explanation
      const prompt = `
        You are a math tutor. Please explain how to solve the following math problem:
        ${query}
        
        Provide a step-by-step explanation that is clear and easy to understand.
        If the problem involves calculations, show the work.
      `;

      const response = await this.geminiClient.generateText(prompt);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return response.text;
    } catch (error) {
      throw new Error(`Math agent error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 