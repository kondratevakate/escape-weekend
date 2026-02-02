import { resources } from '@/data/resources';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, ExternalLink } from 'lucide-react';

export const ResourcesSection = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-2 overflow-hidden">
      <div className="flex items-center gap-2 px-1">
        <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
        <h3 className="text-xs font-semibold text-foreground truncate">
          {language === 'ru' ? 'Ресурсы' : 'Resources'}
        </h3>
      </div>
      
      <div className="space-y-1.5">
        {resources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-sm p-2"
          >
            <span className="text-xl shrink-0">{resource.emoji}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-xs text-foreground line-clamp-1">
                {language === 'ru' ? resource.name : resource.nameEn}
              </h4>
              <p className="text-[10px] text-muted-foreground line-clamp-1">
                {language === 'ru' ? resource.description : resource.descriptionEn}
              </p>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
};
