// components/sidepanel.js
export class SidePanel {
  constructor(container) {
    this.container = container;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="sidepanel-inner">
        <div class="sidepanel-placeholder" id="sidepanelPlaceholder">
          <i class="fas fa-map-marked-alt"></i>
          <p>Hover or click a region on the map to explore its history</p>
        </div>
        <div class="sidepanel-content hidden" id="sidepanelContent">
          <div class="sp-header">
            <div class="sp-icon" id="spIcon"><i class="fas fa-map"></i></div>
            <div class="sp-title-wrap">
              <h2 id="spTitle">—</h2>
              <span class="sp-subtitle" id="spSubtitle"></span>
            </div>
          </div>
          <div class="sp-body">
            <p class="sp-description" id="spDescription"></p>
            <div class="sp-stats" id="spStats"></div>
            <div class="sp-facts" id="spFacts"></div>
            <div class="sp-events" id="spEvents"></div>
          </div>
        </div>
      </div>
    `;
  }

  show(data, category) {
    const placeholder = document.getElementById('sidepanelPlaceholder');
    const content = document.getElementById('sidepanelContent');
    if (!content) return;
    placeholder.classList.add('hidden');
    content.classList.remove('hidden');

    document.getElementById('spTitle').textContent = data.name || data.title || '—';
    document.getElementById('spSubtitle').textContent = this._getSubtitle(data, category);
    document.getElementById('spDescription').textContent = data.description || '';

    this._renderStats(data, category);
    this._renderFacts(data.facts || []);
    this._renderEvents(data.historicalEvents || data.events || []);
  }

  _getSubtitle(data, category) {
    const map = {
      states: data.language ? `${data.language} · Formed ${data.formed}` : '',
      uts: data.capital ? `Capital: ${data.capital}` : '',
      rivers: data.length ? `Length: ${data.length}` : '',
      forts: data.dynasty ? `${data.dynasty} · ${data.built}` : '',
      ghats: data.type || '',
      mountains: data.type || '',
      dynasties: data.period || '',
      languages: data.family || '',
      events: data.year ? `Year: ${data.year}` : ''
    };
    return map[category] || '';
  }

  _renderStats(data, category) {
    const el = document.getElementById('spStats');
    const stats = [];
    if (data.capital)    stats.push({ icon: 'fa-city',       label: 'Capital',    value: data.capital });
    if (data.area)       stats.push({ icon: 'fa-ruler-combined', label: 'Area',   value: data.area });
    if (data.population) stats.push({ icon: 'fa-users',      label: 'Population', value: data.population });
    if (data.length)     stats.push({ icon: 'fa-route',      label: 'Length',     value: data.length });
    if (data.origin)     stats.push({ icon: 'fa-map-pin',    label: 'Origin',     value: data.origin });
    if (data.builtBy)    stats.push({ icon: 'fa-hammer',     label: 'Built By',   value: data.builtBy });
    if (data.built)      stats.push({ icon: 'fa-calendar',   label: 'Built',      value: data.built });
    if (data.highestPeak)stats.push({ icon: 'fa-mountain',   label: 'Highest Peak', value: data.highestPeak });

    el.innerHTML = stats.length ? `
      <div class="stats-grid">
        ${stats.map(s => `
          <div class="stat-item">
            <i class="fas ${s.icon}"></i>
            <div><span class="stat-label">${s.label}</span><span class="stat-value">${s.value}</span></div>
          </div>
        `).join('')}
      </div>` : '';
  }

  _renderFacts(facts) {
    const el = document.getElementById('spFacts');
    el.innerHTML = facts.length ? `
      <div class="sp-section">
        <h4><i class="fas fa-lightbulb"></i> Key Facts</h4>
        <ul class="facts-list">
          ${facts.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>` : '';
  }

  _renderEvents(events) {
    const el = document.getElementById('spEvents');
    if (!events.length) { el.innerHTML = ''; return; }
    const isObj = typeof events[0] === 'object';
    el.innerHTML = `
      <div class="sp-section">
        <h4><i class="fas fa-history"></i> Historical Events</h4>
        <ul class="events-list">
          ${events.map(e => isObj
            ? `<li><span class="ev-year">${e.year}</span><span class="ev-text">${e.event}</span></li>`
            : `<li>${e}</li>`
          ).join('')}
        </ul>
      </div>`;
  }

  reset() {
    const placeholder = document.getElementById('sidepanelPlaceholder');
    const content = document.getElementById('sidepanelContent');
    if (placeholder) placeholder.classList.remove('hidden');
    if (content) content.classList.add('hidden');
  }

  showMilestone(milestone) {
    const placeholder = document.getElementById('sidepanelPlaceholder');
    const content = document.getElementById('sidepanelContent');
    if (!content) return;
    placeholder.classList.add('hidden');
    content.classList.remove('hidden');

    document.getElementById('spTitle').textContent = `${milestone.year} — ${milestone.label}`;
    document.getElementById('spSubtitle').textContent = 'Timeline Milestone';
    document.getElementById('spDescription').textContent = milestone.description || '';
    document.getElementById('spStats').innerHTML = '';
    this._renderFacts([]);
    this._renderEvents(milestone.events || []);
  }
}
