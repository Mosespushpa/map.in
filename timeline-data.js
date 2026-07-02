// timeline-data.js
// Timeline-driven data engine.
// Emits CustomEvent('timelineDataLoaded', { detail: { year, data } })
// Architecture supports future GeoJSON overlays via geoLayers registry.

(function () {

  // ── Year-keyed data store ──
  const TIMELINE_DATA = {
    1947: {
      label: 'Independence',
      description: 'India gains independence on August 15, 1947. British India is partitioned into India and Pakistan. Hundreds of princely states begin accession to the Indian Union.',
      states: [
        'Assam', 'West_Bengal', 'Punjab', 'Bihar', 'Uttar_Pradesh',
        'Madhya_Pradesh', 'Rajasthan', 'Gujarat', 'Maharashtra',
        'Karnataka', 'Tamil_Nadu', 'Kerala', 'Odisha'
      ],
      activeStates: [
        'Assam', 'West_Bengal', 'Punjab', 'Bihar',
        'Uttar_Pradesh', 'Odisha'
      ],
      events: [
        { year: 1947, event: 'Independence from British rule — Aug 15' },
        { year: 1947, event: 'Partition — Pakistan created' },
        { year: 1947, event: 'Jawaharlal Nehru becomes first Prime Minister' }
      ],
      facts: [
        'British India partitioned into India and Pakistan',
        'Over 500 princely states to be integrated',
        'Sardar Patel leads integration of princely states',
        'Lord Mountbatten — last Viceroy of India'
      ],
      // GeoJSON hook — populate when boundary files are available
      geoLayer: null
    },

    1950: {
      label: 'Republic of India',
      description: 'India becomes a sovereign democratic republic on January 26, 1950. The Constitution of India comes into effect, replacing the Government of India Act 1935.',
      states: [
        'Assam', 'West_Bengal', 'Punjab', 'Bihar', 'Uttar_Pradesh',
        'Madhya_Pradesh', 'Rajasthan', 'Gujarat', 'Maharashtra',
        'Karnataka', 'Tamil_Nadu', 'Kerala', 'Odisha'
      ],
      activeStates: [
        'Uttar_Pradesh', 'Bihar', 'West_Bengal', 'Tamil_Nadu', 'Maharashtra'
      ],
      events: [
        { year: 1950, event: 'Constitution of India adopted — Jan 26' },
        { year: 1950, event: 'Dr. Rajendra Prasad becomes first President' },
        { year: 1950, event: 'Integration of princely states completed' }
      ],
      facts: [
        'Longest written constitution in the world',
        'Fundamental Rights guaranteed to all citizens',
        'Dr. B.R. Ambedkar — chief architect of the Constitution',
        'India declared a sovereign democratic republic'
      ],
      geoLayer: null
    },

    1956: {
      label: 'States Reorganisation',
      description: 'The States Reorganisation Act of 1956 redraws state boundaries along linguistic lines. 14 states and 6 union territories are created, replacing the earlier Part A, B, C, D classification.',
      states: [
        'Andhra_Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Karnataka',
        'Kerala', 'Madhya_Pradesh', 'Maharashtra', 'Odisha', 'Punjab',
        'Rajasthan', 'Tamil_Nadu', 'Uttar_Pradesh', 'West_Bengal'
      ],
      activeStates: [
        'Andhra_Pradesh', 'Karnataka', 'Kerala', 'Maharashtra', 'Gujarat'
      ],
      events: [
        { year: 1956, event: 'States Reorganisation Act passed' },
        { year: 1956, event: '14 states and 6 UTs formed on linguistic basis' },
        { year: 1956, event: 'Andhra Pradesh, Karnataka, Kerala formed' }
      ],
      facts: [
        'First major reorganisation of Indian states',
        'Linguistic basis used for drawing boundaries',
        'Hyderabad State dissolved and divided',
        'Mysore State expanded to form Karnataka'
      ],
      geoLayer: null
    },

    1960: {
      label: 'Bombay State Split',
      description: 'Bombay State is bifurcated on May 1, 1960 into Maharashtra (Marathi-speaking) and Gujarat (Gujarati-speaking) following the Mahagujarat and Samyukta Maharashtra movements.',
      states: [
        'Andhra_Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Karnataka',
        'Kerala', 'Madhya_Pradesh', 'Maharashtra', 'Odisha', 'Punjab',
        'Rajasthan', 'Tamil_Nadu', 'Uttar_Pradesh', 'West_Bengal'
      ],
      activeStates: ['Maharashtra', 'Gujarat'],
      events: [
        { year: 1960, event: 'Maharashtra formed — May 1' },
        { year: 1960, event: 'Gujarat formed — May 1' },
        { year: 1960, event: 'Bombay becomes capital of Maharashtra' }
      ],
      facts: [
        'Mahagujarat Movement demanded separate Gujarat state',
        'Samyukta Maharashtra Movement demanded Marathi state',
        'Mumbai (then Bombay) retained by Maharashtra',
        'Gandhinagar later became capital of Gujarat'
      ],
      geoLayer: null
    },

    1971: {
      label: 'Bangladesh Liberation War',
      description: 'India defeats Pakistan in the 1971 war, leading to the creation of Bangladesh. Several northeastern states gain full statehood — Himachal Pradesh, Manipur, Meghalaya, and Tripura.',
      states: [
        'Andhra_Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Himachal_Pradesh',
        'Karnataka', 'Kerala', 'Madhya_Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil_Nadu',
        'Tripura', 'Uttar_Pradesh', 'West_Bengal'
      ],
      activeStates: ['Himachal_Pradesh', 'Manipur', 'Meghalaya', 'Tripura'],
      events: [
        { year: 1971, event: 'Bangladesh Liberation War — Dec 16' },
        { year: 1971, event: 'Himachal Pradesh becomes full state' },
        { year: 1972, event: 'Manipur, Meghalaya, Tripura become states' }
      ],
      facts: [
        'India-Pakistan war lasted 13 days',
        'Bangladesh created as independent nation',
        'Indira Gandhi leads India during the war',
        'Shimla Agreement signed in 1972'
      ],
      geoLayer: null
    },

    2000: {
      label: 'Three New States',
      description: 'Three new states are carved out on November 1 and 9, 2000 — Chhattisgarh from Madhya Pradesh, Uttarakhand from Uttar Pradesh, and Jharkhand from Bihar.',
      states: [
        'Andhra_Pradesh', 'Arunachal_Pradesh', 'Assam', 'Bihar',
        'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal_Pradesh',
        'Jharkhand', 'Karnataka', 'Kerala', 'Madhya_Pradesh', 'Maharashtra',
        'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil_Nadu', 'Tripura', 'Uttar_Pradesh',
        'Uttarakhand', 'West_Bengal'
      ],
      activeStates: ['Chhattisgarh', 'Uttarakhand', 'Jharkhand'],
      events: [
        { year: 2000, event: 'Chhattisgarh carved out of Madhya Pradesh — Nov 1' },
        { year: 2000, event: 'Uttarakhand carved out of Uttar Pradesh — Nov 9' },
        { year: 2000, event: 'Jharkhand carved out of Bihar — Nov 15' }
      ],
      facts: [
        'India now has 28 states after reorganisation',
        'Chhattisgarh — rich in minerals and forests',
        'Uttarakhand — Devbhoomi, Land of Gods',
        'Jharkhand — Mineral Bowl of India'
      ],
      geoLayer: null
    },

    2014: {
      label: 'Telangana — 29th State',
      description: 'Telangana is carved out of Andhra Pradesh on June 2, 2014, becoming India\'s 29th state. Hyderabad serves as the joint capital for both states for a period of 10 years.',
      states: [
        'Andhra_Pradesh', 'Arunachal_Pradesh', 'Assam', 'Bihar',
        'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal_Pradesh',
        'Jharkhand', 'Karnataka', 'Kerala', 'Madhya_Pradesh', 'Maharashtra',
        'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil_Nadu', 'Telangana', 'Tripura',
        'Uttar_Pradesh', 'Uttarakhand', 'West_Bengal'
      ],
      activeStates: ['Telangana', 'Andhra_Pradesh'],
      events: [
        { year: 2014, event: 'Telangana becomes 29th state — June 2' },
        { year: 2014, event: 'Hyderabad — joint capital for 10 years' },
        { year: 2014, event: 'Andhra Pradesh reorganised' }
      ],
      facts: [
        'Telangana Movement lasted over 50 years',
        'K. Chandrashekar Rao — first Chief Minister',
        'Hyderabad remains joint capital until 2024',
        'Amaravati planned as new AP capital'
      ],
      geoLayer: null
    },

    2025: {
      label: 'Present Day',
      description: 'India today comprises 28 states and 8 Union Territories with a population of over 1.4 billion, making it the most populous country in the world.',
      states: [
        'Andhra_Pradesh', 'Arunachal_Pradesh', 'Assam', 'Bihar',
        'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal_Pradesh',
        'Jharkhand', 'Karnataka', 'Kerala', 'Madhya_Pradesh', 'Maharashtra',
        'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil_Nadu', 'Telangana', 'Tripura',
        'Uttar_Pradesh', 'Uttarakhand', 'West_Bengal'
      ],
      activeStates: [],
      events: [
        { year: 2019, event: 'J&K reorganised into two Union Territories' },
        { year: 2024, event: 'Hyderabad ceases to be joint capital' },
        { year: 2025, event: 'India — most populous country, 1.4 Billion' }
      ],
      facts: [
        '28 States and 8 Union Territories',
        'Most populous country in the world — 1.4 Billion',
        'Fifth largest economy globally',
        'Largest democracy in the world'
      ],
      geoLayer: null
    }
  };

  // ── GeoJSON layer registry (future use) ──
  // Register a GeoJSON source for a year:
  //   TimelineEngine.registerGeoLayer(1947, './data/geo/1947-boundaries.geojson')
  const _geoRegistry = {};

  // ── Core API ──

  function loadYear(year) {
    const key = String(year);
    const data = TIMELINE_DATA[key];
    if (!data) {
      console.warn(`[TimelineEngine] No data for year: ${year}`);
      return null;
    }
    return { year: parseInt(key), ...data };
  }

  function updateMap(year) {
    const data = loadYear(year);
    if (!data) return;

    // Dim states not yet formed
    document.querySelectorAll('.state').forEach(path => {
      const formed = _getFormedYear(path.id);
      const isFormed = formed <= year;
      path.style.opacity    = isFormed ? '1' : '0.2';
      path.style.filter     = isFormed ? 'none' : 'grayscale(1)';
      path.style.transition = 'opacity 0.4s, filter 0.4s';
    });

    // Highlight activeStates for this year
    document.querySelectorAll('.state').forEach(p => p.classList.remove('year-active'));
    (data.activeStates || []).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('year-active');
    });

    // Load GeoJSON layer if registered
    const geoSrc = _geoRegistry[String(year)];
    if (geoSrc) _loadGeoLayer(geoSrc, year);

    document.dispatchEvent(new CustomEvent('timelineDataLoaded', { detail: { year, data } }));
  }

  function updateInfoPanel(year) {
    const data = loadYear(year);
    if (!data) return;

    // Reuse existing side panel elements if present
    const title = document.getElementById('spTitle');
    const sub   = document.getElementById('spSub');
    const desc  = document.getElementById('spDesc');
    const facts = document.getElementById('spFacts');
    const events = document.getElementById('spEvents');
    const placeholder = document.getElementById('spPlaceholder');
    const content     = document.getElementById('spContent');

    if (!title) return;

    if (placeholder) placeholder.classList.add('hidden');
    if (content)     content.classList.remove('hidden');

    title.textContent = `${data.year} — ${data.label}`;
    if (sub)  sub.textContent  = `${data.states.length} states active`;
    if (desc) desc.textContent = data.description;

    if (facts) {
      facts.innerHTML = data.facts.length ? `
        <div class="sp-section">
          <h4><i class="fas fa-lightbulb"></i> Key Facts</h4>
          <ul class="facts-list">${data.facts.map(f => `<li>${f}</li>`).join('')}</ul>
        </div>` : '';
    }

    if (events) {
      events.innerHTML = data.events.length ? `
        <div class="sp-section">
          <h4><i class="fas fa-history"></i> Events</h4>
          <ul class="events-list">${data.events.map(e =>
            `<li><span class="ev-year">${e.year}</span><span class="ev-text">${e.event}</span></li>`
          ).join('')}</ul>
        </div>` : '';
    }
  }

  // ── GeoJSON support (future) ──

  function registerGeoLayer(year, url) {
    _geoRegistry[String(year)] = url;
  }

  function _loadGeoLayer(url, year) {
    // Placeholder — wire to a GeoJSON renderer when boundary files are ready.
    // Example integration with D3 or custom SVG path renderer:
    //   fetch(url).then(r => r.json()).then(geojson => renderGeoLayer(geojson, year));
    console.info(`[TimelineEngine] GeoJSON layer registered for ${year}: ${url}`);
  }

  // ── Helper: get formed year from existing statesData ──
  function _getFormedYear(stateId) {
    if (typeof statesData !== 'undefined' && statesData[stateId]) {
      return statesData[stateId].formed || 1947;
    }
    return 1947;
  }

  // ── Public API ──
  window.TimelineEngine = { loadYear, updateMap, updateInfoPanel, registerGeoLayer };

  // ── Bridge: listen to yearChanged from timeline.js ──
  document.addEventListener('yearChanged', function (e) {
    const year = e.detail;
    updateMap(year);
    updateInfoPanel(year);
  });

})();
