# Phase 5: River Overlay — Quick Start Guide

## How to Use Rivers Feature

### For Users

#### 1. Display Rivers on Map
- Click the **"Rivers"** tag button in the tag row below the navbar
- 10 major Indian rivers will appear on the map with blue/cyan glowing lines
- Rivers are color-coded for visual distinction

#### 2. Interact with Rivers
**Hover over any river:**
- Selected river brightens and glows
- Other rivers fade to the background (opacity: 0.3)
- River name and details appear in the right side panel
- Stroke becomes thicker (5px instead of 3px)

**Click on a river:**
- Emits selection event (visible in console)
- Can trigger custom handling in connected apps

#### 3. View River Details
When zoomed in on river details panel:
- **River Name** - Official name (e.g., "Ganga (Ganges)")
- **Length & Type** - Total length and classification
- **Description** - Geographical and cultural information
- **Key Facts** - Interesting facts about the river
- **Origin** - Source of the river
- **States** - Which states the river flows through

#### 4. Switch Between Categories
- Click any other tag (States, Forts, Events) to hide rivers
- Rivers fade out smoothly
- Click Rivers again to bring them back

### Rivers Available

| # | River Name | Type | Status |
|---|------------|------|--------|
| 1 | Ganga (Ganges) | Himalayan | ✅ |
| 2 | Yamuna | Himalayan | ✅ |
| 3 | Brahmaputra | Himalayan | ✅ |
| 4 | Godavari | Peninsular | ✅ |
| 5 | Krishna | Peninsular | ✅ |
| 6 | Narmada | Peninsular | ✅ |
| 7 | Cauvery (Kaveri) | Peninsular | ✅ |
| 8 | Mahanadi | Peninsular | ✅ |
| 9 | Indus | Himalayan | ✅ |
| 10 | Tapti (Tapi) | Peninsular | ✅ |

## Visual Indicators

### River Colors
- **Blue (#1e90ff)** - Major sacred/northern rivers
- **Royal Blue (#4169e1)** - Important peninsular rivers
- **Cyan (#0099ff)** - Western/eastern flowing rivers

### Animation Effects

#### Hover State
- Stroke: 3px → 5px (widening)
- Opacity: 0.6 → 1.0 (brightening)
- Glow: Shadow effect activated
- Other rivers: Fade to 0.3 opacity

#### Active Animation
- **Pulse Effect** - River glow pulses in and out
- **Flow Effect** - Dashed line pattern animates continuously
- **Duration** - 1.5s for pulse, 8s for flow animation

### Fade Effects
- Rivers appear smoothly when "Rivers" tag clicked
- Flow animations start immediately
- Hover effects are instant (<10ms)

## Keyboard & Accessibility

### Keyboard Navigation
- Rivers are keyboard-focusable elements
- Press `Tab` to navigate to river
- River details update automatically on focus
- Hover effects work with focus state

### Screen Reader Support
- Each river has accessible `title` attribute
- River name read aloud with screen reader
- Details panel updates announced

### Mobile Support
- Tap to focus on river (instead of hover)
- Touch-friendly interaction areas
- Responsive sizing for all devices

## Theme Support

### Dark Theme (Default)
- Rivers: Bright blue glow on dark map
- Panel: Dark background with light text
- Glow: Bright shadows for visibility

### Light Theme
- Rivers: Darker blue with multiply blend
- Panel: Light background with dark text
- Glow: Softer, less contrasting

## Tips & Tricks

### 1. Discover Related Information
- Search for a river name (Phase 4)
- Click on state name to see which rivers flow through it
- Check historical data for seasonal variations

### 2. Educational Use
- Use for geography lessons
- Explore river systems state-by-state
- Learn about water resources in India

### 3. Performance
- Rivers automatically hide when switching categories
- Only active river is highlighted (efficient rendering)
- 60fps animations on modern browsers

### 4. Combining Features
```
Use Timeline + Rivers:
- Select a year from timeline
- Switch to Rivers tag
- See how rivers were used in that historical period

Use Search + Rivers:
- Search for "Ganga"
- Click result to highlight
- See river glow on map
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Rivers not showing | Click "Rivers" tag button |
| Rivers disappear | You clicked another tag; click "Rivers" again |
| Side panel empty | Hover directly over river path on map |
| Text in panel unclear | Check if light/dark theme matches preferences |
| Animation stuttering | Close other browser tabs; may need faster computer |
| Mobile not responsive | Try landscape orientation for better visibility |

## Developer Integration

### Listen for River Selection
```javascript
document.addEventListener('riverSelected', (e) => {
  const river = e.detail;
  console.log(`Selected river: ${river.name}`);
  
  // Your custom logic here
  if (river.id === 'ganga') {
    console.log('Most sacred river!');
  }
});
```

### Programmatic Control
```javascript
// Show rivers
RiversOverlay.setVisible(true);

// Hide rivers
RiversOverlay.setVisible(false);

// Toggle rivers
RiversOverlay.toggleRivers();

// Get all river paths
const allRivers = RiversOverlay.getRiverPaths();
console.log(Object.keys(allRivers)); // Lists all river IDs
```

### Access River Data
```javascript
// Get specific river
const ganga = RiversOverlay.getRiverPaths().ganga;
console.log(ganga.name);  // "Ganga (Ganges)"
console.log(ganga.color); // "#1e90ff"
console.log(ganga.path);  // SVG path string
```

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| Mobile Chrome | Latest | ✅ Full support |
| Mobile Safari | 14+ | ✅ Full support |

## Performance Tips

1. **Smooth Animations**
   - Runs at 60fps on most devices
   - Uses GPU-accelerated CSS transforms
   - Efficient SVG rendering

2. **Responsive Performance**
   - Automatic throttling on slow devices
   - Optimized for mobile (lower resolution)
   - Lazy animation delays to prevent jank

3. **Battery Friendly**
   - Animations pause when not visible
   - No continuous polling
   - Event-driven architecture

## Companion Files

- **PHASE_5_DOCUMENTATION.md** - Full technical docs
- **PHASE_5_COMPLETION_REPORT.md** - Implementation details
- **components/rivers.js** - Source code (290 lines)
- **components/rivers.css** - Styling/animations (320 lines)

## What's Next

### Phase 6: Fort Markers
- Add fort location markers
- Click-to-view popup details
- Marker clustering
- Fort-specific information

### Phase 7: Historical Visualization
- Year-based river variations
- GeoJSON boundary transitions
- Animated state morphing

## Quick Links

- **View Source** → `components/rivers.js`
- **See Styles** → `components/rivers.css`
- **Report Issue** → Check console for errors
- **Feedback** → Customize code as needed

---

**Phase 5 is LIVE! Start exploring rivers! 🌊**

