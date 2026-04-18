# Data sources & licenses

Where the data on the map comes from, and what licenses it carries.

| Layer | Source | License |
|---|---|---|
| Base map tiles | [CartoDB Positron](https://carto.com/basemaps/) | Free for non-commercial use, attribution required |
| Underlying geodata | [OpenStreetMap](https://www.openstreetmap.org) contributors | [ODbL 1.0](https://opendatacommons.org/licenses/odbl/) |
| Places (`locations.json`) | Curated by the WoWAtlas community | AGPL-3.0 (same as code) |
| Hazards (`hazardsLayer.ts`) | News reports, ranger statements, member experience | Each entry has a `source` field |
| Indigenous peoples | Public ethnographic sources, peer-reviewed | Cited per entry |
| UNESCO sites | [UNESCO World Heritage list](https://whc.unesco.org/) | Public domain |
| Restaurants | Curated by community + visited by curator | AGPL-3.0 |

## Attribution requirements

When you embed or fork the map, you **must** keep:

1. The OpenStreetMap attribution link in the bottom-right corner of the map (Leaflet does this by default — don't strip it).
2. The CartoDB attribution.
3. A link back to the WoWAtlas source if you redistribute substantial portions of `locations.json` (AGPL-3.0 obligation).

## How to add data responsibly

- **Verify before adding.** A wrong coordinate sends people to the wrong forest. A wrong hazard wastes their time or worse.
- **Cite when possible.** Especially for hazards (link the news article, the ranger notice).
- **Don't scrape.** No automated import of someone else's curated dataset without their explicit permission and license check.
- **No copyrighted descriptions.** Wikipedia text is CC-BY-SA, which is incompatible with our voice rules anyway. Write your own.

## Photos

If you contribute a photo:
- It must be yours, or licensed under a permissive license (CC0, CC-BY).
- Note the license + author in the PR description.
- We'll add credit in the place's metadata.
