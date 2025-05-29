import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/query';
import { TutorAgent } from '@/agents/tutorAgent';

// Mock the TutorAgent
jest.mock('@/agents/tutorAgent');

describe('API Query Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle valid math queries', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        question: 'What is 2 + 2?'
      }
    });

    const mockResponse = 'The result is 4';
    (TutorAgent.prototype.handleQuery as jest.Mock).mockResolvedValue(mockResponse);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ answer: mockResponse });
  });

  it('should handle valid physics queries', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        question: 'What is the speed of light?'
      }
    });

    const mockResponse = 'The speed of light is 299,792,458 m/s';
    (TutorAgent.prototype.handleQuery as jest.Mock).mockResolvedValue(mockResponse);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ answer: mockResponse });
  });

  it('should reject non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Method not allowed' });
  });

  it('should reject empty questions', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        question: ''
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Question is required and must be a non-empty string'
    });
  });

  it('should handle server errors', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        question: 'What is 2 + 2?'
      }
    });

    const error = new Error('Server error');
    (TutorAgent.prototype.handleQuery as jest.Mock).mockRejectedValue(error);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Internal server error',
      message: 'Server error'
    });
  });
}); 