// components/timeline.js
// Standalone vertical timeline — emits CustomEvent('yearChanged', { detail: year })
// No fetch, no external dependencies.

(function () {
  const YEARS = [1947, 1950, 1956, 1960, 1971, 1987, 2000, 2014, 2025];

  const LABELS = {
    1947: 'Independence',
    1950: 'Republic',
    1956: 'Reorganisation',
    1960: 'Bombay Split',
    1971: 'Bangladesh War',
    1987: 'New States',
    2000: 'Three States',
    2014: 'Telangana',
    2025: 'Present'
  };

  let activeYear = null;

  function emit(year) {
    document.dispatchEvent(new CustomEvent('yearChanged', { detail: year }));
  }

  function setActive(year) {
    activeYear = year;
    document.querySelectorAll('.tl-item').forEach(el => {
      el.classList.toggle('tl-active', parseInt(el.dataset.year) === year);
    });
    emit(year);
  }

  function build(container) {
    container.innerHTML = '';
    container.className = 'tl-root';

    const line = document.createElement('div');
    line.className = 'tl-line';
    container.appendChild(line);

    YEARS.forEach(year => {
      const item = document.createElement('div');
      item.className = 'tl-item';
      item.dataset.year = year;
      item.innerHTML = `
        <div class="tl-dot"></div>
        <div class="tl-info">
          <span class="tl-year">${year}</span>
          <span class="tl-label">${LABELS[year]}</span>
        </div>`;

      item.addEventListener('click', () => {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setActive(year);
      });

      container.appendChild(item);
    });
  }

  function init() {
    const container = document.getElementById('standaloneTimeline');
    if (!container) return;
    build(container);
    // Activate first year by default
    setActive(YEARS[0]);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
