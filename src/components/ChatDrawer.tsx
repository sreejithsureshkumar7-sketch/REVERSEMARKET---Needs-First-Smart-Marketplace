import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { Offer, Requirement } from '../types';
import { X, Send, ShieldCheck, CheckCheck, Clock } from 'lucide-react';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetProviderId?: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  targetProviderId,
}) => {
  const {
    currentUser,
    users,
    requirements,
    selectedRequirementId,
    chatMessages,
    sendChatMessage,
  } = useMarket();

  const [inputText, setInputText] = useState('');
  const [activeProviderId, setActiveProviderId] = useState<string>(
    targetProviderId || 'user_provider_b'
  );

  if (!isOpen) return null;

  const currentReq = requirements.find(r => r.id === selectedRequirementId);
  const activeProvider = users.find(u => u.id === activeProviderId);

  // Filter messages for this conversation
  const conversation = chatMessages.filter(
    m =>
      m.requirementId === selectedRequirementId &&
      m.providerId === activeProviderId
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentReq) return;
    sendChatMessage(currentReq.id, activeProviderId, inputText);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-700/80 shadow-2xl flex flex-col h-full text-slate-100">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={activeProvider?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
                alt={activeProvider?.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-semibold text-white text-sm">{activeProvider?.name || 'Provider'}</h3>
                {activeProvider?.providerStats?.verified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {currentReq ? currentReq.title.slice(0, 30) + '...' : 'Direct Inquiry'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="px-5 py-2 bg-indigo-950/30 border-b border-indigo-900/30 text-[11px] text-indigo-300 flex items-center justify-between">
          <span>🔒 Shortlisted Verified Provider Channel</span>
          <span className="text-[10px] text-indigo-400 flex items-center space-x-1">
            <Clock className="w-3 h-3 inline mr-0.5" />
            avg 12m reply
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {conversation.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <p className="text-xs">No prior messages. Ask questions regarding project timeline, milestones, or technical stack!</p>
            </div>
          ) : (
            conversation.map(msg => {
              const isMe = msg.senderRole === currentUser.role;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-1 px-1">{msg.senderName}</span>
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1 flex items-center space-x-1">
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <CheckCheck className="w-3 h-3 text-indigo-400 inline" />}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Message ${activeProvider?.name || 'provider'}...`}
              className="flex-1 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
