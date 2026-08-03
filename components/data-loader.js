// components/data-loader.js
// Simple data loader that triggers initialization with inline data

(function () {
  console.log('[DataLoader] Using inline data initialization');
  
  // Dispatch event to initialize with inline data
  function initializeInlineData() {
    document.dispatchEvent(new CustomEvent('dataLoaded', {
      detail: { 
        statesData: null, // null means use inline data
        riversData: null,
        fortsData: null, 
        ghatsData: null,
        timelineData: null,
        success: false, // Force fallback to inline data
        loadedCount: 0
      }
    }));
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInlineData);
  } else {
    // DOM already loaded, initialize immediately
    setTimeout(initializeInlineData, 100);
  }

})();

