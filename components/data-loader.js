// components/data-loader.js
// Loads all JSON data files and exposes them globally for search and other components.

(function () {
  async function loadJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load ${url}`);
      return await response.json();
    } catch (error) {
      console.warn(`[DataLoader] Error loading ${url}:`, error);
      return null;
    }
  }

  async function loadAllData() {
    // Load all JSON files in parallel
    const [statesData, riversData, fortsData, ghatsData, timelineData] = await Promise.all([
      loadJSON('./data/states.json'),
      loadJSON('./data/rivers.json'),
      loadJSON('./data/forts.json'),
      loadJSON('./data/ghats.json'),
      loadJSON('./data/timeline.json')
    ]);

    // Expose globally
    window.statesRawData = statesData;
    window.riversData = riversData;
    window.fortsData = fortsData;
    window.ghatsData = ghatsData;
    window.timelineRawData = timelineData;

    // Dispatch event when data is loaded
    document.dispatchEvent(new CustomEvent('dataLoaded', {
      detail: { statesData, riversData, fortsData, ghatsData, timelineData }
    }));

    console.log('[DataLoader] All data loaded successfully');
  }

  // Load when DOM is ready
  document.addEventListener('DOMContentLoaded', loadAllData);

})();

