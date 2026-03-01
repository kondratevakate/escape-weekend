import { useState, useCallback } from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { PremiumGate } from '@/components/PremiumGate';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTripBuilder } from '@/hooks/useTripBuilder';
import { TripSidebar } from '@/components/trip/TripSidebar';
import { DayColumn } from '@/components/trip/DayColumn';
import { AITripResult } from '@/components/trip/AITripResult';
import { Button } from '@/components/ui/button';
import { Place } from '@/data/kolaPlaces';
import { kolaPlaces } from '@/data/locations';
import { TripDay } from '@/types/trip';
import { toast } from 'sonner';

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

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{
    days: TripDay[];
    tips: string[];
    warnings: string[];
  } | null>(null);

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

  const handleGenerateAI = useCallback(async () => {
    if (!plan.startDate || !plan.endDate) {
      toast.error(isRu ? 'Выберите даты поездки' : 'Select trip dates');
      return;
    }

    setIsGenerating(true);
    
    // Mock AI generation (will be replaced with real API call)
    setTimeout(() => {
      const generateId = () => Math.random().toString(36).substring(2, 9);
      
      // Simple mock logic based on interests and vehicle
      const suitablePlaces = kolaPlaces.filter(p => {
        // Filter based on vehicle
        if (plan.vehicleType === 'no-car' && (p.id === 'rybachy' || p.id === 'sredny')) {
          return false;
        }
        if (plan.vehicleType === 'sedan' && p.howToGet?.includes('4x4')) {
          return false;
        }
        return true;
      });

      const shuffled = [...suitablePlaces].sort(() => Math.random() - 0.5);
      const placesPerDay = Math.ceil(shuffled.length / plan.days.length);

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

      setAiResult({ days: generatedDays, tips, warnings });
      setIsGenerating(false);
    }, 2000);
  }, [plan, isRu]);

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
          <Button variant="outline" size="sm" disabled={totalPlaces === 0}>
            <Share2 className="h-4 w-4 mr-1" />
            {isRu ? 'Поделиться' : 'Share'}
          </Button>
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
