import { useState, useRef, useEffect } from 'react';
import { AgentType } from '../lib/types';

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('math');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/agents/${selectedAgent}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Tutor</h1>
          <p className="text-gray-600 text-lg">Your personal tutor for math and physics</p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Tutor</label>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setSelectedAgent('math')}
                className={`flex-1 min-w-[200px] px-6 py-3 rounded-xl transition-all duration-200 ${
                  selectedAgent === 'math'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg font-medium">Math Tutor</span>
                <p className="text-sm opacity-80">Algebra, Calculus, Statistics</p>
              </button>
              <button
                onClick={() => setSelectedAgent('physics')}
                className={`flex-1 min-w-[200px] px-6 py-3 rounded-xl transition-all duration-200 ${
                  selectedAgent === 'physics'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg font-medium">Physics Tutor</span>
                <p className="text-sm opacity-80">Mechanics, Thermodynamics, Waves</p>
              </button>
              <button
                onClick={() => setSelectedAgent('history')}
                className={`flex-1 min-w-[200px] px-6 py-3 rounded-xl transition-all duration-200 ${
                  selectedAgent === 'history'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg font-medium">History Tutor</span>
                <p className="text-sm opacity-80">Ancient, Medieval, Modern India</p>
              </button>
            </div>
          </div>

          <div className="mb-6 h-[500px] overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-white text-gray-800 shadow-lg shadow-gray-200'
                  }`}
                >
                  <div className="prose prose-sm sm:prose-base max-w-none">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-gray-500">
                <div className="inline-flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your question..."
              className="flex-1 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-200"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 