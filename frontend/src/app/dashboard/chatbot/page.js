'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import ChatMessage from '@/components/ChatMessage';
import './chatbot.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true })
      .limit(50);

    if (!error && data) {
      setMessages(data.map((msg) => ({ role: msg.role, content: msg.content })));
    }
    setHistoryLoading(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          userId: session.user.id,
        }),
      });

      const data = await response.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'I apologize, I encountered an issue. Please try again.' },
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Please check if the backend server is running.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-header">
        <div className="chatbot-header-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="url(#chatGrad)" strokeWidth="2" />
            <path d="M8 12h8M12 8v8" stroke="url(#chatGrad)" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="chatGrad" x1="0" y1="0" x2="24" y2="24">
                <stop stopColor="#7C3AED" />
                <stop offset="1" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <h2>MediVerse AI Assistant</h2>
          <p>Your personal healthcare chatbot powered by AI</p>
        </div>
      </div>

      <div className="chatbot-messages" id="chat-messages">
        {historyLoading ? (
          <div className="chatbot-empty">
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            <p>Loading chat history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="chatbot-empty">
            <div className="chatbot-empty-icon">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="24" stroke="rgba(124,58,237,0.3)" strokeWidth="2" />
                <path d="M20 28h16M28 20v16" stroke="rgba(124,58,237,0.5)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3>How can I help you today?</h3>
            <p>Ask me anything about your health, medications, or medical records.</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))
        )}

        {loading && (
          <div className="chat-message assistant">
            <div className="chat-avatar" style={{ background: 'rgba(59,130,246,0.2)', color: 'var(--color-secondary-light)' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 10h6M10 7v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="chat-bubble">
              <div className="chat-role">MEDIVERSE AI</div>
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chatbot-input-area" onSubmit={sendMessage} id="chat-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask MediVerse AI about your health..."
          disabled={loading}
          id="chat-input"
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={loading || !input.trim()}
          id="chat-send-btn"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M18 2L9 11M18 2l-6 16-3-7-7-3 16-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  );
}
