# Developer Notes - Map.in Project

Quick reference for developers working on this codebase.

---

## 🏗️ Architecture Overview

### Data Flow
```
JSON Files (data/*.json)
    ↓
data-loader.js (loads + exposes globally)
    ↓
dataLoaded event
    ↓
script.js (normalizes + exposes on window)
    ↓
Components (search, rivers, timeline, etc.)
```

### Key Files

| File | Purpose | Dependencies |
|------|---------|--------------|
| `index.html` | Main HTML structure | All CSS/JS files |
| `script.js` | Core app logic, data normalization | data-loader.js |
| `data-loader.js` | Loads JSON data files | None (loads first) |
| `components/rivers.js` | River overlay & interactions | script.js (showPanel) |
| `components/search.js` | Global search functionality | All data from window |
| `components/timeline.js` | Timeline slider UI | None (standalone) |
| `components/tags.js` | Category tag buttons | None (standalone) |
| `timeline-data.js` | Year-based historical data | None (standalone) |

---

## 📦 Global Variables

These are exposed on `window` object for component access:

### Data Variables
```javascript
window.statesData      // Object: { state_id: {...} }
window.riversData      // Array: [{id, name, ...}, ...]
window.fortsData       // Array: [{id, name, ...}, ...]
window.ghatsData       // Array: [{id, name, ...}, ...]
window.milestones      // Array: [{year, label, ...}, ...]
```

### Function Variables
```javascript
window.showPanel(data, category)  // Display data in side panel
window.TimelineEngine             // Timeline data management
window.SearchEngine               // Search index management
window.RiversOverlay              // River layer controls
```

---

## 🎨 CSS Classes Reference

### Tag Buttons
```css
.tag-btn           /* Base tag button style */
.tag-btn.active    /* Active/selected tag */
```

### Side Panel
```css
.sp-placeholder    /* "Hover to explore" message */
.sp-content        /* Main content container */
.sp-header         /* Panel header with title */
.sp-body           /* Scrollable content area */
.stat-item         /* Individual stat card */
.facts-list        /* Bulleted facts list */
.events-list       /* Historical events list */
```

### Map Elements
```css
.state             /* SVG state path */
.state:hover       /* Hovered state */
.state.highlighted /* Search-highlighted state */
.state.year-active /* Active in current timeline year */
.overlay-marker    /* Generic overlay marker */
.fort-marker       /* Fort overlay circle */
.river-label       /* River name text */
.river-path        /* River SVG path */
```

---

## 🔧 Common Tasks

### Adding a New Data Source

1. **Create JSON file** in `data/` folder
2. **Update data-loader.js:**
```javascript
const DATA_FILES = {
  // ... existing
  mynewdata: './data/mynewdata.json'
};

// Add to Promise.all
const [..., myNewData] = await Promise.all([
  // ... existing
  loadJSON(DATA_FILES.mynewdata, 'mynewdata')
]);

// Expose globally
window.myNewData = myNewData;

// Add to event detail
detail: { ..., myNewData }
```

3. **Consume in script.js:**
```javascript
document.addEventListener('dataLoaded', (e) => {
  // Normalize structure
  if (e.detail.myNewData) {
    myNewData = Array.isArray(e.detail.myNewData) 
      ? e.detail.myNewData 
      : e.detail.myNewData.items || [];
  }
  
  window.myNewData = myNewData;
});
```

4. **Add to search index** (if searchable):
```javascript
// In search.js buildIndex()
if (window.myNewData) {
  window.myNewData.forEach(item => {
    searchIndex.push({
      type: 'mynewtype',
      id: item.id,
      name: item.name,
      // ...
    });
  });
}
```

---

### Adding a New Component

1. **Create file** `components/mycomponent.js`
2. **Use IIFE pattern:**
```javascript
(function () {
  // Private variables
  let myData = [];
  
  // Private functions
  function init() {
    // Setup code
  }
  
  // Public API
  window.MyComponent = {
    // Public methods
  };
  
  // Initialize
  document.addEventListener('DOMContentLoaded', init);
})();
```

3. **Add to index.html:**
```html
<script src="components/mycomponent.js"></script>
```

4. **Listen to events:**
```javascript
document.addEventListener('dataLoaded', (e) => {
  // Use loaded data
});

document.addEventListener('categoryChanged', (e) => {
  const category = e.detail;
  // React to category change
});
```

---

## 🎯 Event System

### Events Dispatched

