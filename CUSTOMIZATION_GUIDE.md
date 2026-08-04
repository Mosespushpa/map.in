# Dynasty Expansion Animation - Developer Quick Reference

## Quick Customization Guide

### Change Animation Duration

**File:** `components/overlays.js`
**Location:** Inside `animateDynastyExpansion()` function

```javascript
const animationDuration = 2000; // Change this value
// 1000 = 1 second
// 2000 = 2 seconds (default)
// 3000 = 3 seconds
```

### Change Capital Marker Size

**File:** `components/overlays.js`
**Location:** Capital marker creation

```javascript
capitalMarker.setAttribute('r', '5'); // Change this value
// 3 = small
// 5 = medium (default)
// 8 = large
```

### Change Expansion Circle Color/Opacity

**File:** `components/overlays.js`
**Location:** Expand circle creation

```javascript
expandCircle.setAttribute('fill', dynasty.color);      // Color
expandCircle.setAttribute('opacity', '0.4');           // Opacity (0-1)
```

### Change State Highlight Opacity

**File:** `components/overlays.js`
**Location:** Inside animation frame loop

```javascript
item.element.style.opacity = (stateProgress * 0.6).toFixed(2);
// Change 0.6 to desired value
// 0.3 = more transparent
// 0.6 = medium (default)
// 0.9 = more opaque
```

### Add New Capital City Coordinates

**File:** `components/overlays.js`
**Location:** Inside `getCapitalCoordinates()` function

```javascript
const capitalCoordinates = {
  // ... existing coordinates ...
  'Your City Name': [latitude, longitude],
  'Another City': [26.9124, 75.7873]
};
```

**How to Find Coordinates:**
1. Go to Google Maps
2. Search for the city
3. Right-click → Click coordinates
4. Format: `[latitude, longitude]`

### Change Dynasty Color

**File:** `script.js`
**Location:** `dynastiesData` array

```javascript
{
  id: 'maurya',
  name: 'Maurya Empire',
  color: '#E74C3C',  // Change this hex code
  // ... other properties ...
}
```

**Color Hex Codes For Reference:**
```
Red:      #E74C3C
Blue:     #3498DB
Green:    #27AE60
Purple:   #9B59B6
Orange:   #E67E22
Pink:     #E91E63
Teal:     #16A085
```

### Add New Dynasty

**File:** `script.js`
**Location:** `dynastiesData` array

```javascript
{
  id: 'my_dynasty',
  name: 'My Dynasty Name',
  period: '1000-1200 BCE',
  capital: 'Your Capital City',
  color: '#HEX_COLOR',
  states: ['State1', 'State2', 'State3', 'State4'],
  description: 'Description of the dynasty...',
  facts: [
    'Fact 1 about the dynasty',
    'Fact 2 about the dynasty',
    'Fact 3 about the dynasty'
  ]
}
```

**Important:**
- State names must match SVG element IDs in `index.html`
- Capital must exist or be added to capital coordinates
- ID should be lowercase with underscores

### Disable Animation (Instant Highlight)

**File:** `components/overlays.js`
**Location:** `toggleDynasty()` function

Replace:
```javascript
animateDynastyExpansion(dynasty);
```

With:
```javascript
// Instant highlighting without animation
dynasty.states.forEach(stateId => {
  const stateEl = document.getElementById(stateId);
  if (stateEl) {
    stateEl.classList.add('dynasty-highlight');
    stateEl.style.fill = dynasty.color;
    stateEl.style.opacity = '0.6';
  }
});
```

### Change Animation Speed Per State

**File:** `components/overlays.js`
**Location:** Inside animation frame loop

```javascript
const stateProgress = Math.max(0, Math.min(stateElapsed / 150, 1));
// Change 150 to:
// 50 = very fast state highlighting
// 150 = default
// 300 = slow state highlighting
```

### Remove Capital Marker Pulse

**File:** `style.css`
**Location:** `@keyframes capital-pulse`

Replace:
```css
@keyframes capital-pulse {
  0%, 100% {
    r: 5px;
    opacity: 0.9;
    filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8));
  }
  50% {
    r: 7px;
    opacity: 0.8;
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 1));
  }
}
```

With:
```css
@keyframes capital-pulse {
  0%, 100% {
    r: 5px;
    opacity: 0.9;
  }
  50% {
    r: 5px;
    opacity: 0.9;
  }
}
```

### Make Circle Pulse Instead of Expand

**File:** `components/overlays.js`
**Location:** Inside animation frame loop

Replace:
```javascript
const currentRadius = progress * maxDistance * 1.1;
expandCircle.setAttribute('r', currentRadius);
```

With:
```javascript
// Pulsing circle at fixed radius
const pulseRadius = maxDistance * 0.5;
const pulseFactor = 1 + (Math.sin(progress * Math.PI * 4) * 0.3);
expandCircle.setAttribute('r', pulseRadius * pulseFactor);
```

### Add Sound Effect (Optional)

