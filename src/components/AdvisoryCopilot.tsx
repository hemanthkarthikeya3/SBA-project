import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, FileText, ExternalLink, Loader2, Bot, User } from 'lucide-react';
import { ChatMessage, Citation, ClientProfile } from '../types';

interface AdvisoryCopilotProps {
  client: ClientProfile;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onOpenCitation: (citation: Citation) => void;
}

export const AdvisoryCopilot: React.FC<AdvisoryCopilotProps> = ({
  client,
  messages,
  onSendMessage,
  isLoading,
  onOpenCitation,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  // Extract latest dynamic follow-up chips from the last copilot message, or fallback to sensible defaults
  const latestCopilotMsg = [...messages].reverse().find((m) => m.sender === 'copilot');
  const dynamicFollowUps = latestCopilotMsg?.suggestedFollowUps || [
    `Assess ${client.name} credit policy fit`,
    'Analyze overdue AR aging schedule',
    'Simulate Q3 revenue stress test',
    'Draft consultative review agenda',
  ];

  return (
    <aside
      id="advisory-copilot-sidebar"
      className="w-full lg:w-[380px] bg-white border border-[#c4c6cf]/60 rounded flex flex-col shrink-0 h-[680px] lg:h-[calc(100vh-6.5rem)] lg:sticky lg:top-20 shadow-xs"
    >
      {/* Header */}
      <div className="p-3.5 border-b border-[#c4c6cf]/60 flex items-center justify-between bg-[#f1f4f6] rounded-t">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#1960a3] text-white flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#002045]">Advisory Copilot</h3>
            <span className="text-[10px] text-gray-500 font-mono">Grounded on {client.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#74777f]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-mono text-emerald-800 font-medium">Gemini 2.5 Active</span>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs md:text-sm bg-white">
        {messages.map((msg) => {
          const isCopilot = msg.sender === 'copilot';
          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 ${isCopilot ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-[#74777f] px-1">
                {isCopilot ? (
                  <>
                    <Bot className="w-3 h-3 text-[#1960a3]" />
                    <span>Copilot • {msg.timestamp}</span>
                  </>
                ) : (
                  <>
                    <span>You • {msg.timestamp}</span>
                    <User className="w-3 h-3 text-[#002045]" />
                  </>
                )}
              </div>
              <div
                className={`p-3.5 rounded-xl max-w-[94%] leading-relaxed ${
                  isCopilot
                    ? 'bg-[#f1f4f6] text-[#181c1e] rounded-tl-none border border-[#c4c6cf]/30'
                    : 'bg-[#002045] text-white rounded-tr-none shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-xs md:text-sm space-y-2">
                  {msg.text.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Grounded Document / Ledger Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-gray-200/80 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase font-semibold text-[#74777f] block">
                      Grounded Ledger & Policy Sources:
                    </span>
                    {msg.citations.map((cite) => (
                      <button
                        key={cite.id}
                        onClick={() => onOpenCitation(cite)}
                        className="w-full text-left text-xs text-[#1960a3] hover:text-[#002045] font-medium flex items-center justify-between p-1.5 rounded bg-white border border-[#c4c6cf]/50 hover:bg-blue-50/50 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <FileText className="w-3.5 h-3.5 shrink-0 text-[#1960a3]" />
                          <span className="truncate">{cite.title}</span>
                        </span>
                        <ExternalLink className="w-3 h-3 shrink-0 ml-1 opacity-70" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#1960a3] bg-[#7db6ff]/10 p-3 rounded-lg w-fit border border-[#7db6ff]/30 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Auditing ledger records & underwriting policies...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-Up Prompt Chips */}
      <div className="px-3 pt-2 pb-1 border-t border-[#c4c6cf]/30 bg-[#f7fafc]">
        <div className="text-[10px] font-mono text-[#74777f] uppercase mb-1">
          AI Suggested Next Queries:
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {dynamicFollowUps.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(chip)}
              disabled={isLoading}
              className="whitespace-nowrap px-2.5 py-1 bg-white border border-[#c4c6cf]/80 rounded text-[11px] text-[#43474e] hover:text-[#002045] hover:border-[#1960a3] hover:bg-[#ebeef0] transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[#c4c6cf]/60 bg-[#f7fafc] rounded-b">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask about ${client.name}'s cash flow or policy limits...`}
            disabled={isLoading}
            className="w-full pl-3 pr-10 py-2 border border-[#c4c6cf] rounded focus:ring-2 focus:ring-[#1960a3] focus:border-[#1960a3] outline-none text-xs md:text-sm bg-white text-[#181c1e] placeholder-[#74777f]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-1.5 p-1.5 text-[#1960a3] hover:text-[#002045] disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </aside>
  );
};
