// components/overlays.js
// Advanced overlay system for all map categories
// Handles states, UTs, rivers, ghats, forts, languages, dynasties, events

(function() {
  
  // Wait for dependencies to be loaded
  if (!document.getElementById('india-map')) {
    console.log('[Overlays] Waiting for map to load...');
    setTimeout(() => {
      if (document.getElementById('india-map')) {
        console.log('[Overlays] Map found, initializing overlays...');
      }
    }, 1000);
  }
  
  // Language color mapping
  const LANGUAGE_COLORS = {
    'Hindi': '#FF6B6B',
    'Bengali': '#4ECDC4', 
    'Telugu': '#45B7D1',
    'Marathi': '#96CEB4',
    'Tamil': '#FECA57',
    'Gujarati': '#FF9FF3',
    'Kannada': '#54A0FF',
    'Malayalam': '#5F27CD',
    'Punjabi': '#00D2D3',
    'Odia': '#FF9F43',
    'Assamese': '#10AC84',
    'Meitei': '#EE5A24',
    'Mizo': '#0984E3',
    'Nepali': '#6C5CE7',
    'Konkani': '#A29BFE',
    'English': '#FDCB6E'
  };

  // Dynasty timeline years (separate from main timeline)
  const DYNASTY_TIMELINE = [
    { year: -322, label: 'Maurya', dynasty: 'maurya' },
    { year: 320, label: 'Gupta', dynasty: 'gupta' },
    { year: 1206, label: 'Delhi Sultanate', dynasty: null },
    { year: 1336, label: 'Vijayanagara', dynasty: 'vijayanagara' },
    { year: 1526, label: 'Mughal', dynasty: 'mughal' },
    { year: 1674, label: 'Maratha', dynasty: 'maratha' },
    { year: 1724, label: 'Nizam', dynasty: null },
    { year: 1947, label: 'Independence', dynasty: null }
  ];

  let currentOverlayMode = 'states';
  let activeDynasties = new Set();
  
  function clearAllOverlays() {
    const svg = document.getElementById('india-map');
    if (!svg) return;
    
    // Remove all overlay elements
    svg.querySelectorAll('.overlay-marker, .overlay-label, .overlay-polygon').forEach(el => el.remove());
    
    // Clear all highlighting and reset styles
    document.querySelectorAll('.state').forEach(state => {
      state.classList.remove('category-highlight', 'dynasty-highlight', 'language-highlight', 'ut-highlight', 'no-hover');
      state.style.fill = '';
      state.style.stroke = '';
      state.style.strokeWidth = '';
      state.style.opacity = '';
      state.style.filter = '';
      
      // Remove category-specific event handlers
      if (state._languageHoverHandler) {
        state.removeEventListener('mouseenter', state._languageHoverHandler);
        state._languageHoverHandler = null;
      }
      if (state._utHoverHandler) {
        state.removeEventListener('mouseenter', state._utHoverHandler);
        state._utHoverHandler = null;
      }
      if (state._ghatHoverHandler) {
        state.removeEventListener('mouseenter', state._ghatHoverHandler);
        state._ghatHoverHandler = null;
      }
    });
  }

  function showStatesOverlay() {
    console.log('[Overlays] Showing states overlay');
    clearAllOverlays();
    
    // Highlight all states with borders and show names
    document.querySelectorAll('.state').forEach(state => {
      state.classList.add('category-highlight');
      
      // Add state name label
      try {
        const bbox = state.getBBox();
        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;
        
        const stateName = window.statesData[state.id]?.name || 
                         window.unionTerritories[state.id]?.name || 
                         state.id.replace('_', ' ');
        
        addTextLabel(centerX, centerY, stateName, 'state-label', state.id);
      } catch (e) {
        console.warn(`[Overlays] Could not add label for ${state.id}:`, e);
      }
    });
  }

  function showUTsOverlay() {
    console.log('[Overlays] Showing Union Territories overlay');
    clearAllOverlays();
    
    // Disable hover effects for all states
    document.querySelectorAll('.state').forEach(state => {
      state.classList.add('no-hover');
    });
    
    // Show UT info in side panel
    showUTInfoPanel();
    
    // Find missing UTs by searching for alternate IDs in SVG
    const utMappings = {
      'Andaman_Nicobar': ['Andaman_Nicobar', 'Andaman_and_Nicobar_Islands', 'AndamanNicobar'],
      'Dadra_Nagar_Haveli_Daman_Diu': ['Dadra_Nagar_Haveli_Daman_Diu', 'Dadra_And_Nagar_Haveli_And_Daman_And_Diu', 'DadraNagarHaveliDamanDiu'],
      'Lakshadweep': ['Lakshadweep', 'Laccadive_Islands'],
      'Delhi': ['Delhi', 'NCT_Delhi'],
      'Puducherry': ['Puducherry', 'Pondicherry'],
      'Chandigarh': ['Chandigarh'],
      'Jammu_Kashmir': ['Jammu_Kashmir', 'Jammu_and_Kashmir'],
      'Ladakh': ['Ladakh']
    };
    
    // Highlight UTs with distinct color and show names
    Object.keys(window.unionTerritories || {}).forEach(utId => {
      const utData = window.unionTerritories[utId];
      if (!utData) return;
      
      // Try to find the UT element with various possible IDs
      let utElement = null;
      const possibleIds = utMappings[utId] || [utId];
      
      for (const id of possibleIds) {
        utElement = document.getElementById(id);
        if (utElement) break;
      }
      
      if (utElement) {
        utElement.classList.add('ut-highlight');
        utElement.classList.remove('no-hover'); // Allow hover for UTs
        
        // Add hover handler for UTs
        utElement._utHoverHandler = () => {
          window.showPanel(utData, 'uts');
        };
        utElement.addEventListener('mouseenter', utElement._utHoverHandler);
        
        try {
          const bbox = utElement.getBBox();
          const centerX = bbox.x + bbox.width / 2;
          const centerY = bbox.y + bbox.height / 2;
          
          addTextLabel(centerX, centerY, utData.name, 'ut-label', utId, () => {
            window.showPanel(utData, 'uts');
          });
        } catch (e) {
          console.warn(`[Overlays] Could not add UT label for ${utId}:`, e);
        }
      } else {
        console.warn(`[Overlays] UT element not found for ${utId}. Tried IDs:`, possibleIds);
      }
    });
  }

  function showRiversOverlay() {
    console.log('[Overlays] Rivers - Under Development');
    clearAllOverlays();
    
    // Disable hover effects for all states
    document.querySelectorAll('.state').forEach(state => {
      state.classList.add('no-hover');
    });
    
    // Show "under development" message
    const placeholder = document.getElementById('spPlaceholder');
    const content = document.getElementById('spContent');
    
    if (!placeholder || !content) return;
    
    placeholder.classList.add('hidden');
    content.classList.remove('hidden');
    
    document.getElementById('spTitle').textContent = 'Rivers';
    document.getElementById('spSub').textContent = 'Under Development';
    document.getElementById('spDesc').textContent = 'Rivers visualization and interaction features are currently under development. This section will be available soon with detailed information about major Indian rivers, their courses, and significance.';
    
    document.getElementById('spStats').innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: #888;">
        <i class="fas fa-water" style="font-size: 48px; margin-bottom: 16px; color: #3498db;"></i>
        <h3 style="color: #3498db; margin-bottom: 8px;">Coming Soon</h3>
        <p>Interactive rivers map with detailed information about:</p>
        <ul style="text-align: left; margin: 16px 0;">
          <li>River courses and tributaries</li>
          <li>Historical significance</li>
          <li>Cultural importance</li>
          <li>Economic impact</li>
        </ul>
      </div>
    `;
    
    document.getElementById('spFacts').innerHTML = '';
    document.getElementById('spEvents').innerHTML = '';
  }

  function showGhatsOverlay() {
    console.log('[Overlays] Showing ghats overlay');
    clearAllOverlays();
    
    // Disable hover effects for all states initially
    document.querySelectorAll('.state').forEach(state => {
      state.classList.add('no-hover');
    });
    
    // Show ghats info in side panel first
    showGhatsInfoPanel();
    
    // Highlight states that contain Western/Eastern Ghats
    const westernGhatsStates = ['Gujarat','Maharashtra','Goa','Karnataka','Kerala','Tamil_Nadu'];
    const easternGhatsStates = ['Odisha','Andhra_Pradesh','Tamil_Nadu'];
    
    westernGhatsStates.forEach(stateId => {
      const stateEl = document.getElementById(stateId);
      if (stateEl) {
        stateEl.style.fill = '#27AE60';
        stateEl.style.opacity = '0.6';
        stateEl.classList.add('category-highlight');
        stateEl.classList.remove('no-hover'); // Allow interaction for ghat states
        
        // Add hover handler for Western Ghats states
        stateEl._ghatHoverHandler = () => {
          const ghatData = {
            name: 'Western Ghats Region',
            description: `${window.statesData[stateId]?.name || stateId} is part of the Western Ghats mountain range.`,
            facts: [
              'Part of Western Ghats mountain range',
              'UNESCO World Heritage Site',
              'Biodiversity hotspot',
              'Major source of rivers'
            ],
            type: 'Mountain Range'
          };
          window.showPanel(ghatData, 'ghats');
        };
        stateEl.addEventListener('mouseenter', stateEl._ghatHoverHandler);
      }
    });
    
    easternGhatsStates.forEach(stateId => {
      const stateEl = document.getElementById(stateId);
      if (stateEl) {
        stateEl.style.fill = '#E67E22';
        stateEl.style.opacity = '0.6';
        stateEl.classList.add('category-highlight');
        stateEl.classList.remove('no-hover'); // Allow interaction for ghat states
        
        // Add hover handler for Eastern Ghats states
        stateEl._ghatHoverHandler = () => {
          const ghatData = {
            name: 'Eastern Ghats Region',
            description: `${window.statesData[stateId]?.name || stateId} is part of the Eastern Ghats mountain range.`,
            facts: [
              'Part of Eastern Ghats mountain range',
              'Discontinuous mountain range',
              'Rich in minerals',
              'Ancient geological formation'
            ],
            type: 'Mountain Range'
          };
          window.showPanel(ghatData, 'ghats');
        };
        stateEl.addEventListener('mouseenter', stateEl._ghatHoverHandler);
      }
    });
    
    // Better positioned ghat labels
    addTextLabel(170, 320, 'Western Ghats', 'ghat-label');
    addTextLabel(320, 260, 'Eastern Ghats', 'ghat-label');
    
    // Add river ghat markers with improved positioning
    const riverGhats = [
      { name: 'Varanasi Ghats', coords: [25.3176, 82.9739] },
      { name: 'Rishikesh Ghats', coords: [30.0869, 78.2676] },
      { name: 'Haridwar Ghats', coords: [29.9457, 78.1642] }
    ];
    
    riverGhats.forEach(ghat => {
      const [x, y] = latLngToSVG(ghat.coords[0], ghat.coords[1]);
      addMarker(x, y, 'ghat-marker', ghat.name, () => {
        const ghatData = (window.ghatsData || []).find(g => g.name.includes(ghat.name.split(' ')[0])) || {
          name: ghat.name,
          description: `${ghat.name} are sacred steps leading to the river, important for Hindu rituals and ceremonies.`,
          facts: [
            'Sacred river steps',
            'Important pilgrimage site',
            'Ancient cultural significance',
            'Daily ritual activities'
          ],
          type: 'River Ghats'
        };
        window.showPanel(ghatData, 'ghats');
      });
      
      // Add labels next to markers with better positioning
      addTextLabel(x + 12, y - 5, ghat.name.replace(' Ghats', ''), 'ghat-label', ghat.name, () => {
        const ghatData = (window.ghatsData || []).find(g => g.name.includes(ghat.name.split(' ')[0])) || {
          name: ghat.name,
          description: `${ghat.name} are sacred steps leading to the river, important for Hindu rituals and ceremonies.`,
          facts: [
            'Sacred river steps',
            'Important pilgrimage site',
            'Ancient cultural significance',
            'Daily ritual activities'
          ],
          type: 'River Ghats'
        };
        window.showPanel(ghatData, 'ghats');
      });
    });
  }

  function showFortsOverlay() {
    console.log('[Overlays] Showing forts overlay');
    clearAllOverlays();
    
    // Show forts info in side panel
    showFortsInfoPanel();
    
    // Add fort markers with name labels
    (window.fortsData || []).forEach(fort => {
      if (fort.coordinates && fort.coordinates.length >= 2) {
        const [x, y] = latLngToSVG(fort.coordinates[0], fort.coordinates[1]);
        
        // Add fort marker
        addMarker(x, y, 'fort-marker', fort.name, () => {
          window.showPanel(fort, 'forts');
        });
        
        // Add fort name label
        addTextLabel(x + 8, y - 8, fort.name, 'fort-label', fort.id, () => {
          window.showPanel(fort, 'forts');
        });
      }
    });
  }

  function showLanguagesOverlay() {
    console.log('[Overlays] Showing languages overlay');
    clearAllOverlays();
    
    // Show languages info in side panel
    showLanguagesInfoPanel();
    
    // Color states by language and add language labels
    Object.entries(window.stateLanguages || {}).forEach(([stateId, language]) => {
      const stateEl = document.getElementById(stateId);
      if (stateEl) {
        const color = LANGUAGE_COLORS[language] || '#95A5A6';
        stateEl.style.fill = color;
        stateEl.style.opacity = '0.8';
        stateEl.classList.add('language-highlight');
        
        // Add hover handler for languages
        stateEl._languageHoverHandler = () => {
          const langData = {
            name: language,
            description: `${language} is the official language of ${window.statesData[stateId]?.name || window.unionTerritories[stateId]?.name || stateId}`,
            facts: [
              `Official language of ${window.statesData[stateId]?.name || window.unionTerritories[stateId]?.name}`,
              `Part of ${Object.keys(window.stateLanguages).filter(id => window.stateLanguages[id] === language).length} states/UTs`,
              'Click to see more details'
            ],
            type: 'Official Language'
          };
          window.showPanel(langData, 'languages');
        };
        
        stateEl.addEventListener('mouseenter', stateEl._languageHoverHandler);
        
        try {
          const bbox = stateEl.getBBox();
          const centerX = bbox.x + bbox.width / 2;
          const centerY = bbox.y + bbox.height / 2;
          
          addTextLabel(centerX, centerY, language, 'language-label', stateId, () => {
            const langData = {
              name: language,
              description: `${language} is the official language of ${window.statesData[stateId]?.name || window.unionTerritories[stateId]?.name || stateId}`,
              facts: [
                `Official language of ${window.statesData[stateId]?.name || window.unionTerritories[stateId]?.name}`,
                `Spoken by millions of people`,
                `Rich literary tradition`,
                `Cultural significance in the region`
              ],
              type: 'Official Language'
            };
            window.showPanel(langData, 'languages');
          });
        } catch (e) {
          console.warn(`[Overlays] Could not add language label for ${stateId}:`, e);
        }
      }
    });
  }

  function showDynastiesOverlay() {
    console.log('[Overlays] Showing dynasties overlay');
    clearAllOverlays();
    
    // Show dynasty selection panel
    showDynastySelectionPanel();
  }

  function showHistoricalEventsOverlay() {
    console.log('[Overlays] Showing historical events overlay');
    clearAllOverlays();
    
    // Show events selection panel similar to dynasties
    showEventSelectionPanel();
  }

  function showEventSelectionPanel() {
    const placeholder = document.getElementById('spPlaceholder');
    const content = document.getElementById('spContent');
    
    if (!placeholder || !content) return;
    
    placeholder.classList.add('hidden');
    content.classList.remove('hidden');
    
    document.getElementById('spTitle').textContent = 'Historical Events';
    document.getElementById('spSub').textContent = 'Click events to see their locations';
    document.getElementById('spDesc').textContent = 'Select historical events to view their locations and significance on the map.';
    
    // Group events by time periods
    const eventsByPeriod = {
      'Ancient': (window.historicalEvents || []).filter(e => e.period === 'Ancient'),
      'Medieval': (window.historicalEvents || []).filter(e => e.period === 'Medieval'),
      'Colonial': (window.historicalEvents || []).filter(e => e.period === 'Colonial'),
      'Independence Movement': (window.historicalEvents || []).filter(e => e.period === 'Independence Movement'),
      'Modern': (window.historicalEvents || []).filter(e => e.period === 'Modern')
    };
    
    // Create grouped event list
    let eventList = '';
    Object.entries(eventsByPeriod).forEach(([period, events]) => {
      if (events.length > 0) {
        eventList += `<div style="margin: 16px 0;">
          <h4 style="color: #667eea; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">${period}</h4>`;
        
        events.forEach(event => {
          eventList += `<div class="event-item" data-event="${event.id}" style="cursor: pointer; padding: 8px; margin: 4px 0; border-radius: 6px; border: 2px solid #ff9800; background: rgba(255,152,0,0.1);">
            <div style="font-weight: 600; color: #ff9800;">${event.name}</div>
            <div style="font-size: 12px; color: #888;">${event.year} CE • ${event.location}</div>
          </div>`;
        });
        
        eventList += '</div>';
      }
    });
    
    document.getElementById('spStats').innerHTML = eventList;
    
    // Add click handlers for event selection
    document.querySelectorAll('.event-item').forEach(item => {
      item.addEventListener('click', () => {
        const eventId = item.dataset.event;
        showEventOnMap(eventId);
        
        // Clear previous active states
        document.querySelectorAll('.event-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });
    
    document.getElementById('spFacts').innerHTML = '';
    document.getElementById('spEvents').innerHTML = '';
  }

  function showEventOnMap(eventId) {
    const event = (window.historicalEvents || []).find(e => e.id === eventId);
    if (!event) return;
    
    // Clear previous event markers
    document.querySelectorAll('.event-marker, .event-label').forEach(el => el.remove());
    
    // Add event marker and label
    if (event.coordinates && event.coordinates.length >= 2) {
      const [x, y] = latLngToSVG(event.coordinates[0], event.coordinates[1]);
      
      // Add event marker
      addMarker(x, y, 'event-marker', event.name, () => {
        window.showPanel(event, 'events');
      });
      
      // Add event name label
      addTextLabel(x + 8, y - 8, event.name, 'event-label', event.id, () => {
        window.showPanel(event, 'events');
      });
    }
    
    // Show event details in panel
    window.showPanel(event, 'events');
  }

  // Helper functions
  function addTextLabel(x, y, text, className, id = '', clickHandler = null) {
    const svg = document.getElementById('india-map');
    const g = svg.querySelector('.regions');
    
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', y);
    label.setAttribute('class', `overlay-label ${className}`);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'middle');
    if (id) label.setAttribute('data-id', id);
    label.textContent = text;
    
    if (clickHandler) {
      label.style.cursor = 'pointer';
      label.addEventListener('click', clickHandler);
    }
    
    g.appendChild(label);
  }

  function addMarker(x, y, className, title, clickHandler = null) {
    const svg = document.getElementById('india-map');
    const g = svg.querySelector('.regions');
    
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    marker.setAttribute('cx', x);
    marker.setAttribute('cy', y);
    marker.setAttribute('r', '4');
    marker.setAttribute('class', `overlay-marker ${className}`);
    marker.setAttribute('title', title);
    
    if (clickHandler) {
      marker.style.cursor = 'pointer';
      marker.addEventListener('click', clickHandler);
    }
    
    g.appendChild(marker);
  }

  function latLngToSVG(lat, lng) {
    return [((lng - 68) / 29) * 432, ((37 - lat) / 29) * 488];
  }

  // Info panel functions for each category
  function showUTInfoPanel() {
    const utCount = Object.keys(window.unionTerritories || {}).length;
    const panelData = {
      name: 'Union Territories',
      description: `India has ${utCount} Union Territories directly administered by the Central Government.`,
      facts: ['Directly governed by Central Government', 'Total UTs: ' + utCount, 'Include islands, capitals, and strategic regions'],
      type: 'Administrative Divisions'
    };
    window.showPanel(panelData, 'uts');
  }

  function showRiversInfoPanel() {
    const riverCount = (window.riversData || []).length;
    const panelData = {
      name: 'Major Rivers',
      description: `India has ${riverCount} major rivers flowing through different regions.`,
      facts: ['Ganga - Longest river in India', 'Brahmaputra - Largest by discharge', 'Rivers are lifelines of Indian civilization'],
      type: 'Water Bodies'
    };
    window.showPanel(panelData, 'rivers');
  }

  function showGhatsInfoPanel() {
    const panelData = {
      name: 'Mountain Ghats',
      description: 'The Western and Eastern Ghats are UNESCO World Heritage Sites and biodiversity hotspots.',
      facts: ['Western Ghats - 1,600 km long', 'Eastern Ghats - 1,750 km long', 'River ghats are steps leading to water bodies'],
      type: 'Mountain Ranges'
    };
    window.showPanel(panelData, 'ghats');
  }

  function showFortsInfoPanel() {
    const fortCount = (window.fortsData || []).length;
    const panelData = {
      name: 'Historical Forts',
      description: `India has ${fortCount} major historical forts representing different dynasties and eras.`,
      facts: ['Red Fort - Mughal architecture', 'Chittorgarh - Largest fort in India', 'Forts showcase India\'s military heritage'],
      type: 'Historical Monuments'
    };
    window.showPanel(panelData, 'forts');
  }

  function showLanguagesInfoPanel() {
    const langCount = new Set(Object.values(window.stateLanguages || {})).size;
    const panelData = {
      name: 'Official Languages',
      description: `India recognizes ${langCount} different official languages across states and UTs.`,
      facts: ['22 scheduled languages in Constitution', 'Hindi most widely spoken', 'English co-official at central level'],
      type: 'Linguistic Diversity'
    };
    window.showPanel(panelData, 'languages');
  }

  function showEventsInfoPanel() {
    const eventCount = (window.historicalEvents || []).length;
    const panelData = {
      name: 'Historical Events',
      description: `Key historical events that shaped India's past and present.`,
      facts: ['Independence movement landmarks', 'Battle sites and political events', 'Events span from ancient to modern times'],
      type: 'Historical Milestones'
    };
    window.showPanel(panelData, 'events');
  }

  function showDynastySelectionPanel() {
    const placeholder = document.getElementById('spPlaceholder');
    const content = document.getElementById('spContent');
    
    if (!placeholder || !content) return;
    
    placeholder.classList.add('hidden');
    content.classList.remove('hidden');
    
    document.getElementById('spTitle').textContent = 'Historical Dynasties';
    document.getElementById('spSub').textContent = 'Click dynasties to see their territories';
    document.getElementById('spDesc').textContent = 'Select one or more dynasties to view their coverage areas with semi-transparent overlays.';
    
    // Show dynasty list as clickable items
    const dynastyList = (window.dynastiesData || []).map(dynasty => 
      `<div class="dynasty-item" data-dynasty="${dynasty.id}" style="cursor: pointer; padding: 8px; margin: 4px 0; border-radius: 6px; border: 2px solid ${dynasty.color}; background: rgba(255,255,255,0.05);">
        <div style="font-weight: 600; color: ${dynasty.color};">${dynasty.name}</div>
        <div style="font-size: 12px; color: #888;">${dynasty.period} • Capital: ${dynasty.capital}</div>
      </div>`
    ).join('');
    
    document.getElementById('spStats').innerHTML = dynastyList;
    
    // Add click handlers for dynasty selection
    document.querySelectorAll('.dynasty-item').forEach(item => {
      item.addEventListener('click', () => {
        const dynastyId = item.dataset.dynasty;
        toggleDynasty(dynastyId);
        item.classList.toggle('active');
      });
    });
    
    document.getElementById('spFacts').innerHTML = '';
    document.getElementById('spEvents').innerHTML = '';
  }

  function toggleDynasty(dynastyId) {
    const dynasty = (window.dynastiesData || []).find(d => d.id === dynastyId);
    if (!dynasty) return;
    
    // For single selection, clear all previous dynasties first
    activeDynasties.clear();
    document.querySelectorAll('.dynasty-highlight').forEach(el => {
      el.classList.remove('dynasty-highlight');
      el.style.fill = '';
      el.style.opacity = '';
    });
    
    // Clear all dynasty item active states
    document.querySelectorAll('.dynasty-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Add the new dynasty
    activeDynasties.add(dynastyId);
    dynasty.states.forEach(stateId => {
      const stateEl = document.getElementById(stateId);
      if (stateEl) {
        stateEl.classList.add('dynasty-highlight');
        stateEl.style.fill = dynasty.color;
        stateEl.style.opacity = '0.6';
      }
    });
    
    // Mark the selected dynasty item as active
    const dynastyItem = document.querySelector(`[data-dynasty="${dynastyId}"]`);
    if (dynastyItem) {
      dynastyItem.classList.add('active');
    }
    
    // Show dynasty info in panel
    window.showPanel(dynasty, 'dynasties');
  }

  function highlightSpecificDynasty(dynastyId) {
    // Clear all current dynasty highlights
    activeDynasties.clear();
    document.querySelectorAll('.dynasty-highlight').forEach(el => {
      el.classList.remove('dynasty-highlight');
      el.style.fill = '';
      el.style.opacity = '';
    });
    
    // Highlight specific dynasty
    const dynasty = (window.dynastiesData || []).find(d => d.id === dynastyId);
    if (dynasty) {
      activeDynasties.add(dynastyId);
      dynasty.states.forEach(stateId => {
        const stateEl = document.getElementById(stateId);
        if (stateEl) {
          stateEl.classList.add('dynasty-highlight');
          stateEl.style.fill = dynasty.color;
          stateEl.style.opacity = '0.7';
        }
      });
      
      // Update panel with dynasty info
      window.showPanel(dynasty, 'dynasties');
    }
  }

  // Public API - Expose globally but ensure everything is ready
  function ensureMapReady(callback) {
    const map = document.getElementById('india-map');
    const states = document.querySelectorAll('.state');
    
    if (map && states.length > 0) {
      callback();
    } else {
      console.log('[Overlays] Map not ready, retrying...');
      setTimeout(() => ensureMapReady(callback), 100);
    }
  }

  window.MapOverlays = {
    showStatesOverlay: () => ensureMapReady(showStatesOverlay),
    showUTsOverlay: () => ensureMapReady(showUTsOverlay),
    showRiversOverlay: () => ensureMapReady(showRiversOverlay),
    showGhatsOverlay: () => ensureMapReady(showGhatsOverlay),
    showFortsOverlay: () => ensureMapReady(showFortsOverlay),
    showLanguagesOverlay: () => ensureMapReady(showLanguagesOverlay),
    showDynastiesOverlay: () => ensureMapReady(showDynastiesOverlay),
    showHistoricalEventsOverlay: () => ensureMapReady(showHistoricalEventsOverlay),
    clearAllOverlays,
    toggleDynasty,
    highlightSpecificDynasty,
    showEventOnMap: () => ensureMapReady(() => showEventOnMap(...arguments)),
    setCurrentMode: (mode) => { currentOverlayMode = mode; }
  };

  // Event listener for overlay mode changes
  document.addEventListener('overlayModeChanged', (e) => {
    const mode = e.detail;
    console.log(`[Overlays] Mode changed to: ${mode}`);
    
    currentOverlayMode = mode;
    
    switch (mode) {
      case 'states':
        window.MapOverlays.showStatesOverlay();
        break;
      case 'uts':
        window.MapOverlays.showUTsOverlay();
        break;
      case 'rivers':
        window.MapOverlays.showRiversOverlay();
        break;
      case 'ghats':
        window.MapOverlays.showGhatsOverlay();
        break;
      case 'forts':
        window.MapOverlays.showFortsOverlay();
        break;
      case 'languages':
        window.MapOverlays.showLanguagesOverlay();
        break;
      case 'dynasties':
        window.MapOverlays.showDynastiesOverlay();
        break;
      case 'events':
        window.MapOverlays.showHistoricalEventsOverlay();
        break;
      default:
        console.warn(`[Overlays] Unknown mode: ${mode}`);
        window.MapOverlays.clearAllOverlays();
    }
  });

})();