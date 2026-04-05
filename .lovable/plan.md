

# Fix: Map "popping forward" while UI feels darkened

## Problem
The warm background color (`hsl(45 30% 96%)`) on the header, sidebar, and footer creates a yellowish tint that contrasts sharply with the bright white map tiles. Combined with `bg-background/95 backdrop-blur-md` on the header, the surrounding UI elements appear visually "dimmed" while the map stands out unnaturally bright.

## Solution

### 1. Remove `backdrop-blur` from the header
Replace `bg-background/95 backdrop-blur-md` with solid `bg-background` on the header. Per the performance note, `backdrop-blur` re-samples pixels underneath on every frame and creates an unwanted darkening effect over the map.

**File:** `src/components/landing/Header.tsx` (line 65)
- Change: `bg-background/95 backdrop-blur-md` → `bg-background`

### 2. Also fix the sidebar toggle button
The toggle button on the map uses `bg-background/95 backdrop-blur-sm` — same issue.

**File:** `src/pages/Index.tsx` (line 178)
- Change: `bg-background/95 backdrop-blur-sm` → `bg-background shadow-md`

### 3. Lighten the background to reduce contrast with map tiles
Shift `--background` slightly closer to neutral white so the UI surrounding the map doesn't feel so warm/dark relative to the bright map tiles.

**File:** `src/index.css`
- `--background: 45 30% 96%` → `--background: 40 20% 97%` (lighter, less yellow)
- `--card: 40 25% 98%` → `--card: 40 15% 98%` (more neutral)

### 4. Fix empty-state overlay too
Line 230 in `Index.tsx` also uses `bg-background/95 backdrop-blur-sm` — make it solid.

## Summary
Four small edits across three files. The main fix is removing `backdrop-blur` from elements overlaying the map and making the background color more neutral so the map doesn't appear to "pop forward."

