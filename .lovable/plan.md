

# Fix: Terrain layer — add actual tile switching

## Problem
The terrain toggle button exists in the UI but does nothing. The `showTerrainLayer` prop is received in `MapView` but there's no `useEffect` that swaps the tile layer.

## Solution

**File: `src/components/map/MapView.tsx`**

Add a `useEffect` that reacts to `showTerrainLayer`:

- When **ON**: remove the default CartoDB Positron tiles, add **OpenTopoMap** tiles (`https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png`) — free, no API key, shows terrain/elevation/contours
- When **OFF**: remove OpenTopoMap, restore CartoDB Positron

OpenTopoMap is a free topographic map based on OSM data that shows relief, contour lines, and elevation — exactly what the user's screenshot shows. No API key needed.

### Why OpenTopoMap (not Stamen Terrain)
Stamen Terrain tiles moved to Stadia Maps and now require an API key. OpenTopoMap is fully free and looks similar to the user's reference image with contour lines and landscape visualization.

### Implementation detail
```
useEffect: showTerrainLayer
  if (showTerrainLayer):
    baseTileRef.current?.remove()
    terrainTileRef.current = L.tileLayer(opentopomap_url).addTo(map)
  else:
    terrainTileRef.current?.remove()
    terrainTileRef.current = null
    baseTileRef.current = L.tileLayer(carto_url).addTo(map)
```

One `useEffect`, one file changed.

