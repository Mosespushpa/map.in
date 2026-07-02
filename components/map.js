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
    this.selectedId = null;
  }

  _svg() { return document.getElementById('india-map'); }

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
    const svg = this._svg();
    if (!svg) return;
    svg.querySelectorAll('.state').forEach(path => {
      const data = this.statesData[path.id];
      if (data && data.formed > this.currentYear) {
        path.style.opacity = '0.25';
        path.style.filter  = 'grayscale(1)';
      } else {
        path.style.opacity = '1';
        path.style.filter  = 'none';
      }
    });
  }

  applyOverlays() {
    const svg = this._svg();
    if (!svg) return;
    svg.querySelectorAll('.overlay-marker').forEach(el => el.remove());
    const g = svg.querySelector('.regions');

    if (this.currentCategory === 'forts') {
      this.fortsData.forEach(fort => {
        const [x, y] = this._latLngToSVG(fort.coordinates[0], fort.coordinates[1]);
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        marker.setAttribute('cx', x);
        marker.setAttribute('cy', y);
        marker.setAttribute('r', '5');
        marker.setAttribute('class', 'overlay-marker fort-marker');
        marker.style.cursor = 'pointer';
        g.appendChild(marker);
        marker.addEventListener('click', () => this.onSelect(fort, 'forts'));
      });
    }

    if (this.currentCategory === 'rivers') {
      this.riversData.forEach(river => {
        const [x, y] = this._latLngToSVG(
          (river.coordinates.start[0] + river.coordinates.end[0]) / 2,
          (river.coordinates.start[1] + river.coordinates.end[1]) / 2
        );
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('class', 'overlay-marker river-label');
        text.textContent = river.name.split(' ')[0];
        text.style.cursor = 'pointer';
        g.appendChild(text);
        text.addEventListener('click', () => this.onSelect(river, 'rivers'));
      });
    }
  }

  _latLngToSVG(lat, lng) {
    const x = ((lng - 68) / (97 - 68)) * 432;
    const y = ((37 - lat) / (37 - 8)) * 488;
    return [x, y];
  }

  attachStateHandlers(onEnter, onLeave, statesData = {}) {
    this.statesData = statesData;
    const svg = this._svg();
    if (!svg) return;
    svg.querySelectorAll('.state').forEach(path => {
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
    const svg = this._svg();
    if (!svg) return;
    svg.querySelectorAll('.state').forEach(p => p.classList.remove('highlighted'));
    const el = svg.querySelector(`#${id}`);
    if (el) el.classList.add('highlighted');
  }
}
