import { PhysicsAgent } from '@/agents/physicsAgent';
import { GeminiClient } from '@/lib/geminiClient';
import { Constants } from '@/tools/constants';

// Mock the GeminiClient
jest.mock('@/lib/geminiClient');

describe('PhysicsAgent', () => {
  let physicsAgent: PhysicsAgent;
  let mockGeminiClient: jest.Mocked<GeminiClient>;

  beforeEach(() => {
    mockGeminiClient = new GeminiClient('test-key') as jest.Mocked<GeminiClient>;
    physicsAgent = new PhysicsAgent(mockGeminiClient);
  });

  describe('explainPhysics', () => {
    it('should include relevant constants in the explanation', async () => {
      const query = 'What is the speed of light?';
      const mockResponse = { text: 'The speed of light is 299,792,458 m/s' };

      mockGeminiClient.generateText.mockResolvedValue(mockResponse);

      const result = await physicsAgent.explainPhysics(query);

      expect(result).toContain('299,792,458 m/s');
      expect(mockGeminiClient.generateText).toHaveBeenCalledWith(
        expect.stringContaining('speed of light')
      );
    });

    it('should handle queries without relevant constants', async () => {
      const query = 'What is quantum mechanics?';
      const mockResponse = { text: 'Quantum mechanics is a fundamental theory in physics' };

      mockGeminiClient.generateText.mockResolvedValue(mockResponse);

      const result = await physicsAgent.explainPhysics(query);

      expect(result).toBe(mockResponse.text);
      expect(mockGeminiClient.generateText).toHaveBeenCalledWith(
        expect.stringContaining('quantum mechanics')
      );
    });

    it('should handle API errors gracefully', async () => {
      const query = 'What is the speed of light?';
      const error = new Error('API Error');

      mockGeminiClient.generateText.mockRejectedValue(error);

      await expect(physicsAgent.explainPhysics(query)).rejects.toThrow('Physics agent error');
    });
  });
}); 