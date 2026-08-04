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
      state.style.cssText = '';
      state.removeAttribute('stroke');
      state.removeAttribute('stroke-width');
      
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

    document.querySelectorAll('.state').forEach(state => {
      try {
        const bbox = state.getBBox();
        const stateName = window.statesData[state.id]?.name ||
                          window.unionTerritories[state.id]?.name ||
                          state.id.replace(/_/g, ' ');
        addTextLabel(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2, stateName, 'state-label', state.id);
      } catch (e) {}
    });
  }

  // All UTs with their pin color and geographic spot(s)
  const UT_PINS = {
    'Andaman_Nicobar': {
      color: '#00BCD4',
      spots: [
        { name: 'Port Blair',    coords: [11.6234, 92.7265] },
        { name: 'Car Nicobar',   coords: [9.1833,  92.8167] },
        { name: 'North Andaman', coords: [13.2667, 92.9833] }
      ]
    },
    'Dadra_Nagar_Haveli_Daman_Diu': {
      color: '#FF9800',
      spots: [
        { name: 'Daman',         coords: [20.3974, 72.8328] },
        { name: 'Diu',           coords: [20.7144, 70.9874] },
        { name: 'Dadra',         coords: [20.0667, 73.0167] },
        { name: 'Nagar Haveli',  coords: [20.1809, 73.0169] }
      ]
    },
    'Puducherry': {
      color: '#E91E63',
      spots: [
        { name: 'Puducherry',    coords: [11.9416, 79.8083] },
        { name: 'Karaikal',      coords: [10.9254, 79.8380] },
        { name: 'Mahé',          coords: [11.7010, 75.5367] },
        { name: 'Yanam',         coords: [16.7333, 82.2167] }
      ]
    },
    'Chandigarh':    { color: '#4CAF50', spots: [{ name: 'Chandigarh', coords: [30.7333, 76.7794] }] },
    'Delhi':         { color: '#FF5722', spots: [{ name: 'New Delhi',   coords: [28.6139, 77.2090] }] },
    'Jammu_Kashmir': { color: '#2196F3', spots: [{ name: 'Srinagar',    coords: [34.0837, 74.7973] }] },
    'Ladakh':        { color: '#9C27B0', spots: [{ name: 'Leh',         coords: [34.1526, 77.5771] }] },
    'Lakshadweep':   { color: '#FFEB3B', spots: [{ name: 'Kavaratti',   coords: [10.5626, 72.6369] }] }
  };

  // SVG pin marker (teardrop shape pointing down)
  function addUTPin(x, y, color, label, clickHandler) {
    const svg = document.getElementById('india-map');
    const g = svg.querySelector('.regions');

    const pin = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    // Teardrop: circle top, point at bottom, centered at (x, y-6), tip at (x, y+2)
    pin.setAttribute('d', `M${x},${y+3} C${x-5},${y-2} ${x-5},${y-10} ${x},${y-10} C${x+5},${y-10} ${x+5},${y-2} ${x},${y+3}Z`);
    pin.setAttribute('fill', color);
    pin.setAttribute('stroke', '#fff');
    pin.setAttribute('stroke-width', '0.8');
    pin.setAttribute('class', 'overlay-marker ut-pin-marker');
    pin.style.cursor = 'pointer';
    pin.setAttribute('title', label);
    if (clickHandler) pin.addEventListener('click', clickHandler);
    g.appendChild(pin);

    // Small dot at tip for clarity
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', x);
    dot.setAttribute('cy', y - 6);
    dot.setAttribute('r', '2');
    dot.setAttribute('fill', '#fff');
    dot.setAttribute('class', 'overlay-marker ut-pin-marker');
    dot.style.pointerEvents = 'none';
    g.appendChild(dot);

    // Name label to the right
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x + 7);
    text.setAttribute('y', y - 4);
    text.setAttribute('class', 'overlay-label ut-pin-label');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('fill', color);
    text.setAttribute('font-size', '8');
    text.setAttribute('font-weight', '700');
    text.style.cursor = 'pointer';
    text.textContent = label;
    if (clickHandler) text.addEventListener('click', clickHandler);
    g.appendChild(text);
  }

  function addUTPins() {
    Object.entries(UT_PINS).forEach(([utId, cfg]) => {
      const utData = window.unionTerritories[utId];
      if (!utData) return;
      cfg.spots.forEach(spot => {
        const [x, y] = latLngToSVG(spot.coords[0], spot.coords[1]);
        addUTPin(x, y, cfg.color, spot.name, () => showUTDetail(utData));
      });
    });
  }

  function showUTsOverlay() {
    console.log('[Overlays] Showing Union Territories overlay');
    clearAllOverlays();

    document.querySelectorAll('.state').forEach(state => state.classList.add('no-hover'));

    showUTInfoPanel();

    // Actual SVG IDs (with spaces as they appear in the SVG)
    const utMappings = {
      'Andaman_Nicobar':              ['Andaman And Nicobar Islands', 'Andaman_Nicobar', 'Andaman_and_Nicobar_Islands'],
      'Dadra_Nagar_Haveli_Daman_Diu': ['Dadra And Nagar Haveli And Daman And Diu', 'Dadra_And_Nagar_Haveli_And_Daman_And_Diu'],
      'Lakshadweep':                  ['Lakshadweep'],
      'Delhi':                        ['Delhi'],
      'Puducherry':                   ['Puducherry'],
      'Chandigarh':                   ['Chandigarh'],
      'Jammu_Kashmir':                ['Jammu_Kashmir'],
      'Ladakh':                       ['Ladakh']
    };

    Object.keys(window.unionTerritories || {}).forEach(utId => {
      const utData = window.unionTerritories[utId];
      if (!utData) return;

      let utElement = null;
      for (const id of (utMappings[utId] || [utId])) {
        utElement = document.getElementById(id);
        if (utElement) break;
      }

      if (utElement) {
        utElement.classList.add('ut-highlight');
        utElement.classList.remove('no-hover');
        utElement._utHoverHandler = () => showUTDetail(utData);
        utElement.addEventListener('mouseenter', utElement._utHoverHandler);
        utElement.addEventListener('click', () => showUTDetail(utData));

        // Skip bbox labels — all UTs use pin markers instead
      } else {
        console.warn(`[Overlays] UT SVG element not found for: ${utId}`);
      }
    });

    // Draw colored pin markers for multi-spot UTs
    addUTPins();
  }

  // ── River definitions: waypoints [lat, lng] along each river's course ──
  // Stroke widths reflect tributary → main river hierarchy (Option B)
  const RIVERS = [
    {
      id: 'indus', name: 'Indus', type: 'Himalayan',
      color: '#56ccf2', width: 2.5,
      labelAt: 0.25,
      pts: [[34.5,73.5],[33.8,73.0],[33.0,72.5],[32.2,72.0],[31.5,71.8],[30.5,71.5],[29.5,71.2],[28.0,70.5],[26.5,69.5],[25.0,68.5],[24.0,67.5]]
    },
    {
      id: 'jhelum', name: 'Jhelum', type: 'Tributary → Indus',
      color: '#74b9ff', width: 1.5,
      labelAt: 0.3,
      pts: [[34.1,74.8],[33.8,74.2],[33.2,73.8],[32.5,73.2],[32.0,72.8],[31.5,72.2],[31.0,71.8]]
    },
    {
      id: 'chenab', name: 'Chenab', type: 'Tributary → Indus',
      color: '#74b9ff', width: 1.5,
      labelAt: 0.3,
      pts: [[33.0,76.5],[32.5,75.8],[32.0,75.0],[31.5,74.2],[31.0,73.5],[30.5,72.8],[30.0,72.2],[31.0,71.8]]
    },
    {
      id: 'ravi', name: 'Ravi', type: 'Tributary → Chenab',
      color: '#a29bfe', width: 1.2,
      labelAt: 0.4,
      pts: [[32.7,76.0],[32.2,75.5],[31.8,75.0],[31.3,74.5],[30.8,74.0],[30.5,73.5],[30.2,73.0],[30.0,72.2]]
    },
    {
      id: 'sutlej', name: 'Sutlej', type: 'Tributary → Indus',
      color: '#74b9ff', width: 1.5,
      labelAt: 0.35,
      pts: [[31.5,78.5],[31.2,77.8],[31.0,77.0],[30.8,76.2],[30.5,75.5],[30.2,74.8],[30.0,74.0],[29.8,73.2],[29.5,72.5],[29.2,71.8],[29.0,71.2]]
    },
    {
      id: 'ganga', name: 'Ganga', type: 'Himalayan',
      color: '#3498db', width: 3,
      labelAt: 0.45,
      pts: [[30.9,79.1],[30.0,78.5],[29.5,78.0],[28.5,77.5],[27.5,78.0],[26.5,79.5],[25.5,81.0],[25.3,82.0],[25.3,83.0],[25.0,84.5],[24.8,85.5],[24.5,87.0],[23.5,88.0],[22.5,88.5],[22.0,89.5]]
    },
    {
      id: 'yamuna', name: 'Yamuna', type: 'Tributary → Ganga',
      color: '#56ccf2', width: 2,
      labelAt: 0.4,
      pts: [[31.0,78.5],[30.5,78.0],[29.8,77.5],[29.0,77.2],[28.6,77.2],[27.5,77.5],[26.5,78.5],[25.5,81.0]]
    },
    {
      id: 'brahmaputra', name: 'Brahmaputra', type: 'Himalayan',
      color: '#3498db', width: 3,
      labelAt: 0.5,
      pts: [[28.0,95.5],[27.5,94.5],[27.0,93.5],[26.5,92.5],[26.2,91.5],[26.0,90.5],[25.8,89.8],[25.5,89.0],[25.0,88.5]]
    },
    {
      id: 'narmada', name: 'Narmada', type: 'Peninsular',
      color: '#2980b9', width: 2,
      labelAt: 0.4,
      pts: [[22.7,81.8],[22.5,80.5],[22.3,79.5],[22.2,78.5],[22.0,77.5],[21.8,76.5],[21.7,75.5],[21.5,74.5],[21.5,73.5],[21.7,72.6]]
    },
    {
      id: 'tapti', name: 'Tapti', type: 'Peninsular',
      color: '#2980b9', width: 1.8,
      labelAt: 0.45,
      pts: [[21.8,78.5],[21.5,77.5],[21.2,76.5],[21.0,75.5],[20.8,74.5],[20.9,73.5],[21.1,72.8]]
    },
    {
      id: 'godavari', name: 'Godavari', type: 'Peninsular',
      color: '#2980b9', width: 2.5,
      labelAt: 0.45,
      pts: [[19.9,73.5],[19.5,74.5],[19.2,75.5],[18.8,76.5],[18.5,77.5],[18.0,78.5],[17.5,79.5],[17.0,80.5],[16.5,81.5],[16.5,82.3]]
    },
    {
      id: 'mahanadi', name: 'Mahanadi', type: 'Peninsular',
      color: '#2980b9', width: 1.8,
      labelAt: 0.5,
      pts: [[20.5,82.0],[20.5,82.8],[20.3,83.5],[20.0,84.0],[20.2,84.8],[20.5,85.5],[20.3,86.2],[20.0,86.8]]
    },
    {
      id: 'krishna', name: 'Krishna', type: 'Peninsular',
      color: '#2980b9', width: 2.5,
      labelAt: 0.45,
      pts: [[17.9,73.7],[17.5,74.5],[17.2,75.5],[16.8,76.5],[16.5,77.5],[16.2,78.5],[16.0,79.5],[15.8,80.5],[15.7,80.9]]
    },
    {
      id: 'kaveri', name: 'Kaveri', type: 'Peninsular',
      color: '#2980b9', width: 2,
      labelAt: 0.45,
      pts: [[12.4,75.7],[12.0,76.5],[11.8,77.5],[11.5,78.5],[11.2,79.0],[11.0,79.5],[10.9,79.8],[10.8,79.9]]
    }
  ];

  // Catmull-Rom spline → SVG cubic bezier path string
  function riverPath(pts) {
    if (pts.length < 2) return '';
    const svgPts = pts.map(([lat, lng]) => latLngToSVG(lat, lng));
    let d = `M${svgPts[0][0].toFixed(1)},${svgPts[0][1].toFixed(1)}`;
    for (let i = 0; i < svgPts.length - 1; i++) {
      const p0 = svgPts[Math.max(i - 1, 0)];
      const p1 = svgPts[i];
      const p2 = svgPts[i + 1];
      const p3 = svgPts[Math.min(i + 2, svgPts.length - 1)];
      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }

  function drawRivers() {
    const svg = document.getElementById('india-map');
    const g = svg.querySelector('.regions');

    RIVERS.forEach(river => {
      const d = riverPath(river.pts);

      // Glow layer
      const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      glow.setAttribute('d', d);
      glow.setAttribute('class', 'overlay-marker river-path');
      glow.setAttribute('stroke', river.color);
      glow.setAttribute('stroke-width', river.width + 3);
      glow.setAttribute('opacity', '0.18');
      g.appendChild(glow);

      // Main river line
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'overlay-marker river-path');
      path.setAttribute('stroke', river.color);
      path.setAttribute('stroke-width', river.width);
      path.setAttribute('data-id', river.id);
      path.style.cursor = 'pointer';
      path.addEventListener('mouseenter', () => showRiverDetail(river));
      path.addEventListener('click', () => showRiverDetail(river));
      g.appendChild(path);

      // Label at ~labelAt fraction along the path
      const svgPts = river.pts.map(([lat, lng]) => latLngToSVG(lat, lng));
      const li = Math.floor(svgPts.length * river.labelAt);
      const [lx, ly] = svgPts[Math.min(li, svgPts.length - 1)];
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', lx + 4);
      label.setAttribute('y', ly - 4);
      label.setAttribute('class', 'overlay-label river-label');
      label.textContent = river.name;
      label.style.cursor = 'pointer';
      label.addEventListener('click', () => showRiverDetail(river));
      g.appendChild(label);
    });
  }

  function showRiversOverlay() {
    console.log('[Overlays] Showing rivers overlay');
    clearAllOverlays();
    document.querySelectorAll('.state').forEach(s => s.classList.add('no-hover'));
    drawRivers();
    showRiversInfoPanel();
  }

  function showRiversInfoPanel() {
    const placeholder = document.getElementById('spPlaceholder');
    const content = document.getElementById('spContent');
    if (!placeholder || !content) return;
    placeholder.classList.add('hidden');
    content.classList.remove('hidden');

    document.getElementById('spTitle').textContent = 'Rivers of India';
    document.getElementById('spSub').textContent = `${RIVERS.length} Major Rivers`;
    document.getElementById('spDesc').textContent = 'Rivers are the lifelines of Indian civilization — click any river on the map or in the list below.';

    document.getElementById('spStats').innerHTML = RIVERS.map(r => `
      <div class="river-list-item" data-river="${r.id}">
        <span class="river-dot" style="background:${r.color}"></span>
        <span class="river-list-name">${r.name}</span>
        <span class="river-list-type">${r.type.split(' →')[0]}</span>
      </div>`).join('');

    document.getElementById('spFacts').innerHTML = '';
    document.getElementById('spEvents').innerHTML = '';

    document.querySelectorAll('.river-list-item').forEach(item => {
      item.addEventListener('click', () => {
        const river = RIVERS.find(r => r.id === item.dataset.river);
        if (river) showRiverDetail(river);
      });
    });
  }

  function showRiverDetail(river) {
    // Merge with riversData from script.js for extra info
    const extra = (window.riversData || []).find(r => r.id === river.id) || {};
    const placeholder = document.getElementById('spPlaceholder');
    const content = document.getElementById('spContent');
    if (placeholder) placeholder.classList.add('hidden');
    if (content) content.classList.remove('hidden');

    document.getElementById('spTitle').textContent = river.name;
    document.getElementById('spSub').textContent = river.type;
    document.getElementById('spDesc').textContent = extra.description || `The ${river.name} is one of India's major rivers.`;

    document.getElementById('spStats').innerHTML = `
      <button class="ut-back-btn" id="riverBackBtn"><i class="fas fa-arrow-left"></i> Back to list</button>
      <div class="stat-item"><i class="fas fa-water"></i><div><span class="stat-label">Type</span><span class="stat-value">${river.type}</span></div></div>
      <div class="stat-item"><i class="fas fa-ruler-horizontal"></i><div><span class="stat-label">Length</span><span class="stat-value">${extra.length || 'N/A'}</span></div></div>
      <div class="stat-item"><i class="fas fa-mountain"></i><div><span class="stat-label">Origin</span><span class="stat-value">${extra.origin || 'N/A'}</span></div></div>
    `;

    document.getElementById('spFacts').innerHTML = extra.facts && extra.facts.length
      ? `<div class="sp-section"><h4><i class="fas fa-lightbulb"></i> Key Facts</h4><ul class="facts-list">${extra.facts.map(f => `<li>${f}</li>`).join('')}</ul></div>`
      : '';
    document.getElementById('spEvents').innerHTML = '';

    document.getElementById('riverBackBtn').addEventListener('click', showRiversInfoPanel);
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
        document.querySelectorAll('.event-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        showEventOnMap(eventId);
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
    
    showEventDetail(event);
  }

  function showEventDetail(event) {
    const placeholder = document.getElementById('spPlaceholder');
    const content = document.getElementById('spContent');
    if (placeholder) placeholder.classList.add('hidden');
    if (content) content.classList.remove('hidden');

    document.getElementById('spTitle').textContent = event.name;
    document.getElementById('spSub').textContent = `${event.year} CE · ${event.location}`;
    document.getElementById('spDesc').textContent = event.description || '';

    document.getElementById('spStats').innerHTML = `
      <button class="ut-back-btn" id="eventBackBtn"><i class="fas fa-arrow-left"></i> Back to list</button>
      <div class="stat-item"><i class="fas fa-calendar-alt"></i><div><span class="stat-label">Year</span><span class="stat-value">${event.year}</span></div></div>
      <div class="stat-item"><i class="fas fa-map-marker-alt"></i><div><span class="stat-label">Location</span><span class="stat-value">${event.location || 'N/A'}</span></div></div>
      <div class="stat-item"><i class="fas fa-history"></i><div><span class="stat-label">Period</span><span class="stat-value">${event.period || 'N/A'}</span></div></div>
    `;

    document.getElementById('spFacts').innerHTML = event.facts && event.facts.length
      ? `<div class="sp-section"><h4><i class="fas fa-lightbulb"></i> Key Facts</h4><ul class="facts-list">${event.facts.map(f => `<li>${f}</li>`).join('')}</ul></div>`
      : '';
    document.getElementById('spEvents').innerHTML = '';

    document.getElementById('eventBackBtn').addEventListener('click', () => {
      document.querySelectorAll('.event-marker, .event-label').forEach(el => el.remove());
      document.querySelectorAll('.event-item').forEach(i => i.classList.remove('active'));
      showEventSelectionPanel();
    });
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
    const placeholder = document.getElementById('spPlaceholder');
    const content = document.getElementById('spContent');
    if (!placeholder || !content) return;

    placeholder.classList.add('hidden');
    content.classList.remove('hidden');

    document.getElementById('spTitle').textContent = 'Union Territories';
    document.getElementById('spSub').textContent = 'India — 8 Union Territories';
    document.getElementById('spDesc').textContent = 'Directly administered by the Central Government of India.';

    const uts = Object.values(window.unionTerritories || {});
    document.getElementById('spStats').innerHTML = uts.map(ut => {
      const utKey = Object.keys(UT_PINS).find(k => window.unionTerritories[k] === ut);
      const color = (utKey && UT_PINS[utKey]) ? UT_PINS[utKey].color : '#9c27b0';
      return `
        <div class="ut-list-item" data-ut="${ut.id}">
          <span class="ut-pin-icon" style="background:${color}"></span>
          <span class="ut-list-name">${ut.name}</span>
          <span class="ut-list-capital">${ut.capital}</span>
        </div>`;
    }).join('');

    document.getElementById('spFacts').innerHTML = '';
    document.getElementById('spEvents').innerHTML = '';

    document.querySelectorAll('.ut-list-item').forEach(item => {
      item.addEventListener('click', () => {
        const ut = uts.find(u => u.id === item.dataset.ut);
        if (ut) showUTDetail(ut);
      });
    });
  }

  function showUTDetail(ut) {
    document.getElementById('spTitle').textContent = ut.name;
    document.getElementById('spSub').textContent = `Capital: ${ut.capital}`;
    document.getElementById('spDesc').textContent = ut.description || '';

    document.getElementById('spStats').innerHTML = `
      <button class="ut-back-btn" id="utBackBtn"><i class="fas fa-arrow-left"></i> Back to list</button>
      <div class="stat-item"><i class="fas fa-city"></i><div><span class="stat-label">Capital</span><span class="stat-value">${ut.capital}</span></div></div>
      <div class="stat-item"><i class="fas fa-expand-arrows-alt"></i><div><span class="stat-label">Area</span><span class="stat-value">${ut.area || 'N/A'}</span></div></div>
      <div class="stat-item"><i class="fas fa-users"></i><div><span class="stat-label">Population</span><span class="stat-value">${ut.population || 'N/A'}</span></div></div>
      <div class="stat-item"><i class="fas fa-language"></i><div><span class="stat-label">Language</span><span class="stat-value">${ut.language || 'N/A'}</span></div></div>
    `;

    if (ut.facts && ut.facts.length) {
      document.getElementById('spFacts').innerHTML = `
        <div class="sp-section">
          <h4><i class="fas fa-lightbulb"></i> Key Facts</h4>
          <ul class="facts-list">${ut.facts.map(f => `<li>${f}</li>`).join('')}</ul>
        </div>`;
    } else {
      document.getElementById('spFacts').innerHTML = '';
    }

    if (ut.historicalEvents && ut.historicalEvents.length) {
      document.getElementById('spEvents').innerHTML = `
        <div class="sp-section">
          <h4><i class="fas fa-history"></i> Historical Timeline</h4>
          <ul class="events-list">${ut.historicalEvents.map(ev =>
            `<li><span class="ev-year">${ev.year}</span><span class="ev-text">${ev.event}</span></li>`
          ).join('')}</ul>
        </div>`;
    } else {
      document.getElementById('spEvents').innerHTML = '';
    }

    document.getElementById('utBackBtn').addEventListener('click', showUTInfoPanel);
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

  function showDynastyDetail(dynasty) {
    document.getElementById('spTitle').textContent = dynasty.name;
    document.getElementById('spSub').textContent = dynasty.period;
    document.getElementById('spDesc').textContent = dynasty.description || '';

    document.getElementById('spStats').innerHTML = `
      <button class="ut-back-btn" id="dynastyBackBtn"><i class="fas fa-arrow-left"></i> Back to list</button>
      <div class="stat-item"><i class="fas fa-calendar-alt"></i><div><span class="stat-label">Period</span><span class="stat-value">${dynasty.period || 'N/A'}</span></div></div>
      <div class="stat-item"><i class="fas fa-city"></i><div><span class="stat-label">Capital</span><span class="stat-value">${dynasty.capital || 'N/A'}</span></div></div>
      <div class="stat-item"><i class="fas fa-map"></i><div><span class="stat-label">States Covered</span><span class="stat-value">${dynasty.states ? dynasty.states.length : 'N/A'}</span></div></div>
    `;

    document.getElementById('spFacts').innerHTML = dynasty.facts && dynasty.facts.length
      ? `<div class="sp-section"><h4><i class="fas fa-lightbulb"></i> Key Facts</h4><ul class="facts-list">${dynasty.facts.map(f => `<li>${f}</li>`).join('')}</ul></div>`
      : '';
    document.getElementById('spEvents').innerHTML = '';

    document.getElementById('dynastyBackBtn').addEventListener('click', () => {
      // Clear map highlights before going back
      activeDynasties.clear();
      document.querySelectorAll('.dynasty-highlight').forEach(el => {
        el.classList.remove('dynasty-highlight');
        el.style.fill = '';
        el.style.opacity = '';
      });
      showDynastySelectionPanel();
    });
  }

  function toggleDynasty(dynastyId) {
    const dynasty = (window.dynastiesData || []).find(d => d.id === dynastyId);
    if (!dynasty) return;

    activeDynasties.clear();
    document.querySelectorAll('.dynasty-highlight').forEach(el => {
      el.classList.remove('dynasty-highlight');
      el.style.fill = '';
      el.style.opacity = '';
    });
    document.querySelectorAll('.dynasty-item').forEach(item => item.classList.remove('active'));

    activeDynasties.add(dynastyId);
    dynasty.states.forEach(stateId => {
      const stateEl = document.getElementById(stateId);
      if (stateEl) {
        stateEl.classList.add('dynasty-highlight');
        stateEl.style.fill = dynasty.color;
        stateEl.style.opacity = '0.6';
      }
    });

    const dynastyItem = document.querySelector(`[data-dynasty="${dynastyId}"]`);
    if (dynastyItem) dynastyItem.classList.add('active');

    showDynastyDetail(dynasty);
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
      
      showDynastyDetail(dynasty);
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