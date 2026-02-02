import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Sparkles, MapPin, Route, Calendar } from 'lucide-react';

interface ChatPanelProps {
  isCreator: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const touristSuggestions = {
  ru: [
    { icon: Route, text: 'Построй маршрут на 3 дня по северу Кольского' },
    { icon: MapPin, text: 'Что посмотреть рядом с Териберкой?' },
    { icon: Calendar, text: 'Когда лучше ехать за северным сиянием?' },
  ],
  en: [
    { icon: Route, text: 'Build a 3-day route in northern Kola' },
    { icon: MapPin, text: 'What to see near Teriberka?' },
    { icon: Calendar, text: 'Best time to see Northern Lights?' },
  ],
};

const creatorSuggestions = {
  ru: [
    { icon: MapPin, text: 'Добавь новое место на карту' },
    { icon: Sparkles, text: 'Сгенерируй описание для слоя' },
    { icon: Route, text: 'Создай тематический маршрут' },
  ],
  en: [
    { icon: MapPin, text: 'Add a new place to the map' },
    { icon: Sparkles, text: 'Generate layer description' },
    { icon: Route, text: 'Create themed route' },
  ],
};

// Mock AI responses
const mockResponses = {
  ru: [
    'Отличный выбор! Вот мой план для вас:\n\n**День 1: Мурманск → Териберка**\n🌊 Териберка — знаменитый поселок у океана\n📍 Водопад на реке Териберка\n🍽️ Ужин в ресторане "Терибаар"\n\n**День 2: Ловозеро**\n🦌 Саамская деревня\n⛰️ Сейдозеро — священное озеро\n\n**День 3: Хибины**\n🏔️ Горный массив Хибины\n⛷️ Горнолыжный курорт\n\nХотите, чтобы я оптимизировал маршрут?',
    'Рядом с Териберкой много интересного:\n\n1. **Водопад на реке Териберка** (2 км)\n2. **Кладбище кораблей** — атмосферное место\n3. **Пляж "Яйца дракона"** — каменный пляж\n4. **Батарейский водопад** (5 км)\n\nВсе места можно обойти за день!',
  ],
  en: [
    'Great choice! Here\'s my plan for you:\n\n**Day 1: Murmansk → Teriberka**\n🌊 Teriberka — famous coastal village\n📍 Teriberka River Waterfall\n🍽️ Dinner at "Teribar" restaurant\n\n**Day 2: Lovozero**\n🦌 Saami village\n⛰️ Seidozero — sacred lake\n\n**Day 3: Khibiny**\n🏔️ Khibiny Mountains\n⛷️ Ski resort\n\nWould you like me to optimize the route?',
    'Lots of interesting places near Teriberka:\n\n1. **Teriberka River Waterfall** (2 km)\n2. **Ship Graveyard** — atmospheric spot\n3. **Dragon Eggs Beach** — stone beach\n4. **Batareiskiy Waterfall** (5 km)\n\nAll places can be visited in one day!',
  ],
};

export const ChatPanel = ({ isCreator }: ChatPanelProps) => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = isCreator ? creatorSuggestions[language] : touristSuggestions[language];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = mockResponses[language];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat header */}
      <div className="p-4 border-b border-border flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-sm">
            {language === 'ru' ? 'AI Помощник' : 'AI Assistant'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {language === 'ru' ? 'Готов помочь с планированием' : 'Ready to help with planning'}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              {language === 'ru' ? 'Привет! Чем помочь?' : 'Hi! How can I help?'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {language === 'ru' 
                ? 'Я могу помочь построить маршрут, найти интересные места или ответить на вопросы о путешествиях.'
                : 'I can help build routes, find interesting places, or answer travel questions.'}
            </p>
            
            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion, idx) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion.text)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full border border-border
                               hover:bg-accent/50 hover:border-primary/50 transition-colors text-sm"
                  >
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <span className="max-w-[200px] truncate">{suggestion.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={language === 'ru' ? 'Напишите сообщение...' : 'Type a message...'}
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            onClick={() => handleSend()} 
            disabled={!input.trim() || isTyping}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
