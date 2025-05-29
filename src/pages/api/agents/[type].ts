import { NextApiRequest, NextApiResponse } from 'next';
import { AgentType } from '../../../lib/types';
import { MathAgent } from '../../../agents/mathAgent';
import { PhysicsAgent } from '../../../agents/physicsAgent';
import { HistoryAgent } from '../../../agents/historyAgent';
import { GeminiClient } from '../../../lib/geminiClient';

// Initialize the Gemini client with API key
let geminiClient: GeminiClient;
let mathAgent: MathAgent;
let physicsAgent: PhysicsAgent;
let historyAgent: HistoryAgent;

try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  geminiClient = new GeminiClient(apiKey);
  mathAgent = new MathAgent(geminiClient);
  physicsAgent = new PhysicsAgent(geminiClient);
  historyAgent = new HistoryAgent(geminiClient);
} catch (error) {
  console.error('Failed to initialize Gemini client:', error);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type } = req.query;
  const { input } = req.body;

  if (!type || !input) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!geminiClient || !mathAgent || !physicsAgent || !historyAgent) {
    return res.status(500).json({ 
      error: 'AI service is not properly configured. Please check the server configuration.' 
    });
  }

  try {
    let response;
    
    switch (type) {
      case 'math':
        response = await mathAgent.solveMath(input);
        break;
      case 'physics':
        response = await physicsAgent.explainPhysics(input);
        break;
      case 'history':
        response = await historyAgent.explainHistory(input);
        break;
      default:
        return res.status(400).json({ error: 'Invalid agent type' });
    }

    return res.status(200).json({ response });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
} 