// components/rivers.js
// River overlay layer with SVG paths, toggle via tags, hover interactions, and glow effects.

(function () {
  let riversVisible = false;
  let currentHoveredRiver = null;
  let riverGroup = null;
  let riversData = [];

  // ── River SVG Path Data ──
  // Approximate paths based on river coordinates from rivers.json
  const RIVER_PATHS = {
    ganga: {
      name: 'Ganga (Ganges)',
      path: 'M332,85 Q320,120 310,160 Q300,200 290,240 Q285,260 280,280 Q275,300 270,330 L265,360 L260,390',
      color: '#1e90ff',
      coordinates: { start: [30.9, 79.1], end: [21.9, 89.5] }
    },
    yamuna: {
      name: 'Yamuna',
      path: 'M320,100 Q315,140 310,180 Q305,220 300,260 Q298,280 295,300',
      color: '#4169e1',
      coordinates: { start: [31.0, 78.5], end: [25.4, 81.9] }
    },
    brahmaputra: {
      name: 'Brahmaputra',
      path: 'M380,130 Q360,150 340,170 Q320,190 300,210 L290,220',
      color: '#0099ff',
      coordinates: { start: [28.0, 95.0], end: [25.5, 90.0] }
    },
    godavari: {
      name: 'Godavari',
      path: 'M250,280 Q265,300 280,320 Q295,340 310,360 L320,375',
      color: '#1e90ff',
      coordinates: { start: [19.9, 73.5], end: [16.5, 82.3] }
    },
    krishna: {
      name: 'Krishna',
      path: 'M240,340 Q260,360 280,380 Q300,400 320,420 L330,430',
      color: '#4169e1',
      coordinates: { start: [17.9, 73.7], end: [15.7, 80.9] }
    },
    narmada: {
      name: 'Narmada',
      path: 'M180,240 Q200,260 220,280 Q240,300 260,320 Q280,340 300,360',
      color: '#0099ff',
      coordinates: { start: [22.7, 81.8], end: [21.7, 72.6] }
    },
    cauvery: {
      name: 'Cauvery (Kaveri)',
      path: 'M290,420 Q300,430 310,440 Q320,450 330,460',
      color: '#1e90ff',
      coordinates: { start: [12.4, 75.5], end: [11.1, 79.9] }
    },
    mahanadi: {
      name: 'Mahanadi',
      path: 'M330,330 Q340,350 350,370 Q360,390 370,410',
      color: '#4169e1',
      coordinates: { start: [20.5, 82.1], end: [20.3, 86.7] }
    },
    indus: {
      name: 'Indus',
      path: 'M150,200 Q140,180 130,160 Q120,140 110,120 Q100,100 90,80',
      color: '#0099ff',
      coordinates: { start: [32.5, 79.5], end: [24.0, 67.5] }
    },
    tapti: {
      name: 'Tapti (Tapi)',
      path: 'M200,290 Q220,310 240,330 Q260,350 280,370',
      color: '#1e90ff',
      coordinates: { start: [21.8, 78.2], end: [21.2, 72.6] }
    }
  };

  // ── Initialize River Overlay Layer ──
  function init() {
    const mapSvg = document.getElementById('india-map');
    if (!mapSvg) {
      console.warn('[Rivers] SVG map not found');
      return;
    }

    // Create river group (will be appended to SVG)
    riverGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    riverGroup.setAttribute('id', 'riverLayer');
    riverGroup.setAttribute('class', 'river-layer');

    // Create SVG paths for each river
    Object.entries(RIVER_PATHS).forEach(([riverId, riverData]) => {
      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.setAttribute('id', `river-${riverId}`);
      pathEl.setAttribute('class', 'river-path');
      pathEl.setAttribute('d', riverData.path);
      pathEl.setAttribute('data-river-id', riverId);
      pathEl.setAttribute('data-river-name', riverData.name);
      pathEl.setAttribute('stroke', riverData.color);
      pathEl.setAttribute('stroke-width', '3');
      pathEl.setAttribute('fill', 'none');
      pathEl.setAttribute('stroke-linecap', 'round');
      pathEl.setAttribute('stroke-linejoin', 'round');
      pathEl.setAttribute('opacity', '0.6');
      pathEl.setAttribute('filter', 'url(#riverGlow)');
      pathEl.setAttribute('style', 'display:none;');

      // Add hover interactions
      pathEl.addEventListener('mouseenter', () => handleRiverHover(riverId, pathEl));
      pathEl.addEventListener('mouseleave', () => handleRiverLeave());
      pathEl.addEventListener('click', () => handleRiverClick(riverId));

      riverGroup.appendChild(pathEl);
    });

    // Add SVG filter for glow effect
    addGlowFilter(mapSvg);

    // Append river group to map SVG
    mapSvg.appendChild(riverGroup);

    console.log('[Rivers] Overlay layer initialized');
  }

  // ── Add Glow Filter to SVG ──
  function addGlowFilter(svgElement) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'riverGlow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');

    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '2');
    feGaussianBlur.setAttribute('result', 'coloredBlur');

    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');

    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);

    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);
    defs.appendChild(filter);

    // Check if defs already exists
    let defsElement = svgElement.querySelector('defs');
    if (!defsElement) {
      svgElement.insertBefore(defs, svgElement.firstChild);
    } else {
      defsElement.appendChild(filter);
    }
  }

  // ── Handle River Hover ──
  function handleRiverHover(riverId, pathEl) {
    if (!riversVisible) return;

    currentHoveredRiver = riverId;

    // Highlight this river
    pathEl.setAttribute('stroke-width', '5');
    pathEl.setAttribute('opacity', '1');
    pathEl.classList.add('river-active');

    // Fade other rivers
    document.querySelectorAll('.river-path').forEach(p => {
      if (p.getAttribute('data-river-id') !== riverId) {
        p.setAttribute('opacity', '0.3');
      }
    });

    // Show in side panel
    showRiverPanel(riverId);
  }

  // ── Handle River Leave ──
  function handleRiverLeave() {
    currentHoveredRiver = null;

    // Reset all rivers to normal opacity
    document.querySelectorAll('.river-path').forEach(p => {
      p.setAttribute('stroke-width', '3');
      p.setAttribute('opacity', '0.6');
      p.classList.remove('river-active');
    });
  }

  // ── Handle River Click ──
  function handleRiverClick(riverId) {
    if (!riversVisible) return;

    const event = new CustomEvent('riverSelected', {
      detail: {
        type: 'river',
        id: riverId,
        name: RIVER_PATHS[riverId].name,
        ...RIVER_PATHS[riverId]
      }
    });
    document.dispatchEvent(event);
  }

  // ── Show River Info in Side Panel ──
  function showRiverPanel(riverId) {
    // Get river data from global riversData
    let riverInfo = null;

    if (window.riversData && Array.isArray(window.riversData)) {
      riverInfo = window.riversData.find(r => r.id === riverId);
    }

    if (!riverInfo) {
      // Fallback: check gloabal states Rivers
      if (window.riversData && window.riversData.rivers) {
        riverInfo = window.riversData.rivers.find(r => r.id === riverId);
      }
    }

    const title = document.getElementById('spTitle');
    const sub = document.getElementById('spSub');
    const desc = document.getElementById('spDesc');
    const facts = document.getElementById('spFacts');
    const placeholder = document.getElementById('spPlaceholder');
    const content = document.getElementById('spContent');

    if (!title) return;

    if (placeholder) placeholder.classList.add('hidden');
    if (content) content.classList.remove('hidden');

    const riverData = RIVER_PATHS[riverId];
    title.textContent = riverData.name;

    if (sub && riverInfo) {
      sub.textContent = `Length: ${riverInfo.length || 'Unknown'} | Type: ${riverInfo.type || 'River'}`;
    }

    if (desc && riverInfo) {
      desc.textContent = riverInfo.description || 'A major river of India.';
    }

    if (facts && riverInfo && riverInfo.facts) {
      facts.innerHTML = `
        <div class="sp-section">
          <h4><i class="fas fa-lightbulb"></i> Key Facts</h4>
          <ul class="facts-list">
            ${riverInfo.facts.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>`;
    }

    // Add origin info if available
    const statsDiv = document.getElementById('spStats');
    if (statsDiv && riverInfo) {
      statsDiv.innerHTML = `
        <div class="river-stats">
          <p><strong>Origin:</strong> ${riverInfo.origin || 'Unknown'}</p>
          <p><strong>Type:</strong> ${riverInfo.type || 'Peninsular'}</p>
          ${riverInfo.states ? `<p><strong>States:</strong> ${riverInfo.states.join(', ')}</p>` : ''}
        </div>`;
    }
  }

  // ── Toggle Rivers Visibility ──
  function setRiversVisible(visible) {
    riversVisible = visible;

    const paths = document.querySelectorAll('.river-path');
    paths.forEach(path => {
      path.style.display = visible ? 'block' : 'none';
    });

    console.log(`[Rivers] ${visible ? 'Shown' : 'Hidden'}`);
  }

  // ── Toggle River Overlay ──
  function toggleRivers() {
    setRiversVisible(!riversVisible);
  }

  // ── Listen to Category Changes ──
  function setupCategoryListener() {
    document.addEventListener('categoryChanged', (e) => {
      const category = e.detail;
      setRiversVisible(category === 'rivers');
    });
  }

  // ── Public API ──
  function setup() {
    init();
    setupCategoryListener();
  }

  // ── Initialize on DOM Ready ──
  document.addEventListener('DOMContentLoaded', setup);

  // ── Expose API ──
  window.RiversOverlay = {
    toggleRivers,
    setVisible: setRiversVisible,
    getRiverPaths: () => RIVER_PATHS
  };

})();

