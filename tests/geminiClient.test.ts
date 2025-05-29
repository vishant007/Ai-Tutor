import { GeminiClient } from '@/lib/geminiClient';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the Google Generative AI SDK
jest.mock('@google/generative-ai');

describe('GeminiClient', () => {
  let geminiClient: GeminiClient;
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    jest.clearAllMocks();
    geminiClient = new GeminiClient(mockApiKey);
  });

  describe('generateText', () => {
    it('should generate text successfully', async () => {
      const prompt = 'Test prompt';
      const mockResponse = { text: 'Generated response' };

      // Mock the SDK's response
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: { text: mockResponse.text }
      });

      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: () => ({
          generateContent: mockGenerateContent
        })
      }));

      const result = await geminiClient.generateText(prompt);

      expect(result).toEqual(mockResponse);
      expect(mockGenerateContent).toHaveBeenCalledWith(prompt);
    });

    it('should handle API errors', async () => {
      const prompt = 'Test prompt';
      const error = new Error('API Error');

      // Mock the SDK's error
      const mockGenerateContent = jest.fn().mockRejectedValue(error);

      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: () => ({
          generateContent: mockGenerateContent
        })
      }));

      const result = await geminiClient.generateText(prompt);

      expect(result).toEqual({
        text: '',
        error: 'API Error'
      });
    });

    it('should retry on failure with exponential backoff', async () => {
      const prompt = 'Test prompt';
      const mockResponse = { text: 'Generated response' };

      // Mock the SDK to fail twice then succeed
      const mockGenerateContent = jest.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValueOnce({
          response: { text: mockResponse.text }
        });

      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: () => ({
          generateContent: mockGenerateContent
        })
      }));

      const result = await geminiClient.generateText(prompt);

      expect(result).toEqual(mockResponse);
      expect(mockGenerateContent).toHaveBeenCalledTimes(3);
    });
  });

  describe('classifyIntent', () => {
    it('should classify intent correctly', async () => {
      const query = 'What is 2 + 2?';
      const mockResponse = { text: 'MATH' };

      // Mock the SDK's response
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: { text: mockResponse.text }
      });

      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: () => ({
          generateContent: mockGenerateContent
        })
      }));

      const result = await geminiClient.classifyIntent(query);

      expect(result).toEqual(mockResponse);
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.stringContaining('Classify the following question')
      );
    });

    it('should handle classification errors', async () => {
      const query = 'What is 2 + 2?';
      const error = new Error('Classification failed');

      // Mock the SDK's error
      const mockGenerateContent = jest.fn().mockRejectedValue(error);

      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: () => ({
          generateContent: mockGenerateContent
        })
      }));

      const result = await geminiClient.classifyIntent(query);

      expect(result).toEqual({
        text: '',
        error: 'Classification failed'
      });
    });
  });
}); 