export type AgentType = 'math' | 'physics' | 'history';

export interface AgentResponse {
  response: string;
  error?: string;
}

export interface AgentRequest {
  input: string;
} 