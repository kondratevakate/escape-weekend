import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Cookie, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const CONSENT_KEY = 'cookie_consent';

export const CookieConsent = () => {
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) {
        const timer = setTimeout(() => setShowBanner(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted');
    } catch {}
    setShowBanner(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'declined');
    } catch {}
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Minimalist side tab */}
      <div 
        className={cn(
          "fixed right-0 top-1/2 -translate-y-1/2 z-[1999] transition-all duration-300 ease-out",
          isExpanded ? "translate-x-0" : "translate-x-0"
        )}
      >
        {/* Collapsed tab */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1.5 py-3 px-2 rounded-l-lg",
            "bg-background/80 backdrop-blur-sm border border-r-0 shadow-lg",
            "text-xs text-muted-foreground hover:text-foreground transition-all duration-200",
            "hover:bg-background/95",
            isExpanded && "opacity-0 pointer-events-none"
          )}
        >
          <Cookie className="h-4 w-4" />
          <span className="writing-mode-vertical text-[10px] tracking-wider uppercase">
            Cookies
          </span>
        </button>

        {/* Expanded panel */}
        <div
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 w-64 transition-all duration-300 ease-out",
            isExpanded 
              ? "opacity-100 translate-x-0" 
              : "opacity-0 translate-x-full pointer-events-none"
          )}
        >
          <div className="bg-background/95 backdrop-blur-md border rounded-l-xl shadow-2xl p-4">
            {/* Close button */}
            <button 
              onClick={() => setIsExpanded(false)}
              className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Cookie className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Cookies</span>
            </div>
            
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              {t('cookies.message')}
            </p>
            
            <div className="flex gap-2">
              <button 
                onClick={handleAccept}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                <Check className="h-3 w-3" />
                {t('cookies.accept')}
              </button>
              <button 
                onClick={handleDecline}
                className="flex-1 px-3 py-1.5 border text-xs font-medium rounded-md hover:bg-muted transition-colors"
              >
                {t('cookies.decline')}
              </button>
            </div>
            
            <Link 
              to="/cookie-policy"
              className="block text-center text-[10px] text-muted-foreground hover:text-foreground mt-3 transition-colors"
            >
              {t('cookies.learnMore')} →
            </Link>
          </div>
        </div>
      </div>

      {/* Vertical text style */}
      <style>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </>
  );
};
