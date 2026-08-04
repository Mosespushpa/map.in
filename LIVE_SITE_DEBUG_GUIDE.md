# 🔧 Live Site Debug Guide for Map.in

## 🚨 Quick Diagnosis

If the features aren't working on the live site, follow these steps to identify and fix the issues:

### **Step 1: Open Browser Console**
1. Visit: https://mosespushpa.github.io/map.in/
2. Press `F12` or right-click → "Inspect"  
3. Go to the "Console" tab
4. Look for red error messages

### **Step 2: Run Comprehensive Test**
In the console, type:
```javascript
testMapApp()
```

This will show detailed diagnostics of all components.

---

## 🔍 Common Issues & Fixes

### **Issue 1: JavaScript Errors on Load**

**Symptoms:** Red errors in console, nothing works
**Likely Causes:** 
- Missing files (404 errors)
- Syntax errors in JavaScript files
- CORS issues with GitHub Pages

**Fix:**
1. Check for 404 errors in Network tab
2. If files are missing, ensure they're pushed to GitHub
3. Clear browser cache (Ctrl+F5)

### **Issue 2: Map Elements Missing**

**Symptoms:** `testMapApp()` shows "❌ Missing" for core elements
**Likely Causes:**
- SVG map not loading properly
- HTML structure malformed

**Fix:**
1. Check if `index.html` contains the full SVG map
2. Verify all `<path>` elements have proper `id` attributes
3. Check browser's Elements tab for the `#india-map` element

### **Issue 3: Data Not Loading**

**Symptoms:** `testMapApp()` shows empty or missing data
**Likely Causes:**
- Data-loader trying to fetch non-existent JSON files
- Inline data not properly defined

**Fix:**
1. Ensure `components/data-loader.js` is using inline data mode
2. Check if all data arrays are properly defined in `script.js`

### **Issue 4: Components Not Initializing**

**Symptoms:** No event handlers, overlays don't work
**Likely Causes:**
- Script loading order issues
- Missing dependencies
- Event listeners not attaching

**Fix:**
1. Check script loading order in `index.html`
2. Verify all component files are loaded
3. Check if initialization events are firing

### **Issue 5: GitHub Pages Specific Issues**

**Symptoms:** Works locally but not on GitHub Pages
**Common Causes:**
- Case sensitivity (Linux server vs Windows dev)
- Relative path issues
- Missing files in repository

**Fix:**
1. Ensure all file names match exactly (case-sensitive)
2. Verify all files are committed and pushed
3. Check repository file structure matches local

---

## 🛠️ Advanced Debugging Commands

### **Test Specific Components:**

```javascript
// Test map elements
console.log('Map SVG:', document.getElementById('india-map'));
console.log('States:', document.querySelectorAll('.state').length);

// Test data availability  
console.log('States Data:', Object.keys(window.statesData || {}).length);
console.log('Overlays Available:', !!window.MapOverlays);

// Test functions
console.log('showPanel function:', typeof window.showPanel);

// Force initialize if needed
init();

// Test overlays manually
if (window.MapOverlays) {
  window.MapOverlays.showStatesOverlay();
}

// Test panel manually
if (window.statesData && window.statesData.Maharashtra) {
  window.showPanel(window.statesData.Maharashtra, 'states');
}
```

### **Emergency Recovery:**
If nothing works, try this in console:
```javascript
// Force reload all components
location.reload();

// Or try manual initialization
setTimeout(() => {
  if (typeof init === 'function') init();
}, 1000);
```

---

## 📋 Checklist for Working Site

✅ **Files Present:**
- [ ] `index.html` with complete SVG map
- [ ] `script.js` with all inline data
- [ ] `components/overlays.js`
- [ ] `components/tags.js`  
- [ ] `components/data-loader.js`
- [ ] `components/overlays.css`
- [ ] `style.css`

✅ **Console Shows:**
- [ ] No red error messages
- [ ] `testMapApp()` returns all green checkmarks
- [ ] Map elements detected (28+ states)
- [ ] Data loaded (states, dynasties, etc.)
- [ ] Event handlers attached

✅ **Features Work:**
- [ ] Tag buttons change appearance when clicked
- [ ] States highlight on hover (States tag)
- [ ] Side panel shows information
- [ ] Panel can be resized by dragging left edge
- [ ] Dynasty/Events selection works
- [ ] Logo reset functionality works

---

## 🔄 Recovery Procedure

If the site is completely broken:

1. **Check Repository Structure:**
   ```
   map.in/
   ├── index.html
   ├── script.js
   ├── style.css
   └── components/
       ├── overlays.js
       ├── overlays.css
       ├── tags.js
       └── data-loader.js
   ```

2. **Verify Critical Files:**
   - Ensure `index.html` contains the complete SVG map
   - Check `script.js` has all inline data arrays
   - Verify no syntax errors in any files

3. **Force GitHub Pages Rebuild:**
   - Make a small commit (add a space somewhere)
   - Push to GitHub
   - Wait 2-3 minutes for rebuild

4. **Test Locally First:**
   - Open `index.html` in browser locally
   - Ensure everything works before pushing

---

## 📞 Quick Fixes for Specific Problems

### **States Not Hoverable:**
```javascript
// Check if handlers are attached
document.querySelectorAll('.state').forEach(s => console.log(s.id, s._hasHandlers));

// Force attach handlers
attachStateHandlers();
```

### **Panel Not Resizing:**
```javascript
// Check resize handle
console.log('Resize handle:', document.querySelector('.panel-resize-handle'));

// Force init resize
initPanelResize();
```

### **Overlays Not Showing:**
```javascript
// Test overlay system
if (window.MapOverlays) {
  window.MapOverlays.clearAllOverlays();
  window.MapOverlays.showStatesOverlay();
}
```

This guide should help identify and fix any issues preventing the Map.in features from working on the live GitHub Pages site.