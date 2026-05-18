import { memo } from 'react';
import { Calendar, Car, Sparkles } from 'lucide-react';
import { TripPlan, VehicleType, vehicleLabels, interestOptions } from '@/types/trip';
import { useLanguage } from '@/contexts/LanguageContext';
import { pluralCreditsRu } from '@/lib/credits';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

interface TripSidebarProps {
  plan: TripPlan;
  onDatesChange: (start: Date | null, end: Date | null) => void;
  onVehicleChange: (vehicle: VehicleType) => void;
  onInterestsChange: (interests: string[]) => void;
  onGenerateAI: () => void;
  isGenerating?: boolean;
  totalPlaces: number;
  /**
   * Live credit balance. `null` = no buyer token in scope (telegram WebApp /
   * dev mode / admin) — credits UI is hidden. `0` = exhausted, AI button is
   * disabled with a referral hint. Positive = normal operation.
   */
  creditsRemaining?: number | null;
}

export const TripSidebar = memo(({
  plan,
  onDatesChange,
  onVehicleChange,
  onInterestsChange,
  onGenerateAI,
  isGenerating = false,
  totalPlaces,
  creditsRemaining = null,
}: TripSidebarProps) => {
  const { language } = useLanguage();
  const isRu = language === 'ru';

  const toggleInterest = (id: string) => {
    if (plan.interests.includes(id)) {
      onInterestsChange(plan.interests.filter(i => i !== id));
    } else {
      onInterestsChange([...plan.interests, id]);
    }
  };

  const formatDateRange = () => {
    if (!plan.startDate || !plan.endDate) {
      return isRu ? 'Выберите даты' : 'Select dates';
    }
    const locale = isRu ? ru : enUS;
    return `${format(plan.startDate, 'd MMM', { locale })} — ${format(plan.endDate, 'd MMM', { locale })}`;
  };

  return (
    <Card className="p-4 space-y-5 bg-card">
      {/* Dates */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          <Calendar className="inline h-4 w-4 mr-1" />
          {isRu ? 'Даты поездки' : 'Trip dates'}
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !plan.startDate && "text-muted-foreground"
              )}
            >
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="range"
              selected={{
                from: plan.startDate || undefined,
                to: plan.endDate || undefined,
              }}
              onSelect={(range) => {
                onDatesChange(range?.from || null, range?.to || null);
              }}
              locale={isRu ? ru : enUS}
              numberOfMonths={1}
              disabled={{ before: new Date() }}
            />
          </PopoverContent>
        </Popover>
        {plan.days.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {plan.days.length} {isRu ? 'дней' : 'days'}
          </p>
        )}
      </div>

      {/* Vehicle */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          <Car className="inline h-4 w-4 mr-1" />
          {isRu ? 'Транспорт' : 'Vehicle'}
        </label>
        <Select value={plan.vehicleType} onValueChange={onVehicleChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(vehicleLabels) as VehicleType[]).map((type) => (
              <SelectItem key={type} value={type}>
                {isRu ? vehicleLabels[type].ru : vehicleLabels[type].en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Interests */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          {isRu ? 'Интересы' : 'Interests'}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {interestOptions.map((option) => (
            <Badge
              key={option.id}
              variant={plan.interests.includes(option.id) ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors",
                plan.interests.includes(option.id) && "bg-primary"
              )}
              onClick={() => toggleInterest(option.id)}
            >
              {isRu ? option.labelRu : option.labelEn}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats */}
      {totalPlaces > 0 && (
        <div className="pt-2 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            {isRu ? 'Добавлено мест:' : 'Places added:'}{' '}
            <span className="font-medium text-foreground">{totalPlaces}</span>
          </p>
        </div>
      )}

      {/* AI Generate */}
      <Button
        className="w-full"
        size="lg"
        onClick={onGenerateAI}
        disabled={!plan.startDate || !plan.endDate || isGenerating || creditsRemaining === 0}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {isGenerating
          ? (isRu ? 'Генерирую...' : 'Generating...')
          : creditsRemaining === 0
            ? (isRu ? 'Кредиты закончились' : 'Out of credits')
            : (isRu ? 'AI: Собери маршрут' : 'AI: Build route')}
      </Button>
      <p className="text-xs text-center text-muted-foreground -mt-2">
        {creditsRemaining === 0
          ? (isRu ? 'Пригласи друга в боте — +50 кредитов' : 'Invite a friend in the bot — +50 credits')
          : creditsRemaining != null
            ? (isRu
                ? `Осталось ${creditsRemaining} ${pluralCreditsRu(creditsRemaining)}`
                : `${creditsRemaining} ${creditsRemaining === 1 ? 'credit' : 'credits'} left`)
            : (isRu ? '1 кредит за вызов' : '1 credit per call')}
      </p>
    </Card>
  );
});

TripSidebar.displayName = 'TripSidebar';
