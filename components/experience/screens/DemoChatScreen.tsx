'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { AIAgent } from '@/types/aiAgent';
import { DemoChatMessage } from '@/types/demoChat';
import { getAgentGreeting } from '@/services/demoChatEngine';
import { sendDemoMessage, saveDemoMessageDirect } from '@/services/demoChatService';
import { ArrowLeft, ArrowRight, Lock, Paperclip, Send, Sparkles } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface DemoChatScreenProps {
  agent: AIAgent;
  businessType?: string | null;
  businessDescription?: string | null;
  selectedNeeds?: string[];
  sessionId?: string | null;
  messages: DemoChatMessage[];
  onSendMessage: (msg: DemoChatMessage) => void;
  onBack: () => void;
  onCompleteDemo: () => void;
}

// Sidebar capability icons
function SidebarIcon({ type }: { type: string }) {
  switch (type) {
    case 'grad':
    case 'grad_cap':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    case 'doc':
    case 'chat':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      );
    case 'dollar':
    case 'funnel':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      );
    case 'calendar':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
          <path d="M8 2v4" />
          <path d="M16 2v4" />
        </svg>
      );
    case 'user':
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
  }
}

export default function DemoChatScreen({
  agent,
  businessType,
  businessDescription,
  selectedNeeds = [],
  sessionId,
  messages,
  onSendMessage,
  onBack,
  onCompleteDemo,
}: DemoChatScreenProps) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Suggested prompts from current agent
  const suggestedPrompts = agent.suggestedPrompts && agent.suggestedPrompts.length > 0
    ? agent.suggestedPrompts
    : [
        'Tell me how you can help my business',
        'What services do you offer?',
        'Can I schedule an appointment?',
        'How do you capture leads?',
      ];

  // Sidebar capabilities list based on agent
  const sidebarCapabilities = (agent.detailedCapabilities || []).slice(0, 5).map((cap) => ({
    text: cap.title,
    icon: cap.icon || 'user',
  })).length > 0
    ? (agent.detailedCapabilities || []).slice(0, 5).map((cap) => ({
        text: cap.title,
        icon: cap.icon || 'user',
      }))
    : (agent.capabilities || []).slice(0, 5).map((cap, i) => ({
        text: cap,
        icon: ['chat', 'calendar', 'grad_cap', 'funnel', 'user'][i] || 'user',
      }));

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Generate initial contextual greeting if no messages exist yet
  useEffect(() => {
    if (messages.length === 0) {
      const greetingText = getAgentGreeting(agent.id, agent.role, businessType);
      const greetingMsg: DemoChatMessage = {
        id: `greeting-${Date.now()}`,
        sender: 'ai',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: 'greeting',
      };
      onSendMessage(greetingMsg);

      if (sessionId) {
        saveDemoMessageDirect({
          sessionId,
          agentId: agent.id,
          role: 'ai',
          content: greetingText,
          intent: 'greeting',
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = useCallback(async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    setInputText('');

    const userMsg: DemoChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onSendMessage(userMsg);
    analytics.messageSent(text, 'user');

    const updatedMessages = [...messages, userMsg];
    setIsTyping(true);

    try {
      let replyText = '';
      let isLeadCaptured = false;
      let delay = 650;

      if (sessionId) {
        const response = await sendDemoMessage({
          sessionId,
          agentId: agent.id,
          businessType,
          businessDescription,
          selectedNeeds,
          message: text,
          chatHistory: updatedMessages,
        });

        if (response) {
          replyText = response.reply;
          isLeadCaptured = Boolean(response.leadCaptured);
          delay = response.delayMs || 650;
        }
      }

      // Fallback if no sessionId or network error
      if (!replyText) {
        const { defaultChatEngine } = await import('@/services/demoChatEngine');
        const fallbackRes = await defaultChatEngine.generateResponse({
          sessionId: sessionId || undefined,
          businessType,
          selectedNeeds,
          agent,
          userMessage: text,
          chatHistory: updatedMessages,
        });
        replyText = fallbackRes.reply;
        isLeadCaptured = Boolean(fallbackRes.leadCaptured);
        delay = fallbackRes.delayMs || 650;
      }

      await new Promise((res) => setTimeout(res, delay));
      setIsTyping(false);

      const aiMsg: DemoChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onSendMessage(aiMsg);
      analytics.messageSent(replyText, 'ai');

      if (isLeadCaptured) {
        setTimeout(() => {
          const sysMsg: DemoChatMessage = {
            id: `sys-${Date.now()}`,
            sender: 'system',
            text: '✨ Customer enquiry captured successfully. Logged to workspace.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isLeadCaptured: true,
          };
          onSendMessage(sysMsg);
        }, 400);
      }
    } catch (err) {
      setIsTyping(false);
      const fallbackAiMsg: DemoChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "I understand! I'm here to assist with your enquiries, answer common questions, and connect you with our team. What else would you like to know?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onSendMessage(fallbackAiMsg);
    }
  }, [inputText, isTyping, messages, onSendMessage, sessionId, agent, businessType, businessDescription, selectedNeeds]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="screen-scroll-wrapper" style={{ padding: '1.5rem 1.5rem 2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.99 }}
        transition={{ duration: 0.3 }}
        style={{
          width: '100%',
          maxWidth: '1040px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}
      >
        {/* Page Header: Step Badge + Headline + Status */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '1.5rem',
            position: 'relative',
          }}
        >
          {/* Step Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.2rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid #E5E7EB',
              background: '#FAFAFA',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#6B7280',
              textTransform: 'uppercase',
              marginBottom: '0.6rem',
            }}
          >
            STEP 4 OF 5
          </div>

          {/* Headline */}
          <h2
            className="font-display screen-headline"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
              fontWeight: 800,
              color: '#0A0A0A',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              textAlign: 'center',
              marginBottom: '0.45rem',
            }}
          >
            Chat with your AI Agent (Demo)
          </h2>

          {/* Subtitle */}
          <p
            className="screen-subtitle"
            style={{
              fontSize: '0.92rem',
              color: '#6B7280',
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            Experience how your AI Agent will interact with your customers.
          </p>

          {/* AI AGENT ONLINE pill */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#111827',
              letterSpacing: '0.04em',
            }}
            className="demo-engine-badge"
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22C55E',
                boxShadow: '0 0 6px #22C55E',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            AI AGENT ONLINE
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="demo-chat-layout">
          {/* === LEFT SIDEBAR === */}
          <div
            className="demo-chat-sidebar"
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 18px -4px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Agent Portrait */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4/3',
                background: '#F3F4F6',
                overflow: 'hidden',
              }}
            >
              <Image
                src={agent.avatar || '/agents/admission_counselor.jpg'}
                alt={agent.role}
                fill
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
                sizes="240px"
              />
            </div>

            {/* Sidebar Info */}
            <div style={{ padding: '1rem 1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Name + Online Status */}
              <div
                className="font-display"
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#0A0A0A',
                  letterSpacing: '-0.015em',
                  marginBottom: '0.25rem',
                }}
              >
                {agent.role}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  marginBottom: '0.75rem',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#22C55E',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#22C55E' }}>Online</span>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: '0.76rem',
                  color: '#6B7280',
                  lineHeight: 1.45,
                  marginBottom: '1rem',
                }}
              >
                {agent.description}
              </p>

              {/* I can help with: */}
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#0A0A0A',
                  marginBottom: '0.55rem',
                }}
              >
                I can help with:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1 }}>
                {sidebarCapabilities.map((cap, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <div style={{ color: '#374151', flexShrink: 0 }}>
                      <SidebarIcon type={cap.icon} />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#374151', lineHeight: 1.3 }}>{cap.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Note at bottom */}
            <div
              style={{
                padding: '0.75rem 1rem',
                borderTop: '1px solid #F3F4F6',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}
            >
              <Lock size={12} color="#9CA3AF" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#374151' }}>
                  Your data is secure &amp; private
                </div>
                <div style={{ fontSize: '0.65rem', color: '#9CA3AF', lineHeight: 1.3 }}>
                  We never share your information.
                </div>
              </div>
            </div>
          </div>

          {/* === RIGHT CHAT PANEL === */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 18px -4px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              minHeight: '480px',
            }}
          >
            {/* Chat Header */}
            <div
              style={{
                padding: '0.85rem 1.25rem',
                borderBottom: '1px solid #F3F4F6',
                background: '#FAFAFA',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flexShrink: 0,
              }}
            >
              {/* Circular Avatar */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: '#F3F4F6',
                  border: '2px solid #E5E7EB',
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
                <Image
                  src={agent.avatar || '/agents/admission_counselor.jpg'}
                  alt={agent.role}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top center' }}
                  sizes="38px"
                />
              </div>

              <div>
                <div
                  className="font-display"
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    color: '#0A0A0A',
                    lineHeight: 1.2,
                  }}
                >
                  {agent.role}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#9CA3AF', lineHeight: 1.2 }}>
                  AI {agent.role}
                </div>
              </div>
            </div>

            {/* Messages Feed */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                minHeight: 0,
              }}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  if (msg.sender === 'system') {
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', margin: '0.25rem 0' }}
                      >
                        <span className="bubble-system">
                          <Sparkles size={12} /> {msg.text}
                        </span>
                      </motion.div>
                    );
                  }

                  const isUser = msg.sender === 'user';

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: 'flex',
                        justifyContent: isUser ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-end',
                        gap: '0.6rem',
                      }}
                    >
                      {/* AI avatar on the left */}
                      {!isUser && (
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            background: '#F3F4F6',
                            border: '1px solid #E5E7EB',
                            flexShrink: 0,
                            position: 'relative',
                          }}
                        >
                          <Image
                            src={agent.avatar || '/agents/admission_counselor.jpg'}
                            alt=""
                            fill
                            style={{ objectFit: 'cover', objectPosition: 'top' }}
                            sizes="28px"
                          />
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        style={{
                          maxWidth: '72%',
                          background: isUser ? '#111827' : '#F3F4F6',
                          color: isUser ? '#FFFFFF' : '#111827',
                          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          padding: '0.75rem 1rem',
                          fontSize: '0.84rem',
                          lineHeight: 1.5,
                        }}
                      >
                        {msg.text.split('\n').map((line, i, arr) => (
                          <span key={i}>
                            {line}
                            {i < arr.length - 1 && <br />}
                          </span>
                        ))}
                        {/* Timestamp */}
                        <div
                          style={{
                            fontSize: '0.62rem',
                            color: isUser ? 'rgba(255,255,255,0.55)' : '#9CA3AF',
                            marginTop: '0.3rem',
                            textAlign: 'right',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: '3px',
                          }}
                        >
                          {msg.timestamp}
                          {isUser && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', alignItems: 'flex-end', gap: '0.6rem' }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: '#F3F4F6',
                      border: '1px solid #E5E7EB',
                      flexShrink: 0,
                      position: 'relative',
                    }}
                  >
                    <Image
                      src={agent.avatar || '/agents/admission_counselor.jpg'}
                      alt=""
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'top' }}
                      sizes="28px"
                    />
                  </div>
                  <div
                    style={{
                      background: '#F3F4F6',
                      borderRadius: '18px 18px 18px 4px',
                      padding: '0.65rem 1rem',
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                    }}
                  >
                    <span className="typing-dot" style={{ animationDelay: '0s' }} />
                    <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
                    <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
                  </div>
                </motion.div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick Reply Chips */}
            {suggestedPrompts.length > 0 && (
              <div
                style={{
                  padding: '0.6rem 1rem',
                  borderTop: '1px solid #F3F4F6',
                  display: 'flex',
                  gap: '0.5rem',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  flexShrink: 0,
                }}
              >
                {suggestedPrompts.map((prompt) => (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    key={prompt}
                    onClick={() => {
                      analytics.suggestedPromptClicked(prompt, agent.role);
                      handleSend(prompt);
                    }}
                    disabled={isTyping}
                    style={{
                      padding: '0.38rem 0.85rem',
                      borderRadius: '9999px',
                      border: '1.5px solid #E5E7EB',
                      background: '#FFFFFF',
                      fontSize: '0.76rem',
                      fontWeight: 500,
                      color: '#374151',
                      cursor: isTyping ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'border-color 0.15s ease, background 0.15s ease',
                      opacity: isTyping ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isTyping) {
                        e.currentTarget.style.borderColor = '#111827';
                        e.currentTarget.style.background = '#F9FAFB';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isTyping) {
                        e.currentTarget.style.borderColor = '#E5E7EB';
                        e.currentTarget.style.background = '#FFFFFF';
                      }
                    }}
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Chat Input Bar */}
            <div
              style={{
                padding: '0.75rem 1rem',
                borderTop: '1px solid #F3F4F6',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                flexShrink: 0,
              }}
            >
              {/* Attachment icon */}
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.25rem',
                  flexShrink: 0,
                }}
              >
                <Paperclip size={17} />
              </button>

              {/* Text input */}
              <input
                type="text"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.86rem',
                  color: '#111827',
                  background: 'transparent',
                  fontFamily: 'inherit',
                }}
              />

              {/* Send Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend()}
                disabled={!inputText.trim() || isTyping}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: inputText.trim() && !isTyping ? '#111827' : '#E5E7EB',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputText.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  transition: 'background 0.15s ease',
                  flexShrink: 0,
                }}
              >
                <Send size={15} color={inputText.trim() && !isTyping ? '#FFFFFF' : '#9CA3AF'} />
              </motion.button>
            </div>

            {/* Demo Footnote */}
            <div
              style={{
                padding: '0.5rem 1rem 0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                fontSize: '0.68rem',
                color: '#9CA3AF',
                borderTop: '1px solid #F9FAFB',
              }}
            >
              <Lock size={11} color="#9CA3AF" />
              <span>This is a demo. Responses are AI-generated.</span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '1.5rem',
          }}
        >
          <div className="action-btn-row" style={{ marginBottom: '0' }}>
            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              style={{
                width: '160px',
                height: '48px',
                borderRadius: '12px',
                background: '#FFFFFF',
                color: '#111827',
                border: '1.5px solid #E5E7EB',
                fontSize: '0.92rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              <ArrowLeft size={16} /> Back
            </motion.button>

            {/* Continue to Next Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCompleteDemo}
              style={{
                width: '210px',
                height: '48px',
                borderRadius: '12px',
                background: '#111827',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.92rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              }}
            >
              Continue to Next <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
