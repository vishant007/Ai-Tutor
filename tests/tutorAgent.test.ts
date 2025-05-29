import { TutorAgent } from '@/agents/tutorAgent';
import { GeminiClient } from '@/lib/geminiClient';
import { MathAgent } from '@/agents/mathAgent';
import { PhysicsAgent } from '@/agents/physicsAgent';

// Mock the dependencies
jest.mock('@/lib/geminiClient');
jest.mock('@/agents/mathAgent');
jest.mock('@/agents/physicsAgent');

describe('TutorAgent', () => {
  let tutorAgent: TutorAgent;
  let mockGeminiClient: jest.Mocked<GeminiClient>;
  let mockMathAgent: jest.Mocked<MathAgent>;
  let mockPhysicsAgent: jest.Mocked<PhysicsAgent>;

  beforeEach(() => {
    mockGeminiClient = new GeminiClient('test-key') as jest.Mocked<GeminiClient>;
    mockMathAgent = new MathAgent(mockGeminiClient) as jest.Mocked<MathAgent>;
    mockPhysicsAgent = new PhysicsAgent(mockGeminiClient) as jest.Mocked<PhysicsAgent>;
    tutorAgent = new TutorAgent(mockGeminiClient);
  });

  describe('handleQuery', () => {
    it('should route math queries to MathAgent', async () => {
      const query = 'What is 2 + 2?';
      const mockResponse = 'The result is 4';

      mockGeminiClient.classifyIntent.mockResolvedValue({ text: 'MATH' });
      mockMathAgent.solveMath.mockResolvedValue(mockResponse);

      const result = await tutorAgent.handleQuery(query);

      expect(result).toBe(mockResponse);
      expect(mockMathAgent.solveMath).toHaveBeenCalledWith(query);
    });

    it('should route physics queries to PhysicsAgent', async () => {
      const query = 'What is the speed of light?';
      const mockResponse = 'The speed of light is 299,792,458 m/s';

      mockGeminiClient.classifyIntent.mockResolvedValue({ text: 'PHYSICS' });
      mockPhysicsAgent.explainPhysics.mockResolvedValue(mockResponse);

      const result = await tutorAgent.handleQuery(query);

      expect(result).toBe(mockResponse);
      expect(mockPhysicsAgent.explainPhysics).toHaveBeenCalledWith(query);
    });

    it('should handle general queries', async () => {
      const query = 'What is the capital of France?';
      const mockResponse = 'The capital of France is Paris';

      mockGeminiClient.classifyIntent.mockResolvedValue({ text: 'OTHER' });
      mockGeminiClient.generateText.mockResolvedValue({ text: mockResponse });

      const result = await tutorAgent.handleQuery(query);

      expect(result).toBe(mockResponse);
      expect(mockGeminiClient.generateText).toHaveBeenCalledWith(
        expect.stringContaining(query)
      );
    });

    it('should handle empty queries', async () => {
      await expect(tutorAgent.handleQuery('')).rejects.toThrow('Query cannot be empty');
    });

    it('should handle classification errors', async () => {
      const query = 'What is 2 + 2?';
      const error = new Error('Classification failed');

      mockGeminiClient.classifyIntent.mockRejectedValue(error);

      await expect(tutorAgent.handleQuery(query)).rejects.toThrow('Tutor agent error');
    });
  });
}); 