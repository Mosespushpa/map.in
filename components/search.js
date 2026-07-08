// components/search.js
// Global search with autocomplete, fuzzy search, and keyboard navigation.
// Searches: States, Rivers, Forts, Ghats, and Timeline events.
// Emits: searchResultSelected(result) with details for map highlighting and panel update.

(function () {
  let searchIndex = [];
  let currentSelection = -1;
  let searchBox, searchInput, searchClear, searchResults;

  // ── Fuzzy match scoring ──
  function fuzzyScore(needle, haystack) {
    const lowerNeedle = needle.toLowerCase();
    const lowerHay = haystack.toLowerCase();

    if (lowerHay.includes(lowerNeedle)) return 100; // Exact substring match

    let score = 0;
    let needleIdx = 0;
    let prevMatchIdx = -1;

    for (let i = 0; i < lowerHay.length && needleIdx < lowerNeedle.length; i++) {
      if (lowerHay[i] === lowerNeedle[needleIdx]) {
        score += (i - prevMatchIdx === 1) ? 5 : 1; // Boost consecutive matches
        needleIdx++;
        prevMatchIdx = i;
      }
    }

    return needleIdx === lowerNeedle.length ? Math.max(1, score) : 0;
  }

  // ── Build search index from JSON data ──
  function buildIndex() {
    searchIndex = [];

    // States
    if (window.statesData) {
      Object.entries(window.statesData).forEach(([id, state]) => {
        searchIndex.push({
          type: 'state',
          id,
          name: state.name,
          label: state.name,
          capital: state.capital,
          description: state.description,
          icon: 'fa-map',
          searchText: `${state.name} ${state.capital} ${state.language}`.toLowerCase()
        });
      });
    }

    // Rivers - normalize data structure
    if (window.riversData) {
      const riversArray = Array.isArray(window.riversData) 
        ? window.riversData 
        : (window.riversData.rivers || []);
      
      riversArray.forEach(river => {
        searchIndex.push({
          type: 'river',
          id: river.id,
          name: river.name,
          label: river.name,
          description: river.description,
          origin: river.origin,
          length: river.length,
          states: river.states || [],
          icon: 'fa-water',
          searchText: `${river.name} ${river.origin || ''} river ${(river.states || []).join(' ')}`.toLowerCase()
        });
      });
    }

    // Forts - normalize data structure
    if (window.fortsData) {
      const fortsArray = Array.isArray(window.fortsData) 
        ? window.fortsData 
        : (window.fortsData.forts || []);
      
      fortsArray.forEach(fort => {
        searchIndex.push({
          type: 'fort',
          id: fort.id,
          name: fort.name,
          label: fort.name,
          description: fort.description,
          location: fort.location,
          state: fort.state,
          dynasty: fort.dynasty,
          coordinates: fort.coordinates,
          icon: 'fa-chess-rook',
          searchText: `${fort.name} ${fort.location} ${fort.state || ''} ${fort.dynasty || ''}`.toLowerCase()
        });
      });
    }

    // Ghats - normalize data structure
    if (window.ghatsData) {
      const ghatsArray = Array.isArray(window.ghatsData) 
        ? window.ghatsData 
        : (window.ghatsData.ghats || []);
      
      ghatsArray.forEach(ghat => {
        searchIndex.push({
          type: 'ghat',
          id: ghat.id,
          name: ghat.name,
          label: ghat.name,
          description: ghat.description,
          ghatType: ghat.type, // renamed to avoid conflict with search type
          states: ghat.states || [],
          icon: 'fa-layer-group',
          searchText: `${ghat.name} ${ghat.type || ''} ${(ghat.states || []).join(' ')}`.toLowerCase()
        });
      });
    }

    // Timeline Events - normalize data structure
    if (window.TimelineEngine && typeof window.TimelineEngine.loadYear === 'function') {
      const years = [1947, 1950, 1956, 1960, 1971, 2000, 2014, 2025];
      years.forEach(year => {
        const data = window.TimelineEngine.loadYear(year);
        if (data) {
          searchIndex.push({
            type: 'historical-event',
            id: `event-${year}`,
            name: `${year} — ${data.label}`,
            label: `${year} — ${data.label}`,
            description: data.description,
            year,
            icon: 'fa-landmark',
            searchText: `${year} ${data.label} ${data.description || ''}`.toLowerCase()
          });

          // Add individual events
          (data.events || []).forEach((evt, idx) => {
            searchIndex.push({
              type: 'historical-event',
              id: `event-${year}-${idx}`,
              name: evt.event || evt,
              label: evt.event || evt,
              year: evt.year || year,
              icon: 'fa-history',
              searchText: `${evt.year || year} ${evt.event || evt}`.toLowerCase()
            });
          });
        }
      });
    } else if (window.milestones && Array.isArray(window.milestones)) {
      // Fallback to inline milestones from script.js
      window.milestones.forEach(milestone => {
        searchIndex.push({
          type: 'historical-event',
          id: `event-${milestone.year}`,
          name: `${milestone.year} — ${milestone.label}`,
          label: `${milestone.year} — ${milestone.label}`,
          description: milestone.description,
          year: milestone.year,
          icon: 'fa-landmark',
          searchText: `${milestone.year} ${milestone.label} ${milestone.description || ''}`.toLowerCase()
        });

        // Add individual events (handle both string and object formats)
        (milestone.events || []).forEach((evt, eventIdx) => {
          const eventText = typeof evt === 'string' ? evt : evt.event;
          searchIndex.push({
            type: 'historical-event',
            id: `event-${milestone.year}-${eventIdx}`,
            name: eventText,
            label: eventText,
            year: milestone.year,
            icon: 'fa-history',
            searchText: `${milestone.year} ${eventText}`.toLowerCase()
          });
        });
      });
    }
  }

  // ── Perform fuzzy search ──
  function search(query) {
    if (!query.trim()) return [];

    return searchIndex
      .map(item => ({ ...item, score: fuzzyScore(query, item.searchText) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }

  // ── Highlight result item ──
  function selectResult(index) {
    const items = searchResults.querySelectorAll('.search-result-item');
    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
    currentSelection = index;
  }

  // ── Render search results ──
  function renderResults(results) {
    searchResults.innerHTML = '';
    currentSelection = -1;

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results"><i class="fas fa-search"></i> No results</div>';
      return;
    }

    results.forEach((result, idx) => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <i class="fas ${result.icon}"></i>
        <div class="search-result-content">
          <div class="search-result-name">${result.label}</div>
          <div class="search-result-meta">
            ${result.location ? `<span>${result.location}</span>` : ''}
            ${result.capital ? `<span>Capital: ${result.capital}</span>` : ''}
            ${result.origin ? `<span>${result.origin}</span>` : ''}
            ${result.state && result.type === 'fort' ? `<span>${result.state}</span>` : ''}
          </div>
        </div>
      `;

      item.addEventListener('click', () => handleSelection(result));
      item.addEventListener('mouseenter', () => selectResult(idx));
      searchResults.appendChild(item);
    });
  }

  // ── Handle result selection ──
  function handleSelection(result) {
    const event = new CustomEvent('searchResultSelected', { detail: result });
    document.dispatchEvent(event);

    // Visual feedback
    closeSearch();

    // Highlight on map if it's a state or fort
    if (result.type === 'state' && result.id) {
      const el = document.getElementById(result.id);
      if (el) {
        el.dispatchEvent(new Event('mouseenter', { bubbles: true }));
        el.classList.add('search-highlighted');
      }
    } else if (result.type === 'fort' && result.coordinates) {
      // Fort markers will be handled by their own system
      console.log('[Search] Fort selected:', result);
    }

    console.log('[Search] Selected:', result);
  }

  // ── Open/close search ──
  function toggleSearch() {
    searchBox.style.display = searchBox.style.display === 'none' ? 'flex' : 'none';
    if (searchBox.style.display === 'flex') {
      searchInput.focus();
      searchInput.value = '';
      searchResults.innerHTML = '';
    }
  }

  function closeSearch() {
    searchBox.style.display = 'none';
    searchInput.value = '';
    searchResults.innerHTML = '';
  }

  // ── Keyboard navigation ──
  function handleKeydown(e) {
    const items = searchResults.querySelectorAll('.search-result-item');
    const itemCount = items.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        currentSelection = Math.min(currentSelection + 1, itemCount - 1);
        selectResult(currentSelection);
        break;
      case 'ArrowUp':
        e.preventDefault();
        currentSelection = Math.max(currentSelection - 1, 0);
        selectResult(currentSelection);
        break;
      case 'Enter':
        e.preventDefault();
        if (currentSelection >= 0 && currentSelection < itemCount) {
          items[currentSelection].click();
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeSearch();
        break;
    }
  }

  // ── Initialize ──
  function init() {
    searchBox = document.getElementById('searchBox');
    searchInput = document.getElementById('searchInput');
    searchClear = document.getElementById('searchClear');
    searchResults = document.getElementById('searchResults');
    const searchToggleBtn = document.getElementById('searchToggleBtn');

    if (!searchBox || !searchInput || !searchClear || !searchResults) {
      console.warn('[Search] Missing search elements in DOM');
      return;
    }

    // Build search index with data from various sources
    // Wait for data to load (from script.js and JSON files)
    setTimeout(buildIndex, 500);

    // Debounced search on input
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();

      if (query.length === 0) {
        searchResults.innerHTML = '';
        currentSelection = -1;
        return;
      }

      searchTimeout = setTimeout(() => {
        const results = search(query);
        renderResults(results);
      }, 100);
    });

    // Clear button
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchResults.innerHTML = '';
      currentSelection = -1;
      searchInput.focus();
    });

    // Toggle button
    searchToggleBtn.addEventListener('click', toggleSearch);

    // Keyboard navigation
    searchInput.addEventListener('keydown', handleKeydown);

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!searchBox.contains(e.target) && !searchToggleBtn.contains(e.target)) {
        closeSearch();
      }
    });

    console.log('[Search] Initialized successfully');
  }

  // Start when DOM is ready
  document.addEventListener('DOMContentLoaded', init);

  // Expose rebuild for dynamic data
  window.SearchEngine = { buildIndex, search, handleSelection };

})();

