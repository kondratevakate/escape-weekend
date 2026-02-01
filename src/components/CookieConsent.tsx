import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Cookie, X, ChevronRight } from 'lucide-react';
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
    <div 
      className={cn(
        "fixed left-0 bottom-20 z-[2000] transition-all duration-300 ease-out",
        isExpanded ? "translate-x-0" : "-translate-x-[calc(100%-2.5rem)]"
      )}
    >
      <div className="flex items-stretch">
        {/* Main content - slides out */}
        <div className="bg-background/80 backdrop-blur-md border border-l-0 rounded-r-xl py-3 px-4 shadow-lg max-w-xs">
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            {t('cookies.message')}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAccept}
              className="text-xs font-medium px-3 py-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              {t('cookies.accept')}
            </button>
            <button
              onClick={handleDecline}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('cookies.decline')}
            </button>
            <Link 
              to="/cookie-policy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              {t('cookies.learnMore')}
            </Link>
          </div>
        </div>

        {/* Tab handle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex flex-col items-center justify-center gap-1 px-2 py-3 bg-background/60 backdrop-blur-sm border border-l-0 rounded-r-lg hover:bg-background/80 transition-colors"
        >
          <Cookie className="h-4 w-4 text-muted-foreground" />
          <ChevronRight 
            className={cn(
              "h-3 w-3 text-muted-foreground transition-transform",
              isExpanded && "rotate-180"
            )} 
          />
        </button>
      </div>
    </div>
  );
};
