import React, { useState } from 'react';
import { analyzeSystemHealth, askAiAssistant } from '../services/geminiService';
import { Sparkles, Activity, MessageSquare, RefreshCw, Send } from 'lucide-react';

const AIInsights: React.FC = () => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState<{role: 'user'|'ai', content: string}[]>([
      {role: 'ai', content: 'Hello! I am your AI Network Assistant. Ask me anything about your VPN infrastructure.'}
  ]);
  const [inputValue, setInputValue] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const result = await analyzeSystemHealth();
      setReport(result);
    } catch (e) {
      setReport("Error generating report. Please check API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
      if(!inputValue.trim()) return;
      const userMsg = inputValue;
      setInputValue('');
      setMessages(prev => [...prev, {role: 'user', content: userMsg}]);
      setChatLoading(true);
      
      const response = await askAiAssistant(userMsg);
      setMessages(prev => [...prev, {role: 'ai', content: response}]);
      setChatLoading(false);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
       <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-purple-600" /> AI System Insights
          </h2>
          <p className="text-slate-500">Leverage Gemini AI to analyze logs and manage your infrastructure.</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Health Report Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-purple-50 to-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <Activity size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Executive Health Report</h3>
                </div>
                <button 
                    onClick={generateReport}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-all"
                >
                   {loading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                   {loading ? 'Analyzing...' : 'Generate Analysis'}
                </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
                {report ? (
                    <div className="prose prose-sm max-w-none prose-headings:text-slate-800 prose-p:text-slate-600">
                        <pre className="whitespace-pre-wrap font-sans text-sm">{report}</pre>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <Sparkles size={48} className="mb-4 opacity-20" />
                        <p>Click "Generate Analysis" to scan system logs and metrics.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Chat Assistant Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
             <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <MessageSquare size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Ops Assistant</h3>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            m.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                        }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {chatLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask about active users, load, or alerts..."
                        className="flex-1 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                    <button 
                        onClick={handleSendMessage}
                        disabled={chatLoading || !inputValue.trim()}
                        className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;