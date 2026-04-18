# Adding a new map layer

Use the **Hazards** layer (`src/data/hazardsLayer.ts` + relevant blocks in `src/components/map/MapView.tsx`) as the canonical reference.

The pattern is **5 steps**.

## 1. Data

Create `src/data/myLayer.ts`:

```ts
export interface MyLayerItem {
  id: string;
  name: { ru: string; en: string };
  coordinates: [number, number];
  // …whatever metadata your layer needs
}

export const myLayerItems: MyLayerItem[] = [
  // real entries only
];
```

Real data only. No mock entries. If you have nothing real yet, don't ship the layer.

## 2. Ref in MapView

In `src/components/map/MapView.tsx`, add a ref next to the others:

```ts
const myLayerRef = useRef<L.LayerGroup | null>(null);
```

## 3. Effect

Add a `useEffect` that creates the layer when `showMyLayer` is `true` and removes it when `false`:

```ts
useEffect(() => {
  if (!mapInstanceRef.current) return;

  if (showMyLayer && !myLayerRef.current) {
    const group = L.layerGroup();
    myLayerItems.forEach((item) => {
      L.marker(item.coordinates, { icon: myIcon(item) })
        .bindPopup(/* popup HTML */)
        .addTo(group);
    });
    group.addTo(mapInstanceRef.current);
    myLayerRef.current = group;
  }

  if (!showMyLayer && myLayerRef.current) {
    mapInstanceRef.current.removeLayer(myLayerRef.current);
    myLayerRef.current = null;
  }
}, [showMyLayer]);
```

## 4. Toggle

Wire the toggle through the prop chain:

- `src/pages/Index.tsx` — add `showMyLayer` state + `onToggleMyLayer` handler
- `src/components/map/KolaMap.tsx` — pass them through
- `src/components/map/MapView.tsx` — accept as props
- `src/components/map/CategoryFilter.tsx` — add the button (use a meaningful emoji from [`BRAND.md`](../BRAND.md))

## 5. i18n

Add labels to `src/lib/i18n.ts`:

```ts
ru: { 'layer.myLayer': 'Моя штука', /* ... */ },
en: { 'layer.myLayer': 'My thing', /* ... */ },
```

Both languages, by hand.

---

## Don'ts

- ❌ Don't query an external API at runtime. All map data is bundled.
- ❌ Don't add a layer with fewer than ~5 real items — it'll feel empty.
- ❌ Don't use raw hex colors for marker icons. Use HSL tokens from `src/index.css`.
- ❌ Don't forget cleanup in the effect — leaked Leaflet layers slow the map down.
