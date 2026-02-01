import { forwardRef } from 'react';
import { KolaMap } from '@/components/map/KolaMap';

export const MapSection = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <section ref={ref} className="relative">
      <div className="h-[80vh] md:h-screen w-full rounded-t-3xl overflow-hidden shadow-2xl">
        <KolaMap embedded />
      </div>
    </section>
  );
});

MapSection.displayName = 'MapSection';
