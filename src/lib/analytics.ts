// Analytics event types for growth tracking
export type AnalyticsEvent =
  // Virality
  | { event: 'share_place'; placeId: string; method: 'telegram' | 'copy' | 'native' }
  | { event: 'share_collection'; collectionId: string; method: 'telegram' | 'copy' }
  | { event: 'share_plan'; planId: string; method: 'telegram' | 'copy' }
  
  // Retention
  | { event: 'save_to_list'; placeId: string; listId: string }
  | { event: 'create_plan'; planId: string; days: number }
  | { event: 'place_discovered'; placeId: string }
  
  // Telegram bridge
  | { event: 'telegram_cta_shown'; trigger: string }
  | { event: 'telegram_cta_clicked'; trigger: string }
  
  // Engagement
  | { event: 'explore_mode_started' }
  | { event: 'place_liked'; placeId: string }
  | { event: 'place_skipped'; placeId: string };

// Simple analytics tracker - can be extended with real provider (Amplitude, Mixpanel, etc.)
class Analytics {
  private enabled: boolean = true;
  private events: AnalyticsEvent[] = [];

  track(eventData: AnalyticsEvent) {
    if (!this.enabled) return;

    // Add timestamp
    const eventWithMeta = {
      ...eventData,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
    };

    // Log in development
    if (import.meta.env.DEV) {
      console.log('[Analytics]', eventWithMeta);
    }

    // Store locally for debugging
    this.events.push(eventData);

    // TODO: Send to real analytics provider
    // Example: amplitude.track(eventData.event, eventData);
    // Example: mixpanel.track(eventData.event, eventData);
  }

  // Get recent events (for debugging)
  getRecentEvents(limit: number = 50): AnalyticsEvent[] {
    return this.events.slice(-limit);
  }

  // Clear events
  clearEvents() {
    this.events = [];
  }

  // Disable tracking (e.g., for GDPR)
  disable() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }
}

// Singleton instance
export const analytics = new Analytics();

// Convenience function
export const track = (eventData: AnalyticsEvent) => analytics.track(eventData);
