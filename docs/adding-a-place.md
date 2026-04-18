# Adding a place to the map

This guide is for **non-coders too**. If you'd rather not touch JSON, just open an issue using the [New Place template](../.github/ISSUE_TEMPLATE/new_place.md) and the curator will add it for you.

## What you need before you start

- **Coordinates** — get them by right-clicking the spot in [openstreetmap.org](https://www.openstreetmap.org) → "Show address". Format is `lat, lon` (e.g. `68.9647, 33.0863`).
- **A short description in your own words** — no Wikipedia copy-paste, no AI text.
- **Best months to visit** and why.
- **Optional but appreciated:** one real photo, a hazard note if there is one.

## File to edit

`src/data/locations.json` — single source of truth for all places.

## Schema

```json
{
  "id": "kebab-case-id",
  "name": { "ru": "Хибины", "en": "Khibiny" },
  "category": "hiking",
  "coordinates": [67.7561, 33.6322],
  "description": {
    "ru": "Конкретный, тёплый текст в 1–3 предложениях.",
    "en": "Concrete, warm text in 1–3 sentences."
  },
  "seasons": ["winter", "spring", "summer", "autumn"],
  "tags": ["mountains", "skitour"],
  "duration": "1–3 days",
  "difficulty": "moderate",
  "onlyHere": {
    "food": [],
    "experience": [],
    "shopping": []
  },
  "warnings": []
}
```

Allowed `category` values: `nature`, `hiking`, `museum`, `attraction`, `village`, `city`, `reserve`, `restaurant`.

## Steps

1. Open `src/data/locations.json`.
2. Find a similar entry to copy as a template (see Khibiny, Teriberka).
3. Add your entry. Keep IDs unique and lowercase-kebab.
4. Run `npm run dev` and check the place appears at the right spot.
5. Run `npm run check` to make sure nothing breaks.
6. Commit with `feat: add place <name>` and open a PR.

## Voice checklist

Before submitting, re-read [`BRAND.md`](../BRAND.md). Your description should:
- Pass the "so what?" test (numbers, durations, names — not adjectives)
- Mention any real hardship (no signal, bad road, closed in winter)
- Sound like a friend, not a brochure
- Exist in **both** RU and EN (write both yourself, don't machine-translate)

## Common mistakes

- ❌ "An unforgettable place full of magic." → Too vague.
- ❌ Coordinates pasted as `"67.7561 N, 33.6322 E"` → Use a number array.
- ❌ Same text in RU and EN with Google Translate → Don't.
- ❌ Description longer than 3 sentences → Move the rest into a club post.
