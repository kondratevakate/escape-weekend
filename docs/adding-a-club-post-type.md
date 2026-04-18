# Adding a club post type

The 5 existing types (`route`, `spot`, `ask`, `meetup`, `guide`) live in `src/types/club.ts`.

## 1. Type

In `src/types/club.ts`:

```ts
export type ClubPostType = 'route' | 'spot' | 'ask' | 'meetup' | 'guide' | 'mytype';
```

## 2. Metadata

Add to `POST_TYPE_META` in the same file:

```ts
mytype: {
  emoji: '🎒',                        // unique, meaningful
  color: 'hsl(45 80% 50%)',           // HSL only — drives the left border stripe
  ru: 'Моя штука',
  en: 'My thing',
},
```

## 3. (Optional) Type-specific fields

If your type needs extra fields (e.g. `meetup` has `date`/`location`), add them as **optional** to the `ClubPost` interface:

```ts
export interface ClubPost {
  // ... existing
  myField?: string;
}
```

Keep them optional so existing seed data still validates.

## 4. Wizard step

`src/pages/ClubNewPost.tsx` is the 3-step wizard. Add input(s) for your new fields in the content step.

## 5. Render

- `src/components/club/PostCard.tsx` — show your type-specific summary on the feed card
- `src/pages/ClubPost.tsx` — show full content on the detail page

## Voice & color checklist

- Emoji should not collide with the [emoji vocabulary](../BRAND.md#emoji-vocabulary).
- Color should be visually distinct from existing post types (rotate hue ~60°).
- RU and EN labels written by hand.
