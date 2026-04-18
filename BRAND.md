# WoWAtlas — Brand & Tone of Voice

> Single source of truth for product copy, design, and community communication.
> If a piece of UI text or marketing material contradicts this document, this document wins.

---

## Mission

> **EN:** We help people find unbeaten places — and the people who actually know them.
> **RU:** Помогаем находить нехоженые места и людей, которые их знают.

WoWAtlas is not a directory. It's a niche community map for **adventure-travel enthusiasts** who want depth, honesty, and locals over polish, ads, and SEO slop.

## Audience

The people we build for, in priority order:

1. **Niche enthusiasts** — astrophotographers, hikers, kayakers, ethnographers, ski-tourers, birders, fishers, divers, enduro riders.
2. **Local experts** — guides, rangers, photographers who already know a region cold and want a place to share.
3. **Curious independent travelers** who plan their own trips and read every comment before going.

We are **not** building for: package-tour buyers, influencer-driven travel, "100 things to do in X" listicle readers.

## Voice — 4 principles

### 1. Warm, not corporate
Write like an experienced friend who's been there, not a tour operator selling a package.

| ✅ Do | ❌ Don't |
|---|---|
| "Лучшее окно — конец февраля, дороги ещё держат." | "Откройте для себя зимнее очарование Кольского!" |
| "We've been here 6 times. Bring layers — wind ruins more trips than cold." | "Embark on an unforgettable adventure!" |

### 2. Concrete, not flowery
Every sentence should pass the **"so what?"** test. Numbers, durations, distances, names — not adjectives.

| ✅ Do | ❌ Don't |
|---|---|
| "3 часа на УАЗике от Мурманска, последние 12 км — грунт." | "Удалённое и труднодоступное место." |
| "20 min walk from the parking, ~80m elevation, doable in sneakers in summer." | "An easy and rewarding hike." |

### 3. Honest about hardship
We tell people when something is closed, dangerous, expensive, smells bad, or has been ruined by tourists. The hazards layer is a feature, not a footnote.

| ✅ Do | ❌ Don't |
|---|---|
| "Связи нет 40 км. Скачай офлайн-карту заранее." | (silence) |
| "Road closes Nov–Apr. People die here every year — don't go without a guide." | "Best visited year-round!" |

### 4. Bilingual by default
Russian and English are equal first-class citizens. Every user-facing string lives in `src/lib/i18n.ts` with both versions, written by humans. **Never** ship machine-translated copy.

---

## What we don't do

These are **bright lines**. Crossing any of them is a P0 issue.

- ❌ **AI-generated reviews or place descriptions.** Real people, real visits, real words.
- ❌ **Engagement farming.** No fake 🔥, no auto-likes, no "X people viewed this in the last hour."
- ❌ **Selling user data.** Stash, plans, and reactions stay in the user's `localStorage` until we explicitly negotiate otherwise.
- ❌ **Hidden ads.** A creator promoting their own tour is fine if it's labeled. A "top 10 places" sponsored by a tour operator is not.
- ❌ **Generic stock travel imagery.** Real photos from real members or nothing.
- ❌ **Country flag emojis** (🇷🇺 🇺🇸). They politicize neutral content. Use language codes (RU / EN) instead.
- ❌ **Dark patterns.** No friction on unsubscribing, deleting, or leaving.

---

## Lexicon — Do / Don't

| Use this | Not this |
|---|---|
| Place / Место | Destination / Локация |
| Stash / Тайник | Favorites / Избранное |
| Club / Клуб | Community / Сообщество (too corporate) |
| Member / Участник | User / Юзер (in club context) |
| Hazard / Опасность | Warning / Предупреждение (too soft) |
| Spot (a hidden one) / Тайное место | Hidden gem / Жемчужина |
| Route / Маршрут | Itinerary / Программа |
| Curator / Куратор | Admin / Модератор (in club context) |

---

## Emoji vocabulary

These emojis carry meaning across the product. Don't reuse them for unrelated things.

| Emoji | Meaning |
|---|---|
| 🥾 | Route / trip report |
| 📍 | Secret spot |
| ❓ | Ask / question |
| 🤝 | Meetup |
| 📖 | Guide |
| 🔥 | Reaction (community endorsement) |
| 🔖 | Stash (saved place) |
| ⚠️ | Hazard / safety warning |
| 🌌 | Astrotourism niche |
| 🪶 | Ethnography / Indigenous content |
| 🍽️ | Restaurants layer |
| 🛶 | Kayak / SUP |

Free-floating decorative emoji (✨🚀🎉) are discouraged. Each emoji should mean something.

---

## Microcopy — canonical phrases

Reuse these. Don't reinvent.

### Empty states
- **No filtered places (RU):** "Здесь пока тихо. Попробуй другой месяц или ниши."
- **No filtered places (EN):** "Quiet here. Try another month or niches."
- **Empty stash (RU):** "Тайник пуст. Жми 🔖 на местах, которые зацепили."
- **Empty stash (EN):** "Stash is empty. Tap 🔖 on places that hooked you."
- **No club posts in filter (RU):** "Под фильтр ничего не подошло."
- **No club posts in filter (EN):** "Nothing matches the filter."

### Errors
- **Generic save fail (RU):** "Не удалось сохранить. Попробуй ещё раз."
- **Generic save fail (EN):** "Couldn't save. Try again."
- **Network down (RU):** "Сеть пропала. Проверим, когда вернётся."
- **Network down (EN):** "No network. We'll retry when it's back."

### CTAs
- **Open in Telegram (RU):** "Открыть в Telegram"
- **Open in Telegram (EN):** "Open in Telegram"
- **Apply to club (RU):** "Подать заявку"
- **Apply to club (EN):** "Apply to join"
- **Save to stash (RU):** "В тайник"
- **Save to stash (EN):** "Stash it"

### Loading
We don't say "Loading…". Show a skeleton or nothing.

### Success
We don't celebrate trivial actions. No "✓ Saved!" toast for a stash add — the icon state change is enough.

---

## Hosting & community values

Inspired by [vas3k.club](https://vas3k.club). We borrow:
- Manual application review (filter for "ours")
- Small, opinionated community over scale
- One curator with a face and a name, not a faceless team

Things we don't borrow:
- Paid membership (for now — phase 2 if it makes sense)
- Battles / debate format

---

## See also

- [`DESIGN.md`](./DESIGN.md) — visual tokens & component rules
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — code structure & data flow
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — how to add content & code
