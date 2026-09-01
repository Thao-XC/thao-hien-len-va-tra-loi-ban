import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Hexagram } from '../types';
import { Send, Copy, Check, Sparkles } from 'lucide-react';
import { playChime } from '../utils/audio';
import { generateRichFallbackInterpretation } from '../utils/fallbackInterpreter';

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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef<boolean>(false);

  // Scroll smoothly only when a complete new message is added or user interacts (NOT on every token)
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // Initial reading trigger
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const userQuestion =
      initialQuestion.trim() ||
      (language === 'vi'
        ? 'Xin Thảo luận giải vận trình và lời khuyên cho tôi.'
        : 'Please interpret this hexagram and give me guidance.');

    const initialUserMsg: ChatMessage = {
      role: 'user',
      text: userQuestion,
      timestamp: Date.now(),
    };
    setMessages([initialUserMsg]);

    streamInterpretation(que, hao, userQuestion, []);
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
        throw new Error('Could not reach backend stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.text) {
                fullText += data.text;
                setCurrentStreamText(fullText);
              }
              if (data.error) {
                fullText += `\n[${data.error}]`;
                setCurrentStreamText(fullText);
              }
            } catch {
              // Ignore partial chunk
            }
          }
        }
      }

      if (buffer.trim().startsWith('data: ')) {
        try {
          const data = JSON.parse(buffer.trim().slice(6));
          if (data.text) {
            fullText += data.text;
            setCurrentStreamText(fullText);
          }
        } catch {}
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: fullText || (language === 'vi' ? 'Thảo đang định tâm chiêm nghiệm quẻ.' : 'The reading is settling.'),
          timestamp: Date.now(),
        },
      ]);
      setCurrentStreamText('');
      if (soundEnabled) {
        playChime(0.25);
      }
    } catch (err: any) {
      console.warn('API route fallback triggered:', err);
      try {
        const fallbackText = generateRichFallbackInterpretation(
          queNum,
          haoNum,
          questionText,
          language,
          history
        );
        const words = fallbackText.split(' ');
        let accumulated = '';
        for (const word of words) {
          accumulated += word + ' ';
          setCurrentStreamText(accumulated);
          await new Promise((r) => setTimeout(r, 16));
        }
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: accumulated.trim(),
            timestamp: Date.now(),
          },
        ]);
        setCurrentStreamText('');
        if (soundEnabled) {
          playChime(0.25);
        }
      } catch (fallbackErr) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text:
              language === 'vi'
                ? 'Thảo đang kết nối huyền cơ. Bạn hãy thử đặt lại câu hỏi.'
                : 'Lady Thao is attuning to the oracle. Please ask once more.',
            timestamp: Date.now(),
          },
        ]);
        setCurrentStreamText('');
      }
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
    const textToCopy = `🔮 Sạp Bói Cô Thảo\n📜 Quẻ #${que} (${hexagram.english}) - Hào Động ${hao}\n💬 Câu hỏi: ${initialQuestion}\n\n✨ Lời luận giải:\n${
      lastAssistantMsg?.text || currentStreamText
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const suggestionChips =
    language === 'vi'
      ? ['Tôi nên làm gì lúc này để đón lành tránh dữ?', 'Về công việc và tiền bạc sắp tới thế nào?', 'Có điều gì Thảo khuyên nên tránh không?']
      : ['What is the most critical action to take now?', 'What about career and finances?', 'What pitfalls should I avoid?'];

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Scrollable Conversation Container */}
      <div
        ref={messagesContainerRef}
        className="w-full max-h-[480px] overflow-y-auto space-y-3 pr-1 select-text scroll-smooth"
      >
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
                {isUser ? (language === 'vi' ? 'Bạn hỏi (You)' : 'Your Question') : '🌸 Cô Thảo Luận Giải'}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-3.5 sm:p-4 rounded-xs text-sm sm:text-base leading-relaxed max-w-[96%] sm:max-w-[92%] font-serif shadow-xs ${
                  isUser
                    ? 'bg-gradient-to-b from-[#B23B28] to-[#8C2214] text-[#FFFDF7] border border-[#6E1C12] rounded-tr-none'
                    : 'bg-white border border-[#AD8A2E]/40 text-[#2E2415] rounded-tl-none shadow-[0_2px_8px_rgba(46,36,21,0.06)]'
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
              <span>🌸 Cô Thảo Đang Luận Giải...</span>
              <Sparkles className="w-3.5 h-3.5 text-[#AD8A2E] animate-spin" />
            </div>

            <div className="p-3.5 sm:p-4 rounded-xs text-sm sm:text-base leading-relaxed max-w-[96%] sm:max-w-[92%] font-serif bg-white border border-[#AD8A2E]/40 text-[#2E2415] rounded-tl-none shadow-[0_2px_8px_rgba(46,36,21,0.06)]">
              <span className="whitespace-pre-wrap">
                {currentStreamText || (language === 'vi' ? 'Thảo đang định tâm đọc quẻ cho bạn...' : 'Lady Thao is contemplating your oracle...')}
              </span>
              <span className="inline-block w-1.5 h-4 bg-[#7C2A1C] ml-1 animate-pulse align-middle" />
            </div>
          </div>
        )}
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
              className="text-xs font-sans px-2.5 py-1 rounded-full bg-[#EFE4CB]/80 hover:bg-[#EFE4CB] hover:text-[#7C2A1C] text-[#6E5C3E] border border-[#AD8A2E]/40 transition-colors cursor-pointer active:scale-98"
            >
              • {chip}
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
                ? 'Hỏi tiếp Cô Thảo về công việc, tình duyên, cách hành sự...'
                : 'Ask Lady Thao a follow-up question...'
            }
            className="flex-1 px-3.5 py-2.5 bg-white border border-[#AD8A2E]/50 rounded-xs text-sm font-serif text-[#2E2415] placeholder:text-[#6E5C3E]/60 focus:outline-none focus:border-[#B23B28] focus:ring-1 focus:ring-[#B23B28] shadow-2xs"
          />
          <button
            type="submit"
            id="send-followup-button"
            disabled={!followUpInput.trim()}
            className="px-4 py-2.5 bg-[#B23B28] hover:bg-[#7C2A1C] text-[#FFFDF7] rounded-xs font-sans text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'vi' ? 'Hỏi Thảo' : 'Ask'}</span>
          </button>
        </form>
      )}

      {/* Action Footer: Copy Reading & Draw Another Que */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#AD8A2E]/30">
        <button
          type="button"
          onClick={handleCopyFortune}
          className="px-3 py-1.5 rounded-xs text-xs font-sans font-medium text-[#6E5C3E] hover:text-[#2E2415] border border-[#AD8A2E]/40 hover:bg-[#AD8A2E]/10 transition-colors flex items-center gap-1.5 cursor-pointer"
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
          className="px-3.5 py-1.5 rounded-xs text-xs font-sans font-semibold bg-[#7C2A1C] hover:bg-[#B23B28] text-[#FFFDF7] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>{language === 'vi' ? 'Gieo Quẻ Mới ➔' : 'Draw Another Que ➔'}</span>
        </button>
      </div>
    </div>
  );
};
