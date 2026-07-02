// components/sidepanel.js
export class SidePanel {
  constructor(container) {
    // Works with existing HTML in index.html
  }

  show(data, category) {
    document.getElementById('spPlaceholder').classList.add('hidden');
    document.getElementById('spContent').classList.remove('hidden');
    document.getElementById('spTitle').textContent = data.name || data.title || '—';
    document.getElementById('spSub').textContent = this._subtitle(data, category);
    document.getElementById('spDesc').textContent = data.description || '';
    this._renderStats(data);
    this._renderFacts(data.facts || []);
    this._renderEvents(data.historicalEvents || data.events || []);
  }

  _subtitle(data, category) {
    if (category === 'states' || category === 'uts')
      return data.language ? `${data.language} · Formed ${data.formed}` : '';
    if (category === 'rivers') return data.length ? `Length: ${data.length}` : '';
    if (category === 'forts')  return data.dynasty ? `${data.dynasty} · ${data.built}` : '';
    return data.type || '';
  }

  _renderStats(data) {
    const stats = [];
    if (data.capital)     stats.push({ icon: 'fa-city',            label: 'Capital',      value: data.capital });
    if (data.area)        stats.push({ icon: 'fa-ruler-combined',  label: 'Area',         value: data.area });
    if (data.population)  stats.push({ icon: 'fa-users',           label: 'Population',   value: data.population });
    if (data.length)      stats.push({ icon: 'fa-route',           label: 'Length',       value: data.length });
    if (data.origin)      stats.push({ icon: 'fa-map-pin',         label: 'Origin',       value: data.origin });
    if (data.builtBy)     stats.push({ icon: 'fa-hammer',          label: 'Built By',     value: data.builtBy });
    if (data.built)       stats.push({ icon: 'fa-calendar',        label: 'Built',        value: data.built });
    if (data.highestPeak) stats.push({ icon: 'fa-mountain',        label: 'Highest Peak', value: data.highestPeak });

    document.getElementById('spStats').innerHTML = stats.length ? `
      <div class="stats-grid">
        ${stats.map(s => `
          <div class="stat-item">
            <i class="fas ${s.icon}"></i>
            <div><span class="stat-label">${s.label}</span><span class="stat-value">${s.value}</span></div>
          </div>`).join('')}
      </div>` : '';
  }

  _renderFacts(facts) {
    document.getElementById('spFacts').innerHTML = facts.length ? `
      <div class="sp-section">
        <h4><i class="fas fa-lightbulb"></i> Key Facts</h4>
        <ul class="facts-list">${facts.map(f => `<li>${f}</li>`).join('')}</ul>
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
            : `<li>${e}</li>`).join('')}
        </ul>
      </div>`;
  }

  reset() {
    document.getElementById('spPlaceholder').classList.remove('hidden');
    document.getElementById('spContent').classList.add('hidden');
  }

  showMilestone(milestone) {
    this.show({
      name: `${milestone.year} — ${milestone.label}`,
      description: milestone.description || '',
      events: milestone.events || []
    }, 'events');
  }
}
