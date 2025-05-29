import { NextApiRequest, NextApiResponse } from 'next';
import rateLimit from 'express-rate-limit';
import { GeminiClient } from '@/lib/geminiClient';
import { TutorAgent } from '@/agents/tutorAgent';

// Configure rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: { error: 'Too many requests, please try again later.' }
});

// Initialize Gemini client and Tutor agent
const geminiClient = new GeminiClient(process.env.GEMINI_API_KEY || '');
const tutorAgent = new TutorAgent(geminiClient);

// Apply rate limiting middleware
const applyRateLimit = (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise((resolve, reject) => {
    limiter(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Apply rate limiting
    await applyRateLimit(req, res);

    // Validate request body
    const { question } = req.body;
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question is required and must be a non-empty string' });
    }

    // Set cache headers for repeated queries
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

    // Process the query
    const answer = await tutorAgent.handleQuery(question);
    return res.status(200).json({ answer });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
} 