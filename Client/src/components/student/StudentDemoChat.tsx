import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { MessageCircle, X, Loader2, Send } from 'lucide-react';
import { cn } from '../../lib/utils';

const DEMO_REPLY_MATH =
  "Here’s a quick recap of what we covered recently in Mathematics: **Quadratic equations** (solving by factoring and the quadratic formula), **graphs of parabolas**, and **word problems**. Next we’ll start **introduction to calculus**. This is demo data — for a real recap, use your course notes or ask your teacher.";

const DEMO_REPLY_GENERIC =
  "I’m a demo assistant. For real answers, ask your teacher or check your course materials. (This reply is for demo only.)";

const REPLY_DELAY_MS = 10000;

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isLoading?: boolean;
}

interface StudentDemoChatProps {
  /** Only render when true (e.g. user role === 'student') */
  visible: boolean;
}

export function StudentDemoChat({ visible }: StudentDemoChatProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const isMathQuestion =
      /math|mathematics|recent|learn|learned|we (did|covered|studied)/i.test(text);

    const loadingMsg: ChatMessage = {
      id: `l-${Date.now()}`,
      role: 'assistant',
      text: '',
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMsg]);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.isLoading
            ? {
                ...m,
                text: isMathQuestion ? DEMO_REPLY_MATH : DEMO_REPLY_GENERIC,
                isLoading: false,
              }
            : m
        )
      );
    }, REPLY_DELAY_MS);
  };

  if (!visible) return null;

  const chatUI = (
    <div
      className="fixed right-6 bottom-6 z-[99999] flex flex-col items-end gap-3"
      style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 99999 }}
    >
        {/* Chat panel — fixed size so it never shifts */}
        {open && (
          <div
            className={cn(
              'w-[340px] min-w-[340px] max-w-[340px] rounded-xl border bg-card shadow-xl',
              'h-[400px] min-h-[400px] max-h-[400px]',
              'flex flex-col overflow-hidden flex-shrink-0'
            )}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50 flex-shrink-0">
              <span className="text-sm font-medium">Study assistant</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 min-h-0 overflow-auto p-3">
              <div className="min-h-0 overflow-hidden">
                {messages.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Ask about your recent studies
                  </p>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      'mb-3 flex min-w-0',
                      m.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] min-w-0 rounded-lg px-3 py-2 text-sm overflow-hidden break-words',
                        m.role === 'user'
                          ? 'bg-[#3E92CC] text-white'
                          : 'bg-muted text-foreground'
                      )}
                    >
                      {m.isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                          Thinking...
                        </span>
                      ) : (
                        <span className="whitespace-pre-wrap break-words">
                          {m.text}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
            <div className="p-2 border-t flex gap-2 flex-shrink-0 min-h-0">
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 min-w-0"
              />
              <Button
                size="icon"
                className="shrink-0 bg-[#3E92CC] hover:bg-[#2E82BC]"
                onClick={sendMessage}
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Chat icon — always same spot, bottom-right */}
        <Button
          size="icon"
          className={cn(
            'h-14 w-14 rounded-full shadow-lg bg-[#3E92CC] hover:bg-[#2E82BC] text-white flex-shrink-0',
            open && 'ring-2 ring-[#3E92CC] ring-offset-2 ring-offset-background'
          )}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close demo chat' : 'Open demo chat'}
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      </div>
  );

  return createPortal(chatUI, document.body);
}
