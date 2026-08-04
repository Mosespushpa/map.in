# Map.in — Amazon Q Rules

## Project Identity
- Name: **Map.in**
- Subtitle: Historical Geography Explorer of India
- Stack: HTML, CSS, Vanilla JavaScript, inline SVG India map
- No frameworks, no build tools, no external dependencies except Font Awesome CDN

---

## Current Architecture

### File Structure
```
map/
├── index.html          — Entry point, inline SVG map, all HTML structure
├── script.js           — Core app: all data inline, state handlers, panel logic
├── style.css           — All styles: layout, map, panel, overlays, tags
├── timeline-data.js    — Timeline year data engine
├── components/
│   ├── tags.js         — Category tag buttons, emits categoryChanged event
│   ├── tags.css        — Tag button styles
│   ├── timeline.js     — Vertical timeline component, emits yearChanged event
│   ├── search.js       — Global search with autocomplete
│   ├── search.css      — Search result styles
│   ├── overlays.js     — All map overlay logic (states/UTs/rivers/ghats/forts/languages/dynasties/events)
│   ├── overlays.css    — Overlay-specific styles
│   └── data-loader.js  — Data loading stub (data is inline in script.js)
└── .amazonq/rules/Base.md  — This file
```

### SVG Map
- `viewBox="0 0 432 488"`
- All state paths have `class="state"` and unique `id` attributes
- Some UT IDs use spaces: `"Andaman And Nicobar Islands"`, `"Dadra And Nagar Haveli And Daman And Diu"`
- Coordinate formula: `x = ((lng - 68) / 29) * 432`, `y = ((37 - lat) / 29) * 488`

### Data (all inline in script.js)
- `statesData` — 29 states with capital, area, population, language, description, facts, historicalEvents
- `unionTerritories` — 8 UTs, keys use underscores (e.g. `Andaman_Nicobar`)
- `riversData` — 6 major rivers with origin, length, description, facts
- `fortsData` — 4 forts with coordinates, dynasty, built date
- `ghatsData` — Western/Eastern Ghats + river ghats
- `dynastiesData` — 11 dynasties with period, capital, color, states covered, facts
- `historicalEvents` — 12 events grouped by period (Ancient/Medieval/Colonial/Independence/Modern)
- `stateLanguages` — state ID → language mapping

---

## Implemented Features

### Tags (Category System)
- States, Union Territories, Rivers, Ghats, Forts, Languages, Dynasties, Historical Events
- One active at a time
- Emits `categoryChanged(category)` → triggers `overlayModeChanged` → `MapOverlays.*`

### States Overlay
- Cyan border (`#00e5ff`) on every state via CSS `.state { stroke: #00e5ff }`
- State name labels centered inside each path via `getBBox()`
- Hover → green fill, click → red locked fill + side panel detail

### Union Territories Overlay
- All 8 UTs highlighted on map
- Colored SVG teardrop pin markers per UT (each UT has unique color)
- Multi-spot UTs (Andaman, Dadra/Daman/Diu, Puducherry) get multiple pins
- Panel: scrollable list → click → detail view with ← Back to list
- `UT_PINS` config in overlays.js defines colors and lat/lng spots

### Rivers Overlay
- 14 rivers: Indus, Jhelum, Chenab, Ravi, Sutlej, Ganga, Yamuna, Brahmaputra, Narmada, Tapti, Godavari, Mahanadi, Krishna, Kaveri
- Catmull-Rom smooth bezier curves using direct SVG coordinates
- Stroke width hierarchy: tributaries (1.0–1.5) → secondary (1.8–2.0) → major (2.5–3.0)
- Glow layer (opacity 0.18) behind each river
- Panel: list view → click → detail with ← Back to list

### Ghats Overlay
- Western Ghats states highlighted green, Eastern Ghats orange
- River ghats (Varanasi, Rishikesh, Haridwar) as circle markers

### Forts Overlay
- Circle markers at fort coordinates
- Name labels beside each marker

### Languages Overlay
- States colored by official language using `LANGUAGE_COLORS` map
- Language name label centered in each state

### Dynasties Overlay
- List of 11 dynasties in panel
- Click dynasty → highlights covered states in dynasty color
- Detail view with ← Back to list, clears highlights on back

### Historical Events Overlay
- Events grouped by period in panel
- Click event → marker placed on map + detail view with ← Back to list

### Side Panel
- Resizable (drag left edge)
- Placeholder hidden when content shown
- Sections: header (title, subtitle), description, stats grid, image slot, key facts, historical timeline
- Back to list pattern used in: UTs, Rivers, Dynasties, Historical Events

### Search
- Autocomplete across states, UTs, rivers, forts, dynasties, events
- Highlights map result on selection

---

## Key Insights & Rules for Amazon Q

1. **SVG IDs with spaces** — `document.getElementById()` must use exact ID including spaces for Andaman and Dadra UTs
2. **unionTerritories keys** use underscores; SVG path IDs may use spaces — `utMappings` in overlays.js bridges this
3. **CSS specificity** — `.state` CSS rule uses `stroke: #00e5ff` directly; do not fight it with JS inline styles
4. **clearAllOverlays** resets `state.style.cssText = ''` and `removeAttribute('stroke/stroke-width')` — always update this when adding new overlay state
5. **River coordinates** are direct SVG pixel coords `[x, y]` in `432×488` space, NOT lat/lng — `riverPath()` uses them directly
6. **latLngToSVG** is only used for: UT pins, fort markers, ghat markers, event markers
7. **Back to list pattern** — all category detail views use `.ut-back-btn` CSS class with `id="*BackBtn"`
8. **window.showPanel** is exposed globally from script.js for use by overlays.js
9. **All data is inline** in script.js — the `data/` folder has been deleted
10. **Do not modify** existing map SVG paths or state click/hover handlers in script.js unless explicitly asked

---

## Design System

| Token | Value |
|---|---|
| Background | `#0a0e27` |
| State fill | `#1e2a4a` |
| State border | `#00e5ff` |
| Navbar gradient | `#667eea → #764ba2` |
| Accent orange | `#ff9800` |
| River blue | `#3498db / #56ccf2` |
| Panel bg | `rgba(15,15,40,0.92)` |
| Font | Segoe UI |

---

## Pending / Future Work
- Historical state boundary changes by year (GeoJSON per year)
- Map morph animation on year change
- Fort clustering when zoomed out
- River tributary merging visual at confluence points
- Light theme river/overlay color variants
