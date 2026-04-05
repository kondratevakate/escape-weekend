

# Remove Offline Download & Health Check

## Changes

### 1. Remove OfflineDownload from Header
**File: `src/components/landing/Header.tsx`**
- Remove `import { OfflineDownload }` (line 10)
- Remove `<OfflineDownload />` usage (lines 98-99)

### 2. Delete OfflineDownload component
**File: `src/components/map/OfflineDownload.tsx`** — delete entirely

### 3. Verify app health
After removal, confirm:
- No broken imports
- Header renders cleanly without the download button
- Map, sidebar, roles, promo sharing all still work

