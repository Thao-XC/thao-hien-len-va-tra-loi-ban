import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { ChatMessage, Hexagram } from '../types';
import { Send, Copy, Check, Sparkles, MessageCircle } from 'lucide-react';
import { playChime } from '../utils/audio';
import { generateRichFallbackInterpretation } from '../utils/fallbackInterpreter';
import { VIETNAMESE_HEXAGRAMS } from '../data/vietnameseHexagrams';
import { LadyThaoAvatar } from './LadyThaoAvatar';

interface OracleChatProps {
  que: number;
  hao: number;
  hexagram: Hexagram;
  initialQuestion: string;
  language?: 'vi';
  soundEnabled?: boolean;
  onReset: () => void;
}

export const OracleChat: React.FC<OracleChatProps> = ({
  que,
  hao,
  hexagram,
  initialQuestion,
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

  const hexViet = VIETNAMESE_HEXAGRAMS[que] || VIETNAMESE_HEXAGRAMS[1];

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
      initialQuestion.trim() || 'Xin Cô Thảo luận giải vận trình và lời khuyên cho tôi.';

    const initialUserMsg: ChatMessage = {
      role: 'user',
      text: userQuestion,
      timestamp: Date.now(),
    };
    setMessages([initialUserMsg]);

    streamInterpretation(que, hao, userQuestion, []);
  }, [que, hao, initialQuestion]);

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
          language: 'vi',
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
              // Ignore partial JSON
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
          text: fullText || 'Thảo đang định tâm chiêm nghiệm quẻ.',
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
          'vi',
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
            text: 'Thảo đang kết nối huyền cơ. Bạn hãy thử đặt lại câu hỏi.',
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
    const textToCopy = `🔮 Sạp Bói Cô Thảo\n📜 Quẻ #${que} (${hexViet.name}) - Hào Động ${hao}\n💬 Câu hỏi: ${initialQuestion || 'Luận giải vận trình'}\n\n✨ Lời luận giải:\n${
      lastAssistantMsg?.text || currentStreamText
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const suggestionChips = [
    'Tôi nên làm gì lúc này để đón lành tránh dữ?',
    'Về công việc và tiền bạc sắp tới thế nào?',
    'Có điều gì Thảo khuyên nên tránh không?',
    'Mối quan hệ và người xung quanh ra sao?',
  ];

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Scrollable Conversation Container */}
      <div
        ref={messagesContainerRef}
        className="w-full max-h-[500px] overflow-y-auto space-y-3.5 pr-1 select-text scroll-smooth"
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
                className={`text-[0.7rem] font-sans font-semibold uppercase tracking-wider mb-1 px-1 flex items-center gap-1.5 ${
                  isUser ? 'text-[#AD8A2E]' : 'text-[#7C2A1C]'
                }`}
              >
                {!isUser && <LadyThaoAvatar sizeClassName="w-5 h-5" />}
                <span>{isUser ? 'BẠN HỎI' : 'CÔ THẢO LUẬN GIẢI'}</span>
              </div>

              {/* Message Bubble */}
              <div className="flex items-start gap-2 max-w-full">
                {!isUser && (
                  <LadyThaoAvatar sizeClassName="w-8 h-8 hidden sm:block" />
                )}
                <div
                  className={`p-3.5 sm:p-4 rounded-xs text-sm sm:text-base leading-relaxed max-w-[96%] sm:max-w-[92%] font-serif shadow-xs ${
                    isUser
                      ? 'bg-gradient-to-b from-[#B23B28] to-[#8C2214] text-[#FFFDF7] border border-[#6E1C12] rounded-tr-none ml-auto'
                      : 'bg-white border border-[#AD8A2E]/40 text-[#2E2415] rounded-tl-none shadow-[0_2px_8px_rgba(46,36,21,0.06)]'
                  }`}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  ) : (
                    <div className="space-y-2 [&_p]:my-1.5 [&_strong]:text-[#7C2A1C] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 leading-relaxed">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Streaming Bubble */}
        {isStreaming && (
          <div className="flex flex-col items-start">
            <div className="text-[0.7rem] font-sans font-semibold uppercase tracking-wider mb-1 px-1 text-[#7C2A1C] flex items-center gap-1.5">
              <LadyThaoAvatar sizeClassName="w-5 h-5" animate={true} />
              <span>Cô Thảo Đang Luận Giải...</span>
              <Sparkles className="w-3.5 h-3.5 text-[#AD8A2E] animate-spin" />
            </div>

            <div className="flex items-start gap-2 max-w-full">
              <LadyThaoAvatar sizeClassName="w-8 h-8 hidden sm:block" animate={true} />
              <div className="p-3.5 sm:p-4 rounded-xs text-sm sm:text-base leading-relaxed max-w-[96%] sm:max-w-[92%] font-serif bg-white border border-[#AD8A2E]/40 text-[#2E2415] rounded-tl-none shadow-[0_2px_8px_rgba(46,36,21,0.06)]">
                {currentStreamText ? (
                  <div className="space-y-2 [&_p]:my-1.5 [&_strong]:text-[#7C2A1C] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 inline leading-relaxed">
                    <Markdown>{currentStreamText}</Markdown>
                  </div>
                ) : (
                  <span>Thảo đang định tâm đọc quẻ cho bạn...</span>
                )}
                <span className="inline-block w-1.5 h-4 bg-[#7C2A1C] ml-1 animate-pulse align-middle" />
              </div>
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
            placeholder="Hỏi tiếp Cô Thảo về công việc, tình duyên, cách hành sự..."
            className="flex-1 px-3.5 py-2.5 bg-white border border-[#AD8A2E]/50 rounded-xs text-sm font-serif text-[#2E2415] placeholder:text-[#6E5C3E]/60 focus:outline-none focus:border-[#B23B28] focus:ring-1 focus:ring-[#B23B28] shadow-2xs"
          />
          <button
            type="submit"
            id="send-followup-button"
            disabled={!followUpInput.trim()}
            className="px-4 py-2.5 bg-[#B23B28] hover:bg-[#7C2A1C] text-[#FFFDF7] rounded-xs font-sans text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Hỏi Thảo</span>
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
              <span>Đã sao chép!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Sao chép lời giải</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="px-3.5 py-1.5 rounded-xs text-xs font-sans font-semibold bg-[#7C2A1C] hover:bg-[#B23B28] text-[#FFFDF7] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>Gieo Quẻ Mới ➔</span>
        </button>
      </div>
    </div>
  );
};
