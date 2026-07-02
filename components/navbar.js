// components/navbar.js
export class Navbar {
  constructor(container, { onSearch, onThemeToggle, onSearchSubmit }) {
    this.onSearch = onSearch;
    this.onThemeToggle = onThemeToggle;
    this.onSearchSubmit = onSearchSubmit;
    this.isDark = true;
    this.searchOpen = false;
    this._attachEvents();
  }

  _attachEvents() {
    document.getElementById('searchToggleBtn').addEventListener('click', () => {
      this.searchOpen = !this.searchOpen;
      const box = document.getElementById('searchBox');
      box.style.display = this.searchOpen ? 'flex' : 'none';
      if (this.searchOpen) document.getElementById('searchInput').focus();
    });

    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.onSearch(e.target.value.trim());
    });

    document.getElementById('searchInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.onSearchSubmit(e.target.value.trim());
      if (e.key === 'Escape') {
        this.searchOpen = false;
        document.getElementById('searchBox').style.display = 'none';
      }
    });

    document.getElementById('searchClear').addEventListener('click', () => {
      document.getElementById('searchInput').value = '';
      this.onSearch('');
      document.getElementById('searchResults').innerHTML = '';
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
    if (!results.length) { el.innerHTML = ''; return; }
    el.innerHTML = results.map(r => `
      <div class="search-result-item" data-id="${r.id}" data-type="${r.type}">
        <i class="fas ${r.icon}"></i>
        <span>${r.name}</span>
        <small>${r.type}</small>
      </div>
    `).join('');
    el.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        this.onSearchSubmit(item.dataset.id, item.dataset.type.toLowerCase());
        el.innerHTML = '';
        document.getElementById('searchInput').value = item.querySelector('span').textContent;
        document.getElementById('searchBox').style.display = 'none';
        this.searchOpen = false;
      });
    });
  }
}
