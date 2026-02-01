import { useRef } from 'react';
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { MapSection } from '@/components/landing/MapSection';
import { CookieConsent } from '@/components/CookieConsent';

const Index = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-14">
        <Hero onExplore={scrollToMap} />
        <MapSection ref={mapRef} />
      </main>
      <CookieConsent />
    </div>
  );
};

export default Index;
