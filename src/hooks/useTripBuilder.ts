import { useState, useCallback } from 'react';
import { TripDay, TripPlan, VehicleType } from '@/types/trip';
import { Place } from '@/data/kolaPlaces';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useTripBuilder = () => {
  const [plan, setPlan] = useState<TripPlan>(() => ({
    id: generateId(),
    name: '',
    startDate: null,
    endDate: null,
    vehicleType: 'crossover',
    days: [],
    interests: [],
    createdAt: new Date(),
  }));

  const setDates = useCallback((start: Date | null, end: Date | null) => {
    setPlan(prev => {
      const newDays: TripDay[] = [];
      if (start && end) {
        const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        for (let i = 0; i < Math.min(dayCount, 14); i++) {
          // Preserve existing places if day exists
          const existingDay = prev.days[i];
          newDays.push({
            id: existingDay?.id || generateId(),
            dayNumber: i + 1,
            places: existingDay?.places || [],
          });
        }
      }
      return { ...prev, startDate: start, endDate: end, days: newDays };
    });
  }, []);

  const setVehicleType = useCallback((vehicleType: VehicleType) => {
    setPlan(prev => ({ ...prev, vehicleType }));
  }, []);

  const setInterests = useCallback((interests: string[]) => {
    setPlan(prev => ({ ...prev, interests }));
  }, []);

  const addPlaceToDay = useCallback((dayId: string, place: Place) => {
    setPlan(prev => ({
      ...prev,
      days: prev.days.map(day =>
        day.id === dayId
          ? { ...day, places: [...day.places, place] }
          : day
      ),
    }));
  }, []);

  const removePlaceFromDay = useCallback((dayId: string, placeId: string) => {
    setPlan(prev => ({
      ...prev,
      days: prev.days.map(day =>
        day.id === dayId
          ? { ...day, places: day.places.filter(p => p.id !== placeId) }
          : day
      ),
    }));
  }, []);

  const movePlaceBetweenDays = useCallback((
    fromDayId: string,
    toDayId: string,
    placeId: string,
    toIndex: number
  ) => {
    setPlan(prev => {
      const fromDay = prev.days.find(d => d.id === fromDayId);
      const place = fromDay?.places.find(p => p.id === placeId);
      if (!place) return prev;

      return {
        ...prev,
        days: prev.days.map(day => {
          if (day.id === fromDayId) {
            return { ...day, places: day.places.filter(p => p.id !== placeId) };
          }
          if (day.id === toDayId) {
            const newPlaces = [...day.places];
            newPlaces.splice(toIndex, 0, place);
            return { ...day, places: newPlaces };
          }
          return day;
        }),
      };
    });
  }, []);

  const reorderPlaceInDay = useCallback((dayId: string, fromIndex: number, toIndex: number) => {
    setPlan(prev => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.id !== dayId) return day;
        const newPlaces = [...day.places];
        const [removed] = newPlaces.splice(fromIndex, 1);
        newPlaces.splice(toIndex, 0, removed);
        return { ...day, places: newPlaces };
      }),
    }));
  }, []);

  const setDaysFromAI = useCallback((days: TripDay[]) => {
    setPlan(prev => ({ ...prev, days }));
  }, []);

  const clearPlan = useCallback(() => {
    setPlan(prev => ({
      ...prev,
      days: prev.days.map(day => ({ ...day, places: [] })),
    }));
  }, []);

  const totalPlaces = plan.days.reduce((sum, day) => sum + day.places.length, 0);

  return {
    plan,
    setDates,
    setVehicleType,
    setInterests,
    addPlaceToDay,
    removePlaceFromDay,
    movePlaceBetweenDays,
    reorderPlaceInDay,
    setDaysFromAI,
    clearPlan,
    totalPlaces,
  };
};
