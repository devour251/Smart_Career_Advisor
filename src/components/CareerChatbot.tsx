import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Mic, MicOff, RotateCcw, Send, X } from 'lucide-react';
import type { StudentProfile, SupportedLanguage } from '../types/sankalp';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface CareerChatbotProps {
  isOpen: boolean;
  onToggleOpen: (open: boolean) => void;
  language: SupportedLanguage;
  profile: StudentProfile;
  activeStreamId?: string;
  queuedQuestion: string | null;
  onClearQueuedQuestion: () => void;
}

const STARTER_QUESTIONS: Record<SupportedLanguage, string[]> = {
  en: [
    'I passed 10th and do not know which stream to choose. Explain my options simply.',
    'If I take Science (PCM), what comes next — B.Tech, MBA, jobs & salary?',
    'What careers and salaries are possible in Commerce or Arts?',
    'Best free YouTube channels and notes for my studies?',
  ],
  hi: [
    'मैंने 10वीं पास की है और समझ नहीं आ रहा कौन सी स्ट्रीम चुनूँ। सरल भाषा में समझाएं।',
    'Science (PCM) लेने के बाद B.Tech, MBA और सैलरी पैकेज के क्या विकल्प हैं?',
    'Commerce या Arts में कौन-कौन से अच्छे करियर और जॉब हैं?',
    'पढ़ाई के लिए मुफ़्त नोट्स और बेस्ट यूट्यूब चैनल कौन से हैं?',
  ],
  kn: [
    'ನಾನು 10ನೇ ತರಗತಿ ಪಾಸಾಗಿದ್ದೇನೆ, ಯಾವ ಸ್ಟ್ರೀಮ್ ಆಯ್ಕೆ ಮಾಡಬೇಕೆಂದು ಸರಳವಾಗಿ ತಿಳಿಸಿ.',
    'Science (PCM) ತೆಗೆದುಕೊಂಡರೆ ಮುಂದೆ B.Tech, MBA, ಉದ್ಯೋಗ ಮತ್ತು ಸಂಬಳ ಹೇಗಿರುತ್ತದೆ?',
    'Commerce ಅಥವಾ Arts ನಲ್ಲಿ ಯಾವ ಉತ್ತಮ ವೃತ್ತಿಗಳಿವೆ?',
    'ಉಚಿತ ನೋಟ್ಸ್ ಮತ್ತು ಅತ್ಯುತ್ತಮ ಯೂಟ್ಯೂಬ್ ಚಾನೆಲ್‌ಗಳು ಯಾವುವು?',
  ],
};

function renderFormattedLine(line: string, idx: number) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span key={idx}>
      {parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-slate-950">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={pIdx}>{part}</span>;
      })}
    </span>
  );
}

