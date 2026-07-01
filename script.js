import { Timeline } from './components/timeline.js';
import { Tags }     from './components/tags.js';
import { SidePanel } from './components/sidepanel.js';
import { MapComponent } from './components/map.js';
import { Navbar }   from './components/navbar.js';

// ── State ──
let statesData = {};
let riversData = [];
let fortsData  = [];
let currentCategory = 'states';

// ── Load all data ──
async function loadData() {
  const [s, r, f] = await Promise.all([
    fetch('./data/states.json').then(r => r.json()),
    fetch('./data/rivers.json').then(r => r.json()),
    fetch('./data/forts.json').then(r => r.json()),
  ]);
  s.states.forEach(st => { statesData[st.id] = st; });
  riversData = r.rivers;
  fortsData  = f.forts;
}

// ── Load SVG paths from map.svg ──
async function loadMap() {
  const res  = await fetch('./map.svg');
  const text = await res.text();
  const parser = new DOMParser();
  const doc  = parser.parseFromString(text, 'image/svg+xml');
  const paths = doc.querySelectorAll('path.state');
  const seen  = new Set();
  const g = document.getElementById('mapRegions');
  paths.forEach(p => {
    if (!p.id || seen.has(p.id) || !p.getAttribute('d') || p.getAttribute('d') === '...') return;
    seen.add(p.id);
    const clone = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    clone.setAttribute('id', p.id);
    clone.setAttribute('class', 'state');
    clone.setAttribute('d', p.getAttribute('d'));
    g.appendChild(clone);
  });
}

// ── Side Panel ──
const sidePanel = new SidePanel(document.getElementById('sidePanel'));

// ── Tags ──
const tags = new Tags(document.getElementById('tagsRow'), (tag) => {
  currentCategory = tag;
  mapComp.setCategory(tag);
});

// ── Timeline ──
const timeline = new Timeline(document.getElementById('timelinePanel'), (year, milestone) => {
  document.getElementById('tlYear').textContent = year;
  mapComp.setYear(year);
  if (milestone) sidePanel.showMilestone(milestone);
});

// ── Map ──
const mapComp = new MapComponent(document.getElementById('mapArea'), (data, category) => {
  sidePanel.show(data, category);
});

// ── Navbar ──
const navbar = new Navbar(document.getElementById('navbar'), {
  onSearch: (q) => {
    if (!q) { navbar.showSearchResults([]); return; }
    const results = buildSearchResults(q);
    navbar.showSearchResults(results);
  },
  onThemeToggle: (isDark) => {
    document.body.classList.toggle('dark', isDark);
    document.body.classList.toggle('light', !isDark);
  },
  onSearchSubmit: (idOrQuery, type) => {
    if (type === 'states' || statesData[idOrQuery]) {
      mapComp.highlightState(idOrQuery);
      sidePanel.show(statesData[idOrQuery], 'states');
      tags.setActive('states');
    }
  }
});

function buildSearchResults(q) {
  const lq = q.toLowerCase();
  const results = [];
  Object.values(statesData).forEach(s => {
    if (s.name.toLowerCase().includes(lq))
      results.push({ id: s.id, name: s.name, type: 'State', icon: 'fa-map' });
  });
  riversData.forEach(r => {
    if (r.name.toLowerCase().includes(lq))
      results.push({ id: r.id, name: r.name, type: 'River', icon: 'fa-water' });
  });
  fortsData.forEach(f => {
    if (f.name.toLowerCase().includes(lq))
      results.push({ id: f.id, name: f.name, type: 'Fort', icon: 'fa-chess-rook' });
  });
  return results.slice(0, 8);
}

// ── Init ──
async function init() {
  await Promise.all([loadData(), loadMap()]);

  // Render tags and timeline
  tags.render();
  await timeline.init();

  // Attach state hover/click handlers
  mapComp.attachStateHandlers(
    (data) => sidePanel.show(data, currentCategory),
    ()     => {}
  );

  // Close side panel
  document.getElementById('spClose').addEventListener('click', () => sidePanel.reset());
}

init();