**File:** `components/overlays.js`
**Location:** Start of `animateDynastyExpansion()`

```javascript
// Add at the beginning of function
const audio = new Audio('path/to/expansion-sound.mp3');
audio.volume = 0.5; // 0-1
audio.play();
```

### Enable Multiple Dynasty Selection

Replace `toggleDynasty()` function logic:

```javascript
function toggleDynasty(dynastyId) {
  const dynasty = (window.dynastiesData || []).find(d => d.id === dynastyId);
  if (!dynasty) return;

  // Toggle instead of clearing
  if (activeDynasties.has(dynastyId)) {
    activeDynasties.delete(dynastyId);
    // Remove highlights for this dynasty
    dynasty.states.forEach(stateId => {
      const stateEl = document.getElementById(stateId);
      if (stateEl && !stateHasOtherDynasty(stateId)) {
        stateEl.classList.remove('dynasty-highlight');
        stateEl.style.fill = '';
      }
    });
  } else {
    activeDynasties.add(dynastyId);
    animateDynastyExpansion(dynasty);
  }
}
```

---

## Common Values to Adjust

| What | File | Value | Default |
|------|------|-------|---------|
| Animation duration | overlays.js | `animationDuration` | 2000 |
| Capital marker size | overlays.js | `r` attribute | 5 |
| State opacity | overlays.js | multiply factor | 0.6 |
| State highlight speed | overlays.js | division factor | 150 |
| Capital pulse speed | style.css | `1s` in animation | 1s |
| Expand circle initial opacity | overlays.js | `opacity` attr | 0.4 |

---

## Debugging Tips

### Check if Dynasty Data Exists
```javascript
console.log(window.dynastiesData);
```

### Check State IDs are Correct
```javascript
const dynasty = window.dynastiesData[0];
console.log('States:', dynasty.states);
dynasty.states.forEach(id => {
  const el = document.getElementById(id);
  console.log(id, '→', el ? 'Found' : 'NOT FOUND');
});
```

### Check Capital Coordinates
```javascript
const dynasty = window.dynastiesData[0];
console.log('Capital:', dynasty.capital);
// Then check overlays.js getCapitalCoordinates() function
```

### Monitor Animation Progress
Add this to `animationFrame()` function:
```javascript
console.log(`Animation: ${(progress * 100).toFixed(1)}%`);
```

### Check Browser Performance
Open DevTools → Performance tab:
1. Click record
2. Select a dynasty
3. Watch animation
4. Stop recording
5. Check FPS (should be constant 60)

---

## Integration with External Libraries

### Add Chart.js Statistics
```javascript
// In showDynastyDetail() function
const chartData = {
  labels: ['Capital', 'Area', 'Peak Year', 'Decline'],
  data: [/* ... */]
};
// Create chart
```

### Add Three.js 3D Visualization
```javascript
// Alternative 3D expansion visualization
const scene = new THREE.Scene();
const expanding3DCircle = new THREE.Sphere(/* ... */);
```

### Add Motion Graphics
```javascript
// Use anime.js for enhanced animations
anime({
  targets: capitalMarker,
  r: [0, 5],
  opacity: [0, 0.9],
  duration: 500
});
```

---

## Testing Custom Changes

1. **Open Browser Console** (F12)
2. **Test Dynasty Selection**
   ```javascript
   // Manually trigger animation
   const dynasty = window.dynastiesData[0];
   window.MapOverlays.toggleDynasty(dynasty.id);
   ```

3. **Monitor for Errors**
   - Check Console tab
   - Check Network tab (if loading assets)

4. **Verify Visual Changes**
   - Look for animations
   - Check colors and sizes
   - Verify state highlighting

---

## Performance Optimization Tips

1. **Reduce Number of Highlighted States**
   - Shorter animation duration
   - Faster performance

2. **Use Simpler Graphics**
   - Remove `drop-shadow` effects
   - Reduces CPU usage

3. **Disable Pulsing**
   - Remove `capital-pulse` animation
   - Saves animation frames

4. **Pre-calculate Distances**
   - Cache state-to-capital distances
   - Avoid recalculation per frame

---

## Rollback to Previous Version

If you need to remove the animation feature:

1. **Delete added functions** from `overlays.js`:
   - `animateDynastyExpansion(dynasty)`
   - `getCapitalCoordinates(capitalName)`

2. **Revert `toggleDynasty()`** to original:
   ```javascript
   // Original code without animation
   dynasty.states.forEach(stateId => {
     const stateEl = document.getElementById(stateId);
     if (stateEl) {
       stateEl.classList.add('dynasty-highlight');
       stateEl.style.fill = dynasty.color;
       stateEl.style.opacity = '0.6';
     }
   });
   ```

3. **Remove CSS** from `style.css`:
   - `.dynasty-capital-marker`
   - `.dynasty-expansion-circle`
   - `@keyframes capital-pulse`
   - `@keyframes wave-expand`

---

**Last Updated:** August 4, 2026

