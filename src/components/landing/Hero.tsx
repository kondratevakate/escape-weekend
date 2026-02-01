import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
}

export const Hero = ({ onExplore }: HeroProps) => {
  const { t } = useLanguage();

  return (
    <section className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6 py-16 md:py-24">
      <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight max-w-4xl leading-tight">
        {t('landing.headline')}
      </h1>
      
      <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
        {t('landing.subheadline')}
      </p>
      
      <div className="mt-10 flex items-center gap-4">
        <Button 
          size="lg" 
          onClick={onExplore}
          className="px-8 py-6 text-base rounded-full"
        >
          {t('landing.cta')}
        </Button>
      </div>
      
      <button 
        onClick={onExplore}
        className="mt-16 animate-bounce text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Scroll to map"
      >
        <ArrowDown className="h-6 w-6" />
      </button>
    </section>
  );
};
