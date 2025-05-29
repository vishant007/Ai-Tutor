import { GeminiClient } from '@/lib/geminiClient';

export class HistoryAgent {
  private geminiClient: GeminiClient;

  constructor(geminiClient: GeminiClient) {
    this.geminiClient = geminiClient;
  }

  async explainHistory(query: string): Promise<string> {
    try {
      const prompt = `
        You are an expert in Indian history. Please provide a detailed and accurate response to:
        ${query}
        
        Structure your response to include:
        1. Historical context and background
        2. Key events and figures involved
        3. Significance and impact
        4. Relevant dates and periods
        5. Cultural and social aspects if relevant
        
        Focus on:
        - Accuracy of historical facts
        - Clear chronological presentation
        - Cultural sensitivity
        - Multiple perspectives where relevant
        - Connection to broader historical themes
        
        Format your response in a clear, structured way with:
        - A brief introduction
        - Main historical narrative
        - Key figures and their roles
        - Impact and significance
        - A summary of key points
      `;

      const response = await this.geminiClient.generateText(prompt);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return response.text;
    } catch (error) {
      throw new Error(`History agent error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 