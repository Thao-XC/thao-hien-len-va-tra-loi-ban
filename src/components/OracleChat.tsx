import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Hexagram } from '../types';
import { Send, RefreshCw, Copy, Check, MessageSquare, Sparkles } from 'lucide-react';
import { playChime } from '../utils/audio';

interface OracleChatProps {
  que: number;
  hao: number;
  hexagram: Hexagram;
  initialQuestion: string;
  language: 'en' | 'vi';
  soundEnabled?: boolean;
  onReset: () => void;
}

export const OracleChat: React.FC<OracleChatProps> = ({
  que,
  hao,
  hexagram,
  initialQuestion,
  language,
  soundEnabled = true,
  onReset,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [currentStreamText, setCurrentStreamText] = useState<string>('');
  const [followUpInput, setFollowUpInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef<boolean>(false);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStreamText]);

  // Initial reading trigger
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    // Add user's question first
    const initialUserMsg: ChatMessage = {
      role: 'user',
      text: initialQuestion || (language === 'vi' ? 'Xin Thảo luận giải vận trình cho tôi.' : 'Please interpret this draw for my path.'),
      timestamp: Date.now(),
    };
    setMessages([initialUserMsg]);

    // Stream initial interpretation from Thao
    streamInterpretation(que, hao, initialUserMsg.text, []);
  }, [que, hao, initialQuestion, language]);

  const streamInterpretation = async (
    queNum: number,
    haoNum: number,
    questionText: string,
    history: ChatMessage[]
  ) => {
    setIsStreaming(true);
    setCurrentStreamText('');

    try {
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          que: queNum,
          hao: haoNum,
          question: questionText,
          history: history.length > 0 ? history : undefined,
          language,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Could not reach the fortune teller');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const raw = decoder.decode(value, { stream: true });
        const lines = raw.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                fullText += data.text;
                setCurrentStreamText(fullText);
              }
              if (data.error) {
                fullText += `\n[${data.error}]`;
                setCurrentStreamText(fullText);
              }
            } catch {
              // Ignore partial JSON
            }
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: fullText || (language === 'vi' ? 'Thao chưa nhận được thông điệp rõ ràng. Bạn hãy thử lại.' : 'The interpretation is still settling. Please try asking again.'),
          timestamp: Date.now(),
        },
      ]);
      setCurrentStreamText('');
      if (soundEnabled) {
        playChime(0.25);
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            language === 'vi'
              ? 'Tạm thời chưa thể kết nối với Thảo. Bạn hãy kiểm tra lại hoặc thử lại sau giây lát.'
              : "Couldn't reach Thao the fortune teller just now. Please try again in a moment.",
          timestamp: Date.now(),
        },
      ]);
      setCurrentStreamText('');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSendFollowUp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = followUpInput.trim();
    if (!q || isStreaming) return;

    setFollowUpInput('');
    const newMsg: ChatMessage = { role: 'user', text: q, timestamp: Date.now() };
    const updatedHistory = [...messages, newMsg];
    setMessages(updatedHistory);

    await streamInterpretation(que, hao, q, updatedHistory);
  };

  const handleCopyFortune = () => {
    const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');
    const textToCopy = `🔮 Thao's Fortune Telling Shop\n📜 Que ${que} (${hexagram.english}) - Hao ${hao}\n💬 Question: ${initialQuestion}\n\n✨ Interpretation:\n${
      lastAssistantMsg?.text || currentStreamText
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const suggestionChips =
    language === 'vi'
      ? ['Tôi nên chú ý điều gì nhất?', 'Làm sao để chuẩn bị trước thay đổi?', 'Về công việc và tài lộc thế nào?']
      : ['What should I be most cautious of?', 'How can I best prepare for changes?', 'What about career and finances?'];

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Chat Thread */}
      <div className="space-y-3.5 pt-1">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              {/* Speaker Label */}
              <div
                className={`text-[0.7rem] font-sans font-semibold uppercase tracking-wider mb-1 px-1 ${
                  isUser ? 'text-[#AD8A2E]' : 'text-[#7C2A1C]'
                }`}
              >
                {isUser ? (language === 'vi' ? 'Bạn (You)' : 'You') : "Thảo (Fortune Teller)"}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-3.5 sm:p-4 rounded-xs text-sm sm:text-base leading-relaxed max-w-[92%] sm:max-w-[88%] font-serif shadow-xs ${
                  isUser
                    ? 'bg-gradient-to-b from-[#B23B28] to-[#9C2C1E] text-[#F7F0E1] border border-[#7C2A1C] rounded-tr-none'
                    : 'bg-white/80 border border-[#AD8A2E]/35 text-[#2E2415] rounded-tl-none shadow-[0_3px_12px_rgba(46,36,21,0.06)]'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          );
        })}

        {/* Live Streaming Bubble */}
        {isStreaming && (
          <div className="flex flex-col items-start">
            <div className="text-[0.7rem] font-sans font-semibold uppercase tracking-wider mb-1 px-1 text-[#7C2A1C] flex items-center gap-1.5">
              <span>Thảo (Fortune Teller)</span>
              <Sparkles className="w-3 h-3 text-[#AD8A2E] animate-spin" />
            </div>

            <div className="p-3.5 sm:p-4 rounded-xs text-sm sm:text-base leading-relaxed max-w-[92%] sm:max-w-[88%] font-serif bg-white/80 border border-[#AD8A2E]/35 text-[#2E2415] rounded-tl-none shadow-[0_3px_12px_rgba(46,36,21,0.06)]">
              <span className="whitespace-pre-wrap">
                {currentStreamText || (language === 'vi' ? 'Thảo đang đọc quẻ...' : 'Thao is contemplating your hexagram...')}
              </span>
              <span className="inline-block w-1.5 h-4 bg-[#7C2A1C] ml-1 animate-pulse align-middle" />
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Follow-up Prompts */}
      {!isStreaming && messages.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {suggestionChips.map((chip, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setFollowUpInput(chip);
              }}
              className="text-xs font-sans px-2.5 py-1 rounded-full bg-[#EFE4CB]/70 hover:bg-[#EFE4CB] text-[#6E5C3E] border border-[#AD8A2E]/30 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Follow-up Question Input Box */}
      {!isStreaming && (
        <form onSubmit={handleSendFollowUp} className="flex gap-2 items-center pt-1">
          <input
            type="text"
            id="followup-input-field"
            value={followUpInput}
            onChange={(e) => setFollowUpInput(e.target.value)}
            placeholder={
              language === 'vi'
                ? 'Hỏi tiếp Thảo về quẻ này...'
                : 'Ask Thao a follow-up question...'
            }
            className="flex-1 px-3.5 py-2.5 bg-white/70 border border-[#AD8A2E]/40 rounded-xs text-sm font-serif text-[#2E2415] placeholder:text-[#6E5C3E]/60 focus:outline-none focus:border-[#B23B28] focus:ring-1 focus:ring-[#B23B28]"
          />
          <button
            type="submit"
            id="send-followup-button"
            disabled={!followUpInput.trim()}
            className="px-4 py-2.5 bg-[#B23B28] hover:bg-[#7C2A1C] text-[#F7F0E1] rounded-xs font-sans text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'vi' ? 'Gửi' : 'Ask'}</span>
          </button>
        </form>
      )}

      {/* Action Footer: Copy & Draw Another */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#AD8A2E]/25">
        <button
          type="button"
          onClick={handleCopyFortune}
          className="px-3 py-1.5 rounded-xs text-xs font-sans font-medium text-[#6E5C3E] hover:text-[#2E2415] border border-[#AD8A2E]/30 hover:bg-[#AD8A2E]/10 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-700" />
              <span>{language === 'vi' ? 'Đã sao chép!' : 'Copied!'}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Sao chép lời giải' : 'Copy reading'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="px-4 py-1.5 rounded-xs text-xs font-sans font-semibold bg-[#2E2415] hover:bg-[#4A3B24] text-[#F7F0E1] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{language === 'vi' ? 'Gieo Quẻ Mới' : 'Draw Another Que'}</span>
        </button>
      </div>
    </div>
  );
};
