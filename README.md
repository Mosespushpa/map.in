# Map.in — Historical Geography Explorer of India

> An interactive web application that lets you explore India's geography, history, rivers, forts, dynasties, and cultural layers through a visual SVG map.

---

## Table of Contents
1. [Idea](#1-idea)
2. [Design](#2-design)
3. [Planning](#3-planning)
4. [Implementation](#4-implementation)
5. [Deployment](#5-deployment)
6. [Maintenance](#6-maintenance)

---

## 1. Idea

### Problem Statement
India has an incredibly rich and layered geography — 28 states, 8 union territories, 14 major river systems, hundreds of historical forts, 11 major dynasties, and thousands of years of history. There was no single interactive tool that let a student or enthusiast explore all of this visually on one map.

### Vision
Build a **Historical Geography Explorer** — a browser-based interactive map of India where users can:
- Switch between geographic categories (States, Rivers, Forts, Dynasties, etc.)
- See historical boundaries change over time via a timeline
- Click any region or marker to get rich information in a side panel
- Search for any state, river, fort, dynasty, or event

### Target Users
- Students studying Indian geography and history
- Teachers and educators
- History enthusiasts
- General public curious about India

### Core Value
One map. Every layer of India. Instantly accessible.

---

## 2. Design

### UI Layout
```
┌─────────────────────────────────────────────────────────┐
│  🗺 Map.in   Historical Geography Explorer   🔍   🌙    │  ← Navbar
├─────────────────────────────────────────────────────────┤
│  States │ Union Territories │ Rivers │ Ghats │ Forts... │  ← Tags Row
├──────────────────────────────────────┬──────────────────┤
│                                      │                  │
│         Interactive SVG Map          │   Side Panel     │
│                                      │   - Title        │
│                                      │   - Description  │
│                                      │   - Stats        │
│                                      │   - Facts        │
│                                      │   - Timeline     │
└──────────────────────────────────────┴──────────────────┘
```

### Design System

| Element | Value |
|---|---|
| Theme | Dark scientific atlas |
| Background | `#0a0e27` (deep navy) |
| Navbar | Purple-blue gradient `#667eea → #764ba2` |
| State fill | `#1e2a4a` |
| State border | `#00e5ff` (cyan) |
| Accent | `#ff9800` (orange) |
| River color | `#3498db / #56ccf2` (blue) |
| Panel | Glassmorphism `rgba(15,15,40,0.92)` with backdrop blur |
| Font | Segoe UI, system-ui |
| Icons | Font Awesome 6 CDN |

### Visual Principles
- **Dark atlas aesthetic** — inspired by scientific geography atlases
- **Glassmorphism panels** — frosted glass side panel with blur
- **Color-coded categories** — each overlay type has its own color language
- **Hierarchy through stroke width** — river tributaries thinner than main rivers
- **Consistent back-navigation** — all detail views have ← Back to list

---

## 3. Planning

### Technology Decisions

| Decision | Choice | Reason |
|---|---|---|
| Framework | None (Vanilla JS) | Zero build tooling, instant load, no dependencies |
| Map format | Inline SVG | Full CSS/JS control, no tile server needed |
| Data storage | Inline in script.js | No server required, works as local file |
| Styling | Plain CSS | No preprocessor overhead |
| Icons | Font Awesome CDN | Consistent icon set, single link |

### Phase Plan

| Phase | Feature | Status |
|---|---|---|
| 1 | Timeline + Tags + Data architecture | ✅ Complete |
| 2 | States overlay with labels and borders | ✅ Complete |
| 3 | Union Territories with pin markers | ✅ Complete |
| 4 | Rivers overlay with smooth curves | ✅ Complete |
| 5 | Ghats, Forts, Languages overlays | ✅ Complete |
| 6 | Dynasties with territory highlighting | ✅ Complete |
| 7 | Historical Events with map markers | ✅ Complete |
| 8 | Search with autocomplete | ✅ Complete |
| 9 | Side panel resize + scroll | ✅ Complete |
| 10 | Historical boundary changes by year | 🔲 Pending |
| 11 | Map morph animation | 🔲 Pending |

### Data Scope

| Category | Count |
|---|---|
| States | 28 |
| Union Territories | 8 |
| Rivers | 14 |
| Forts | 4 (expandable) |
| Dynasties | 11 |
| Historical Events | 12 |
| Languages | 16 |

---

## 4. Implementation

### Project Structure
```
map/
├── index.html              — App shell, inline SVG map, script/style links
├── script.js               — All data + core logic (state handlers, panel, search data)
├── style.css               — Complete stylesheet
├── timeline-data.js        — Year-based data engine
├── components/
│   ├── tags.js             — Category tag system
│   ├── tags.css
│   ├── timeline.js         — Vertical timeline slider
│   ├── search.js           — Autocomplete search
│   ├── search.css
│   ├── overlays.js         — All map overlay rendering
│   ├── overlays.css
│   └── data-loader.js      — Data loader stub
└── .amazonq/
    └── rules/
        └── Base.md         — AI assistant context rules
```

### Key Technical Decisions

**SVG Coordinate System**
- ViewBox: `0 0 432 488`
- India spans lng 68°E–97°E, lat 8°N–37°N
- Formula: `x = ((lng - 68) / 29) * 432`, `y = ((37 - lat) / 29) * 488`
- River paths use direct SVG pixel coordinates for accuracy

**River Rendering**
- Catmull-Rom spline → cubic bezier conversion for smooth curves
- Tension: 0.4 for natural river flow appearance
- Two layers per river: glow (opacity 0.18) + solid line
- Stroke width hierarchy: 1.0px (minor tributary) → 3.0px (major Himalayan river)

**Overlay Architecture**
- Single `overlays.js` handles all 8 category overlays
- `clearAllOverlays()` resets all state styles before each overlay
- Each overlay function: clears → applies styles → updates side panel
- Events: `categoryChanged` → `overlayModeChanged` → overlay function

**Side Panel Pattern**
- Placeholder shown by default
- Content shown on any map interaction
- Detail views (UT, River, Dynasty, Event) all use ← Back to list button
- Panel is resizable by dragging left edge

**Data Architecture**
- All data inline in `script.js` — no fetch/async required
- Exposed as `window.*` globals for cross-file access
- `statesData`, `unionTerritories`, `riversData`, `fortsData`, `ghatsData`, `dynastiesData`, `historicalEvents`, `stateLanguages`

### SVG ID Quirks
Some UT paths in the SVG use spaces in their `id` attribute:
- `"Andaman And Nicobar Islands"` (not underscores)
- `"Dadra And Nagar Haveli And Daman And Diu"`

The `utMappings` object in `overlays.js` bridges the gap between JS keys (underscores) and SVG IDs (spaces).

---

## 5. Deployment

### Local Development
No build step required. Open directly in browser:
```
file:///path/to/map/index.html
```

### GitHub Pages Deployment
1. Push repository to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, root `/`
4. Site available at: `https://<username>.github.io/<repo>/`

### Requirements
- No server needed
- No Node.js / npm required
- Works in any modern browser (Chrome, Firefox, Edge, Safari)
- Internet connection required only for Font Awesome CDN icons

### Performance
- Single HTML file load
- SVG map is inline (no network request)
- All data inline in script.js (~150KB unminified)
- No images required (logo optional)

### Browser Support
| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Safari 14+ | ✅ Full |
| IE 11 | ❌ Not supported |

---

## 6. Maintenance

### Adding a New State or UT
1. Add SVG `<path>` with `class="state"` and unique `id` to `index.html`
2. Add data entry to `statesData` or `unionTerritories` in `script.js`
3. If UT, add entry to `UT_PINS` in `overlays.js` with color and lat/lng spots
4. Add to `stateLanguages` map in `script.js`

### Adding a New River
1. Add entry to `RIVERS` array in `overlays.js` with SVG coordinate waypoints
2. Add matching entry to `riversData` in `script.js` for panel details
3. Set appropriate `width` (1.0–3.0) based on river importance

### Adding a New Fort
1. Add entry to `fortsData` in `script.js` with `coordinates: [lat, lng]`
2. Fort marker and label render automatically in `showFortsOverlay()`

### Adding a New Dynasty
1. Add entry to `dynastiesData` in `script.js`
2. Include `color`, `states[]` array, `period`, `capital`, `facts[]`
3. Dynasty renders automatically in `showDynastiesOverlay()`

### Adding a New Historical Event
1. Add entry to `historicalEvents` in `script.js`
2. Include `coordinates`, `period`, `year`, `location`, `facts[]`
3. Event renders automatically in `showHistoricalEventsOverlay()`

### Changing the Color Theme
All design tokens are in `style.css`:
- State fill: `.state { fill: ... }`
- State border: `.state { stroke: ... }`
- Navbar: `.navbar { background: linear-gradient(...) }`
- Panel: `.side-panel { background: ... }`

### Known Limitations
- Historical boundary changes by year not yet implemented (GeoJSON per year needed)
- Fort data is limited to 4 entries — needs expansion
- River paths are approximations, not precise GeoJSON traces
- No offline icon support (Font Awesome requires CDN)

### File Size Guide
| File | Purpose | Edit Frequency |
|---|---|---|
| `index.html` | Structure + SVG | Rarely |
| `script.js` | All data + core logic | Often (adding data) |
| `style.css` | All styles | Sometimes |
| `components/overlays.js` | Map overlay logic | Often (new features) |
| `components/tags.js` | Tag buttons | Rarely |
| `components/timeline.js` | Year slider | Rarely |
| `components/search.js` | Search logic | Sometimes |
| `timeline-data.js` | Year data | Sometimes |

---

## Contributing

1. All data lives in `script.js` — add entries to the appropriate array
2. All overlay rendering lives in `components/overlays.js`
3. Follow the existing back-navigation pattern for new detail views
4. Test in browser directly — no build step needed
5. Keep data inline — do not reintroduce the `data/` folder

---

*Built with HTML, CSS, and Vanilla JavaScript. No frameworks. No build tools. Just the web.*
