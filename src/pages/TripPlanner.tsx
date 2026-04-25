import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Share2, Sparkles } from 'lucide-react';
import { PremiumGate } from '@/components/PremiumGate';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { useTripBuilder } from '@/hooks/useTripBuilder';
import { TripSidebar } from '@/components/trip/TripSidebar';
import { DayColumn } from '@/components/trip/DayColumn';
import { AITripResult } from '@/components/trip/AITripResult';
import { Button } from '@/components/ui/button';
import { Place } from '@/data/kolaPlaces';
import { kolaPlaces } from '@/data/locations';
import { TripDay } from '@/types/trip';
import { toast } from 'sonner';
import { planTrip, isLLMConfigured, LLMUnavailableError, LLMRequestError } from '@/lib/llm';
import { getCredits, decrementCredits } from '@/lib/credits';

const TripPlanner = () => {
  const { language } = useLanguage();
  const isRu = language === 'ru';

  return (
    <PremiumGate feature={isRu ? 'Планировщик поездки' : 'Trip Planner'}>
      <TripPlannerContent />
    </PremiumGate>
  );
};

const TripPlannerContent = () => {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  
  const {
    plan,
    setDates,
    setVehicleType,
    setInterests,
    addPlaceToDay,
    removePlaceFromDay,
    movePlaceBetweenDays,
    reorderPlaceInDay,
    setDaysFromAI,
    totalPlaces,
  } = useTripBuilder();

  const { accessToken } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{
    days: TripDay[];
    tips: string[];
    warnings: string[];
    aiText?: string;
  } | null>(null);
  const [creditsRemaining, setCreditsRemaining] = useState(0);

  useEffect(() => {
    setCreditsRemaining(getCredits(accessToken));
  }, [accessToken]);

  // Drag state
  const [draggedPlaceId, setDraggedPlaceId] = useState<string | null>(null);
  const [draggedFromDayId, setDraggedFromDayId] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, placeId: string, dayId: string) => {
    setDraggedPlaceId(placeId);
    setDraggedFromDayId(dayId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, toDayId: string, toIndex: number) => {
    e.preventDefault();
    if (!draggedPlaceId || !draggedFromDayId) return;

    if (draggedFromDayId === toDayId) {
      // Reorder within same day
      const fromDay = plan.days.find(d => d.id === draggedFromDayId);
      const fromIndex = fromDay?.places.findIndex(p => p.id === draggedPlaceId) ?? -1;
      if (fromIndex !== -1 && fromIndex !== toIndex) {
        reorderPlaceInDay(toDayId, fromIndex, toIndex);
      }
    } else {
      // Move between days
      movePlaceBetweenDays(draggedFromDayId, toDayId, draggedPlaceId, toIndex);
    }

    setDraggedPlaceId(null);
    setDraggedFromDayId(null);
  }, [draggedPlaceId, draggedFromDayId, plan.days, reorderPlaceInDay, movePlaceBetweenDays]);

  const buildDeterministicPlan = useCallback(() => {
    const generateId = () => Math.random().toString(36).substring(2, 9);

    const suitablePlaces = kolaPlaces.filter(p => {
      if (plan.vehicleType === 'no-car' && (p.id === 'rybachy' || p.id === 'sredny')) {
        return false;
      }
      if (plan.vehicleType === 'sedan' && p.howToGet?.includes('4x4')) {
        return false;
      }
      return true;
    });

    const shuffled = [...suitablePlaces].sort(() => Math.random() - 0.5);
    const generatedDays: TripDay[] = plan.days.map((day, i) => ({
      id: generateId(),
      dayNumber: day.dayNumber,
      places: shuffled.slice(i * 2, i * 2 + 2).slice(0, 3),
    }));

    const tips = [
      isRu ? 'Забронируйте жильё заранее в Териберке' : 'Book accommodation in Teriberka in advance',
      isRu ? 'Проверьте прогноз погоды перед выездом' : 'Check weather forecast before departure',
    ];

    const warnings = plan.vehicleType !== '4x4'
      ? [isRu ? 'Рыбачий и Средний недоступны без 4x4' : 'Rybachy and Sredny require 4x4']
      : [];

    return { days: generatedDays, tips, warnings };
  }, [plan.vehicleType, plan.days, isRu]);

  const buildLLMPrompt = useCallback((): string => {
    const days = plan.days.length;
    const vehicle =
      plan.vehicleType === '4x4'
        ? 'внедорожник 4x4'
        : plan.vehicleType === 'sedan'
          ? 'седан'
          : 'без машины';
    const interests =
      plan.interests && plan.interests.length > 0
        ? `Интересы: ${plan.interests.join(', ')}.`
        : '';
    return [
      `У меня поездка на ${days} ${days === 1 ? 'день' : 'дней'} на Кольский полуостров.`,
      `Транспорт: ${vehicle}.`,
      interests,
      'Предложи маршрут по дням с конкретными местами, временем и одной важной заметкой на день.',
    ]
      .filter(Boolean)
      .join(' ');
  }, [plan.days.length, plan.vehicleType, plan.interests]);

  const handleGenerateAI = useCallback(async () => {
    if (!plan.startDate || !plan.endDate) {
      toast.error(isRu ? 'Выберите даты поездки' : 'Select trip dates');
      return;
    }

    setIsGenerating(true);
    const deterministic = buildDeterministicPlan();

    if (!isLLMConfigured() || !accessToken) {
      // No proxy or no buyer token → silently use the deterministic-only plan.
      setAiResult({ ...deterministic });
      setIsGenerating(false);
      return;
    }

    if (creditsRemaining <= 0) {
      toast.error(
        isRu ? 'Кредиты на AI закончились — пригласи друзей чтобы получить больше' : 'Out of AI credits — invite friends to earn more',
      );
      setAiResult({ ...deterministic });
      setIsGenerating(false);
      return;
    }

    try {
      const resp = await planTrip({
        token: accessToken,
        prompt: buildLLMPrompt(),
        region: 'murmansk',
      });
      const remaining = decrementCredits(accessToken);
      setCreditsRemaining(remaining);
      setAiResult({ ...deterministic, aiText: resp.text });
    } catch (e) {
      if (e instanceof LLMUnavailableError) {
        toast.warning(isRu ? 'AI офлайн — показал базовый план' : 'AI offline — showing fallback plan');
        setAiResult({ ...deterministic });
      } else if (e instanceof LLMRequestError) {
        const msg =
          e.code === 'invalid_token'
            ? isRu ? 'Токен не распознан' : 'Token not recognized'
            : e.code === 'region_not_unlocked'
              ? isRu ? 'Регион не открыт для тебя' : 'Region not unlocked'
              : isRu ? 'AI временно недоступен' : 'AI temporarily unavailable';
        toast.error(msg);
        setAiResult({ ...deterministic });
      } else {
        toast.error(isRu ? 'Что-то пошло не так' : 'Something went wrong');
        setAiResult({ ...deterministic });
      }
    } finally {
      setIsGenerating(false);
    }
  }, [
    plan.startDate,
    plan.endDate,
    isRu,
    buildDeterministicPlan,
    buildLLMPrompt,
    accessToken,
    creditsRemaining,
  ]);

  const handleAcceptAI = useCallback(() => {
    if (aiResult) {
      setDaysFromAI(aiResult.days);
      setAiResult(null);
      toast.success(isRu ? 'Маршрут добавлен!' : 'Route added!');
    }
  }, [aiResult, setDaysFromAI, isRu]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {isRu ? 'Карта' : 'Map'}
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">
              {isRu ? '🗺️ Планировщик маршрута' : '🗺️ Trip Planner'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {accessToken && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                {creditsRemaining} {isRu ? 'кредитов' : 'credits'}
              </span>
            )}
            <Button variant="outline" size="sm" disabled={totalPlaces === 0}>
              <Share2 className="h-4 w-4 mr-1" />
              {isRu ? 'Поделиться' : 'Share'}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <TripSidebar
              plan={plan}
              onDatesChange={setDates}
              onVehicleChange={setVehicleType}
              onInterestsChange={setInterests}
              onGenerateAI={handleGenerateAI}
              isGenerating={isGenerating}
              totalPlaces={totalPlaces}
            />

            {/* AI Result */}
            {aiResult && (
              <div className="mt-4">
                <AITripResult
                  days={aiResult.days}
                  tips={aiResult.tips}
                  warnings={aiResult.warnings}
                  aiText={aiResult.aiText}
                  onAccept={handleAcceptAI}
                  onEdit={() => setAiResult(null)}
                />
              </div>
            )}
          </aside>

          {/* Days grid */}
          <main className="flex-1">
            {plan.days.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <p className="text-lg mb-2">
                  {isRu ? 'Выберите даты поездки' : 'Select your trip dates'}
                </p>
                <p className="text-sm">
                  {isRu 
                    ? 'Выберите даты слева, чтобы начать планирование'
                    : 'Pick dates on the left to start planning'}
                </p>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                {plan.days.map((day) => (
                  <div key={day.id} className="snap-start">
                    <DayColumn
                      day={day}
                      startDate={plan.startDate}
                      onAddPlace={addPlaceToDay}
                      onRemovePlace={removePlaceFromDay}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
