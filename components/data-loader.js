// components/data-loader.js
// Loads all JSON data files and exposes them globally for search and other components.

(function () {
  const DATA_FILES = {
    states: './data/states.json',
    rivers: './data/rivers.json',
    forts: './data/forts.json',
    ghats: './data/ghats.json',
    timeline: './data/timeline.json'
  };

  async function loadJSON(url, dataType) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`[DataLoader] ✓ Loaded ${dataType}`);
      return data;
    } catch (error) {
      console.error(`[DataLoader] ✗ Failed to load ${dataType} from ${url}:`, error.message);
      // Return null on error, not empty object - let script.js handle fallback to inline data
      return null;
    }
  }

  async function loadAllData() {
    console.log('[DataLoader] Starting data load...');
    
    // Load all JSON files in parallel
    const [statesData, riversData, fortsData, ghatsData, timelineData] = await Promise.all([
      loadJSON(DATA_FILES.states, 'states'),
      loadJSON(DATA_FILES.rivers, 'rivers'),
      loadJSON(DATA_FILES.forts, 'forts'),
      loadJSON(DATA_FILES.ghats, 'ghats'),
      loadJSON(DATA_FILES.timeline, 'timeline')
    ]);

    // Count successful loads
    const loadedCount = [statesData, riversData, fortsData, ghatsData, timelineData]
      .filter(d => d !== null).length;
    
    console.log(`[DataLoader] Loaded ${loadedCount}/5 data files successfully`);

    // Expose globally (null values will trigger fallback to inline data in script.js)
    window.statesRawData = statesData;
    window.riversData = riversData;
    window.fortsData = fortsData;
    window.ghatsData = ghatsData;
    window.timelineRawData = timelineData;

    // Dispatch event when data is loaded (even if some files failed)
    document.dispatchEvent(new CustomEvent('dataLoaded', {
      detail: { 
        statesData, 
        riversData, 
        fortsData, 
        ghatsData, 
        timelineData,
        success: loadedCount === 5,
        loadedCount
      }
    }));

    if (loadedCount < 5) {
      console.warn('[DataLoader] Some data files failed to load. Falling back to inline data where available.');
    } else {
      console.log('[DataLoader] All data loaded successfully ✓');
    }
  }

  // Load when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllData);
  } else {
    // DOM already loaded
    loadAllData();
  }

})();

