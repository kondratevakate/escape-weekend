

# Plan: Migrate to `locations.json` and Remove Fake Content

## Scope of Changes

This is a significant refactor touching the data layer and the PlaceCard UI. Two main goals:
1. **New data source**: `src/data/locations.json` with the user's schema
2. **Remove fake content** from PlaceCard: mock images, AI summary, reviews, ratings, like counts

## Files to Create

### `src/data/locations.json`
- JSON array with all 25 existing `kolaPlaces` entries, mapped to the new schema
- New fields: `tags`, `season`, `what_to_do`, `pairing`, `permit_required`, `hidden_gem`, `photo_url`
- `photo_url` will be `""` (empty) for all entries — user fills manually
- `description` kept from existing data
- Placeholder text for `what_to_do` and `pairing` (e.g., "TODO: fill in")

### `src/data/locations.ts` (adapter)
- Import from `locations.json`
- Export `Location` TypeScript interface matching the JSON schema
- Export `locations` array (typed)
- Export a `toPlace()` converter function that maps `Location` → existing `Place` type for backward compatibility with map/trip/share components
- Export `kolaPlaces` (converted) so all existing imports still work without changing 20 files
- Re-export `Place`, `PlaceCategory`, `categoryConfig` from existing `kolaPlaces.ts`

## Files to Modify

### `src/data/kolaPlaces.ts`
- Keep `Place` interface, `PlaceCategory`, `categoryConfig` (types + config only)
- **Remove** the `kolaPlaces` array — data now lives in `locations.json`
- Components that import `kolaPlaces` will get it from the adapter instead

### `src/components/map/PlaceCard.tsx` — Major cleanup
- **Remove**: `getMockPlaceData()`, `getMockReviews()`, all mock image/rating/review data
- **Remove**: Rating badge (Star 4.7, 167 reviews)
- **Remove**: AI Summary block (lines 294-302)
- **Remove**: Collapsible Reviews section (lines 304-370)
- **Remove**: Like button on photo with fake count (lines 226-243)
- **Remove**: Double-tap heart animation logic
- **Remove**: `usePlaceStats` import and usage
- **Keep**: Close button, Bookmark button, category badge, title, description, Share button
- **Add**: Show `photo_url` if available (from Location data), otherwise show category icon placeholder
- **Add**: Show new fields from Location if available: tags, season, what_to_do

### `src/components/map/ExploreMode.tsx`
- **Remove**: `getPlaceImage()` mock function
- **Remove**: Star rating badge (line 144-147)
- **Remove**: Social stats (likes/shares count, lines 183-192)
- **Remove**: `useAllPlaceStats` import
- Use `photo_url` from location data or show placeholder

### `src/components/landing/PlaceListCard.tsx`
- **Remove**: Heart count from `usePlaceStats` (line 59-62)
- **Remove**: `usePlaceStats` import
- Keep category label and favorite button

### `src/hooks/usePlaceStats.ts`
- **Delete** this file entirely — all fake stats removed

### `src/data/collections.ts`
- Keep as-is (references place IDs which remain the same)
- The unsplash images in collections are fine — they're collection cover images, not place photos

## Import Migration Strategy

Since ~20 files import from `@/data/kolaPlaces`, the adapter in `locations.ts` will re-export everything needed:

```typescript
// src/data/locations.ts
import locationsData from './locations.json';
export { Place, PlaceCategory, categoryConfig } from './kolaPlaces';

export interface Location { /* new schema */ }
export const locations: Location[] = locationsData;
export const kolaPlaces: Place[] = locations.map(toPlace);
```

Then update imports in files that use `kolaPlaces` array to import from `@/data/locations` instead. Files that only import types (`Place`, `categoryConfig`) can stay pointing at `kolaPlaces.ts`.

## Technical Details

### Location → Place mapping
```typescript
function toPlace(loc: Location): Place {
  return {
    id: loc.id,
    name: loc.name,
    nameEn: loc.name_en,
    description: loc.description,
    category: inferCategory(loc.tags), // map tags to PlaceCategory
    coordinates: loc.coordinates as [number, number],
    region: loc.region,
    whenToVisit: loc.season.join(', '),
    howToGet: loc.what_to_do, // approximate mapping
    warning: loc.permit_required ? 'Permit required' : undefined,
  };
}
```

### Tag → Category mapping
```
villages → village, nature → nature, hiking → hiking,
museums → museum, cities → city, reserves → reserve,
attractions → attraction
```

### Files that need import path updates (from `kolaPlaces` to `locations`)
Only files importing the `kolaPlaces` **array**: Index.tsx, KolaMap.tsx, TripPlanner.tsx, DayColumn.tsx, CollectionShareButton.tsx, HiddenGems.tsx, ExploreMode.tsx (7 files)

