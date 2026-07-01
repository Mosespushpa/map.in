// components/map.js
export class MapComponent {
  constructor(container, onSelect) {
    this.container = container;
    this.onSelect = onSelect;
    this.currentCategory = 'states';
    this.currentYear = 2024;
    this.statesData = {};
    this.riversData = [];
    this.fortsData = [];
    this.ghatsData = [];
    this.selectedId = null;
  }

  async loadData() {
    const [statesRes, riversRes, fortsRes, ghatsRes] = await Promise.all([
      fetch('./data/states.json'),
      fetch('./data/rivers.json'),
      fetch('./data/forts.json'),
      fetch('./data/ghats.json')
    ]);
    const [statesJson, riversJson, fortsJson, ghatsJson] = await Promise.all([
      statesRes.json(), riversRes.json(), fortsRes.json(), ghatsRes.json()
    ]);
    statesJson.states.forEach(s => { this.statesData[s.id] = s; });
    this.riversData = riversJson.rivers;
    this.fortsData = fortsJson.forts;
    this.ghatsData = ghatsJson.ghats;
  }

  setCategory(category) {
    this.currentCategory = category;
    this.selectedId = null;
    this.applyOverlays();
  }

  setYear(year) {
    this.currentYear = year;
    this.applyYearFilter();
  }

  applyYearFilter() {
    const svgEl = this.container.querySelector('#india-map');
    if (!svgEl) return;
    svgEl.querySelectorAll('.state').forEach(path => {
      const id = path.id;
      const data = this.statesData[id];
      if (data && data.formed > this.currentYear) {
        path.style.opacity = '0.25';
        path.style.filter = 'grayscale(1)';
      } else {
        path.style.opacity = '1';
        path.style.filter = 'none';
      }
    });
  }

  applyOverlays() {
    // Remove existing overlays
    const svgEl = this.container.querySelector('#india-map');
    if (!svgEl) return;
    svgEl.querySelectorAll('.overlay-marker, .overlay-river-line').forEach(el => el.remove());

    const g = svgEl.querySelector('.regions');

    if (this.currentCategory === 'forts') {
      this.fortsData.forEach(fort => {
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        // Approximate SVG coords from lat/lng (rough mapping for India SVG viewBox 0 0 432 488)
        const [svgX, svgY] = this._latLngToSVG(fort.coordinates[0], fort.coordinates[1]);
        marker.setAttribute('cx', svgX);
        marker.setAttribute('cy', svgY);
        marker.setAttribute('r', '5');
        marker.setAttribute('class', 'overlay-marker fort-marker');
        marker.setAttribute('data-id', fort.id);
        marker.setAttribute('data-name', fort.name);
        marker.style.cursor = 'pointer';
        g.appendChild(marker);

        marker.addEventListener('mouseenter', () => this._showTooltip(fort.name, svgX, svgY));
        marker.addEventListener('mouseleave', () => this._hideTooltip());
        marker.addEventListener('click', () => {
          this.selectedId = fort.id;
          this.onSelect(fort, 'forts');
        });
      });
    }

    if (this.currentCategory === 'rivers') {
      this.riversData.forEach(river => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const [svgX, svgY] = this._latLngToSVG(
          (river.coordinates.start[0] + river.coordinates.end[0]) / 2,
          (river.coordinates.start[1] + river.coordinates.end[1]) / 2
        );
        text.setAttribute('x', svgX);
        text.setAttribute('y', svgY);
        text.setAttribute('class', 'overlay-marker river-label');
        text.setAttribute('data-id', river.id);
        text.textContent = river.name.split(' ')[0];
        text.style.cursor = 'pointer';
        g.appendChild(text);

        text.addEventListener('click', () => {
          this.selectedId = river.id;
          this.onSelect(river, 'rivers');
        });
      });
    }
  }

  _latLngToSVG(lat, lng) {
    // India bounding box approx: lat 8-37, lng 68-97 → SVG 0-432, 0-488
    const x = ((lng - 68) / (97 - 68)) * 432;
    const y = ((37 - lat) / (37 - 8)) * 488;
    return [x, y];
  }

  _showTooltip(name, x, y) {
    const svgEl = this.container.querySelector('#india-map');
    let tip = svgEl.querySelector('#map-tooltip');
    if (!tip) {
      tip = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tip.setAttribute('id', 'map-tooltip');
      tip.setAttribute('class', 'map-tooltip');
      svgEl.querySelector('.regions').appendChild(tip);
    }
    tip.setAttribute('x', x + 8);
    tip.setAttribute('y', y - 4);
    tip.textContent = name;
  }

  _hideTooltip() {
    const tip = this.container.querySelector('#map-tooltip');
    if (tip) tip.remove();
  }

  attachStateHandlers(onEnter, onLeave) {
    const svgEl = document.getElementById('india-map');
    if (!svgEl) return;
    svgEl.querySelectorAll('.state').forEach(path => {
      path.addEventListener('mouseenter', () => {
        const data = this.statesData[path.id];
        if (data) onEnter(data, path);
      });
      path.addEventListener('mouseleave', onLeave);
      path.addEventListener('click', () => {
        const data = this.statesData[path.id];
        if (data) {
          this.selectedId = path.id;
          this.onSelect(data, this.currentCategory === 'uts' ? 'uts' : 'states');
        }
      });
    });
  }

  highlightState(id) {
    const svgEl = this.container.querySelector('#india-map');
    if (!svgEl) return;
    svgEl.querySelectorAll('.state').forEach(p => p.classList.remove('highlighted'));
    const el = svgEl.querySelector(`#${id}`);
    if (el) {
      el.classList.add('highlighted');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  clearHighlight() {
    const svgEl = this.container.querySelector('#india-map');
    if (!svgEl) return;
    svgEl.querySelectorAll('.state').forEach(p => p.classList.remove('highlighted'));
  }
}
