// components/navbar.js
export class Navbar {
  constructor(container, { onSearch, onThemeToggle, onSearchSubmit }) {
    this.container = container;
    this.onSearch = onSearch;
    this.onThemeToggle = onThemeToggle;
    this.onSearchSubmit = onSearchSubmit;
    this.isDark = true;
    this.searchOpen = false;
  }

  render() {
    this.container.innerHTML = `
      <div class="navbar-brand">
        <img src="logo.avif" alt="Map.in Logo" class="navbar-logo" onerror="this.style.display='none'">
        <span class="navbar-title">Map.in</span>
        <span class="navbar-tagline">Historical Geography Explorer</span>
      </div>
      <div class="navbar-search-wrap" id="navSearchWrap">
        <div class="search-box hidden" id="searchBox">
          <i class="fas fa-search search-icon"></i>
          <input type="text" id="searchInput" placeholder="Search states, rivers, forts..." autocomplete="off">
          <button class="search-clear" id="searchClear"><i class="fas fa-times"></i></button>
          <div class="search-results hidden" id="searchResults"></div>
        </div>
      </div>
      <div class="navbar-controls">
        <button class="nav-btn" id="searchToggleBtn" aria-label="Search" title="Search">
          <i class="fas fa-search"></i>
        </button>
        <button class="nav-btn active" id="themeToggleBtn" aria-label="Toggle theme" title="Toggle theme">
          <i class="fas fa-moon"></i>
        </button>
      </div>
    `;
    this.attachEvents();
  }

  attachEvents() {
    document.getElementById('searchToggleBtn').addEventListener('click', () => {
      this.searchOpen = !this.searchOpen;
      const box = document.getElementById('searchBox');
      box.classList.toggle('hidden', !this.searchOpen);
      if (this.searchOpen) document.getElementById('searchInput').focus();
    });

    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.onSearch(e.target.value.trim());
    });

    document.getElementById('searchInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.onSearchSubmit(e.target.value.trim());
      if (e.key === 'Escape') {
        this.searchOpen = false;
        document.getElementById('searchBox').classList.add('hidden');
      }
    });

    document.getElementById('searchClear').addEventListener('click', () => {
      document.getElementById('searchInput').value = '';
      this.onSearch('');
      document.getElementById('searchResults').classList.add('hidden');
    });

    document.getElementById('themeToggleBtn').addEventListener('click', () => {
      this.isDark = !this.isDark;
      const icon = document.querySelector('#themeToggleBtn i');
      icon.className = this.isDark ? 'fas fa-moon' : 'fas fa-sun';
      document.getElementById('themeToggleBtn').classList.toggle('active', this.isDark);
      this.onThemeToggle(this.isDark);
    });
  }

  showSearchResults(results) {
    const el = document.getElementById('searchResults');
    if (!results.length) { el.classList.add('hidden'); return; }
    el.classList.remove('hidden');
    el.innerHTML = results.map(r => `
      <div class="search-result-item" data-id="${r.id}" data-type="${r.type}">
        <i class="fas ${r.icon}"></i>
        <span>${r.name}</span>
        <small>${r.type}</small>
      </div>
    `).join('');
    el.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        this.onSearchSubmit(item.dataset.id, item.dataset.type);
        el.classList.add('hidden');
        document.getElementById('searchInput').value = item.querySelector('span').textContent;
      });
    });
  }
}
