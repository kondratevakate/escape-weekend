import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONSENT_KEY = 'cookie_consent';

export const CookieConsent = () => {
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) {
        // Small delay for better UX
        const timer = setTimeout(() => setShowBanner(true), 1000);
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
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[2000] animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-card border rounded-xl shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm text-foreground mb-3">
              {t('cookies.message')}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={handleAccept}>
                {t('cookies.accept')}
              </Button>
              <Button size="sm" variant="outline" onClick={handleDecline}>
                {t('cookies.decline')}
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link to="/cookie-policy">
                  {t('cookies.learnMore')}
                </Link>
              </Button>
            </div>
          </div>
          <button 
            onClick={handleDecline}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
