import { MathAgent } from '@/agents/mathAgent';
import { GeminiClient } from '@/lib/geminiClient';
import { Calculator } from '@/tools/calculator';

// Mock the dependencies
jest.mock('@/lib/geminiClient');
jest.mock('@/tools/calculator');

describe('MathAgent', () => {
  let mathAgent: MathAgent;
  let mockGeminiClient: jest.Mocked<GeminiClient>;

  beforeEach(() => {
    mockGeminiClient = new GeminiClient('test-key') as jest.Mocked<GeminiClient>;
    mathAgent = new MathAgent(mockGeminiClient);
  });

  describe('solveMath', () => {
    it('should use calculator for simple expressions', async () => {
      const query = 'What is 2 + 2?';
      const expression = '2 + 2';
      const result = 4;

      (Calculator.extractExpression as jest.Mock).mockReturnValue(expression);
      (Calculator.evaluate as jest.Mock).mockReturnValue(result);

      const response = await mathAgent.solveMath(query);

      expect(response).toBe(`The result of ${expression} is ${result}.`);
      expect(Calculator.extractExpression).toHaveBeenCalledWith(query);
      expect(Calculator.evaluate).toHaveBeenCalledWith(expression);
    });

    it('should use Gemini for complex problems', async () => {
      const query = 'How do I solve quadratic equations?';
      const mockResponse = { text: 'To solve a quadratic equation...' };

      (Calculator.extractExpression as jest.Mock).mockReturnValue(null);
      mockGeminiClient.generateText.mockResolvedValue(mockResponse);

      const response = await mathAgent.solveMath(query);

      expect(response).toBe(mockResponse.text);
      expect(mockGeminiClient.generateText).toHaveBeenCalledWith(
        expect.stringContaining('quadratic equations')
      );
    });

    it('should fall back to Gemini if calculator fails', async () => {
      const query = 'What is 2 + 2?';
      const expression = '2 + 2';
      const mockResponse = { text: 'The result is 4' };

      (Calculator.extractExpression as jest.Mock).mockReturnValue(expression);
      (Calculator.evaluate as jest.Mock).mockImplementation(() => {
        throw new Error('Calculation failed');
      });
      mockGeminiClient.generateText.mockResolvedValue(mockResponse);

      const response = await mathAgent.solveMath(query);

      expect(response).toBe(mockResponse.text);
      expect(mockGeminiClient.generateText).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const query = 'What is 2 + 2?';
      const error = new Error('API Error');

      (Calculator.extractExpression as jest.Mock).mockReturnValue(null);
      mockGeminiClient.generateText.mockRejectedValue(error);

      await expect(mathAgent.solveMath(query)).rejects.toThrow('Math agent error');
    });
  });
}); 