import { Place } from '@/data/kolaPlaces';
import { useLanguage } from '@/contexts/LanguageContext';

const BOT_USERNAME = 'KolaGuideBot';

export const useSharePostcard = () => {
  const { language } = useLanguage();

  const generatePostcardText = (place: Place): string => {
    const isRu = language === 'ru';
    const name = place.name;
    const description = place.description || '';
    
    // Build structured postcard
    const lines: string[] = [
      `📍 ${name}`,
      '',
    ];

    if (description) {
      lines.push(description);
      lines.push('');
    }

    // When to visit
    const when = isRu ? place.whenToVisit : place.whenToVisitEn;
    if (when) {
      lines.push(`📅 ${isRu ? 'Когда' : 'When'}: ${when}`);
    }

    // How to get there
    const how = isRu ? place.howToGet : place.howToGetEn;
    if (how) {
      lines.push(`🚗 ${isRu ? 'Как' : 'How'}: ${how}`);
    }

    // Warning
    const warning = isRu ? place.warning : place.warningEn;
    if (warning) {
      lines.push(`⚠️ ${warning}`);
    }

    lines.push('');
    lines.push(`🗺️ ${isRu ? 'Кольский полуостров' : 'Kola Peninsula'}`);

    return lines.join('\n');
  };

  const generateGoogleMapsUrl = (place: Place): string => {
    return `https://www.google.com/maps/search/?api=1&query=${place.coordinates[0]},${place.coordinates[1]}`;
  };

  const generateTelegramDeepLink = (place: Place): string => {
    return `https://t.me/${BOT_USERNAME}?start=place_${place.id}`;
  };

  const generateFullShareText = (place: Place): string => {
    const postcard = generatePostcardText(place);
    const mapsUrl = generateGoogleMapsUrl(place);
    return `${postcard}\n\n${mapsUrl}`;
  };

  return {
    generatePostcardText,
    generateGoogleMapsUrl,
    generateTelegramDeepLink,
    generateFullShareText,
  };
};