| Event | Source | Detail | Purpose |
|-------|--------|--------|---------|
| `dataLoaded` | data-loader.js | `{statesData, riversData, ...}` | JSON files loaded |
| `categoryChanged` | tags.js | `string` (category id) | User changed category |
| `yearChanged` | timeline.js | `number` (year) | Timeline slider moved |
| `searchResultSelected` | search.js | `{type, id, name, ...}` | Search result clicked |
| `timelineDataLoaded` | timeline-data.js | `{year, data}` | Timeline data for year |
| `themeChanged` | script.js | `{isDark: boolean}` | Theme toggled |
| `riverSelected` | rivers.js | `{type, id, name, ...}` | River clicked |

### Event Listeners

```javascript
// Listen to any event
document.addEventListener('eventName', (e) => {
  const data = e.detail;
  // Handle event
});

// Dispatch custom event
document.dispatchEvent(new CustomEvent('myEvent', {
  detail: { myData: 'value' }
}));
```

---

## 🐛 Debugging Tips

### Check Data Loading
```javascript
// In browser console:
console.log(window.statesData);
console.log(window.riversData);
console.log(window.fortsData);
```

### Check Event Flow
```javascript
// Listen to all events
['dataLoaded', 'categoryChanged', 'yearChanged'].forEach(event => {
  document.addEventListener(event, (e) => {
    console.log(`Event: ${event}`, e.detail);
  });
});
```

### Check Element Selection
```javascript
// Verify elements exist
console.log(document.getElementById('spTitle'));
console.log(document.querySelectorAll('.state').length);
```

### Enable Verbose Logging
All components use `console.log` with component name prefix:
- `[DataLoader]` - Data loading
- `[Search]` - Search operations
- `[Rivers]` - River interactions
- `[TimelineEngine]` - Timeline operations

---

## ⚠️ Common Pitfalls

### 1. Data Structure Assumptions
**Problem:** Assuming data is always array or always object  
**Solution:** Always normalize:
```javascript
const dataArray = Array.isArray(data) ? data : (data.items || []);
```

### 2. Missing Global Check
**Problem:** Calling `window.someFunction()` without checking existence  
**Solution:**
```javascript
if (typeof window.showPanel === 'function') {
  window.showPanel(data, category);
}
```

### 3. Event Timing
**Problem:** Accessing data before `dataLoaded` event  
**Solution:**
```javascript
document.addEventListener('dataLoaded', (e) => {
  // Now safe to use data
  processData(e.detail.statesData);
});
```

### 4. CSS Class Naming
**Problem:** Using wrong class names  
**Solution:** Check style.css for actual classes used

### 5. SVG Manipulation
**Problem:** Using `document.createElement` for SVG  
**Solution:** Use `document.createElementNS`:
```javascript
const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
```

---

## 📁 File Naming Conventions

- **Components:** `components/name.js` (lowercase, hyphenated)
- **Data files:** `data/name.json` (lowercase, hyphenated)
- **CSS files:** `components/name.css` (matches JS file)
- **SVG IDs:** `State_Name` (PascalCase with underscores)
- **JavaScript IDs:** `camelCase` (standard JS convention)

---

## 🧪 Testing Checklist

Before committing changes:

- [ ] No console errors
- [ ] All features work (states, rivers, search, timeline, tags)
- [ ] Data loads correctly (check Network tab)
- [ ] Side panel displays properly
- [ ] Search finds all data types
- [ ] Theme toggle works
- [ ] Mobile responsive (if applicable)
- [ ] No 404s in console
- [ ] JSDoc comments added for new functions

---

## 🚀 Deployment Notes

### Production Checklist
- [ ] Remove console.log statements (or use production logger)
- [ ] Minify JavaScript files
- [ ] Compress JSON data files
- [ ] Optimize SVG (remove unnecessary paths)
- [ ] Add error boundary for production
- [ ] Add analytics (if needed)
- [ ] Test on multiple browsers
- [ ] Add loading indicators
- [ ] Add offline fallback

### Performance Tips
1. Lazy load components not needed at startup
2. Debounce search input (already implemented)
3. Use requestAnimationFrame for animations
4. Cache DOM queries in variables
5. Minimize reflows (batch DOM updates)

---

## 📚 Additional Resources

- MDN Web Docs: https://developer.mozilla.org
- SVG Tutorial: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial
- JavaScript Events: https://developer.mozilla.org/en-US/docs/Web/Events

---

**Last Updated:** After fixing all 13 bugs  
**Status:** Production Ready ✅