function FormattedMessageContent({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).filter(Boolean);
  return (
    <div className="space-y-3 text-sm sm:text-[15px] leading-relaxed">
      {blocks.map((block, bIdx) => {
        const lines = block.split('\n').filter(Boolean);
        const isBulletList = lines.every(
          (l) => l.trim().startsWith('- ') || l.trim().startsWith('* ') || l.trim().startsWith('• ')
        );
        if (isBulletList) {
          return (
            <ul key={bIdx} className="list-disc pl-5 space-y-1.5">
              {lines.map((l, lIdx) => (
                <li key={lIdx}>{renderFormattedLine(l.replace(/^[-*•]\s+/, ''), lIdx)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bIdx} className="space-y-1">
            {lines.map((l, lIdx) => (
              <span key={lIdx} className="block">
                {renderFormattedLine(l, lIdx)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export function CareerChatbot({
  isOpen,
  onToggleOpen,
  language,
  profile,
  activeStreamId,
  queuedQuestion,
  onClearQueuedQuestion,
}: CareerChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hi! I am your **Smart Career Advisor Mentor**. Ask me anything about streams after 10th, degrees after 12th (B.Tech, MBBS, BCA, B.Com, CA, Law, Diploma), MBA/M.Tech options, salaries, skills to learn, free study notes, or the best YouTube channels!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isSending) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: trimmed,
    };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory
            .filter((m) => m.id !== 'welcome')
            .slice(-6)
            .map((m) => ({ role: m.role, content: m.content })),
          language,
          activeStreamId,
          profile,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not reach Career Mentor.');
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: 'assistant',
          content: data.reply,
        },
      ]);
      if (Array.isArray(data.suggestedFollowUps)) {
        setSuggestedFollowUps(data.suggestedFollowUps);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content:
            err?.message || 'Sorry, I encountered a connection issue. Please try asking again.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (queuedQuestion && isOpen) {
      const q = queuedQuestion;
      onClearQueuedQuestion();
      sendQuestion(q);
    }
  }, [queuedQuestion, isOpen]);

  const handleVoiceMic = () => {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-IN';
    recognition.interimResults = false;
    setIsListening(true);

    recognition.onresult = (e: any) => {
      const transcript = e.results?.[0]?.[0]?.transcript || '';
      if (transcript) {
        setInput((prev) => [prev, transcript].filter(Boolean).join(' '));
      }
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const resetChat = () => {
    setSuggestedFollowUps([]);
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Chat cleared! Ask me any question about streams, degrees, career jobs, salary packages, skills, or free study resources.',
      },
    ]);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => onToggleOpen(true)}
        className="page-pavilion-banner fixed bottom-6 right-6 z-50 inline-flex items-center gap-2.5 rounded-2xl border border-teal-400/30 px-5 py-3.5 text-[15px] font-bold text-white shadow-xl transition-transform hover:-translate-y-0.5"
      >
        <MessageCircle className="h-5 w-5 text-teal-300" />
        <span>Ask Career Mentor</span>
      </button>
    );
  }

  const starters = STARTER_QUESTIONS[language] || STARTER_QUESTIONS.en;

  return (
    <aside
      aria-label="Career Mentor Chat"
      className="fixed bottom-4 right-4 z-50 flex h-[38rem] max-h-[86vh] w-[calc(100vw-2rem)] max-w-lg flex-col overflow-hidden rounded-3xl border border-teal-900/20 bg-white/96 backdrop-blur-xl shadow-2xl"
    >
      {/* Chat Header */}
      <div className="hero-pavilion flex items-center justify-between border-b border-white/10 px-5 py-4 text-white">
        <div>
          <h2 className="font-['Bricolage_Grotesque'] text-base sm:text-lg font-bold">
            Smart Career Advisor Mentor
          </h2>
          <p className="text-xs text-slate-300">
            Streams · Degrees · Salaries · Notes &amp; YouTube
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={resetChat}
            title="Clear chat"
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggleOpen(false)}
            aria-label="Close Career Mentor"
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-teal-700 text-white text-sm sm:text-[15px] leading-relaxed'
                  : 'border border-slate-200 bg-white text-slate-800'
              }`}
            >
              {msg.role === 'user' ? (
                <p>{msg.content}</p>
              ) : (
                <FormattedMessageContent text={msg.content} />
              )}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
              Thinking about the best career options for you...
            </div>
          </div>
        )}

        {/* Starter Questions */}
        {messages.length <= 1 && !isSending && (
          <div className="space-y-2.5 pt-2">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Popular Student Questions:
            </p>
            <div className="space-y-2">
              {starters.map((sq) => (
                <button
                  key={sq}
                  type="button"
                  onClick={() => sendQuestion(sq)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 hover:border-teal-700 hover:text-slate-950"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Follow-up Suggestions */}
        {suggestedFollowUps.length > 0 && !isSending && messages.length > 1 && (
          <div className="space-y-2 pt-1">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Suggested Next Questions:
            </p>
            {suggestedFollowUps.map((fq) => (
              <button
                key={fq}
                type="button"
                onClick={() => sendQuestion(fq)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-left text-sm font-medium text-teal-800 hover:border-teal-700"
              >
                {fq}
              </button>
            ))}
          </div>
        )}

        <div ref={scrollEndRef} />
      </div>

      {/* Chat Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendQuestion(input);
        }}
        className="flex items-center gap-2.5 border-t border-slate-200 bg-white p-3.5"
      >
        <button
          type="button"
          onClick={handleVoiceMic}
          title="Speak your question"
          className={`rounded-xl border p-2.5 transition-colors ${
            isListening
              ? 'border-red-500 bg-red-50 text-red-700'
              : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
          }`}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about streams, B.Tech, MBA, salary, notes..."
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm sm:text-[15px] text-slate-900 focus:border-teal-700 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!input.trim() || isSending}
          aria-label="Send message"
          className="inline-flex items-center justify-center rounded-xl bg-teal-700 p-2.5 text-white transition-colors hover:bg-teal-800 disabled:opacity-40"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </aside>
  );
}
