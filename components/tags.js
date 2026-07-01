// components/tags.js
export class Tags {
  constructor(container, onTagChange) {
    this.container = container;
    this.onTagChange = onTagChange;
    this.activeTag = 'states';
    this.tags = [
      { id: 'states',   label: 'States',          icon: 'fa-map' },
      { id: 'uts',      label: 'Union Territories',icon: 'fa-flag' },
      { id: 'rivers',   label: 'Rivers',           icon: 'fa-water' },
      { id: 'mountains',label: 'Mountains',        icon: 'fa-mountain' },
      { id: 'ghats',    label: 'Ghats',            icon: 'fa-layer-group' },
      { id: 'forts',    label: 'Forts',            icon: 'fa-chess-rook' },
      { id: 'dynasties',label: 'Dynasties',        icon: 'fa-crown' },
      { id: 'languages',label: 'Languages',        icon: 'fa-language' },
      { id: 'events',   label: 'Historical Events',icon: 'fa-landmark' }
    ];
  }

  render() {
    this.container.innerHTML = `
      <div class="tags-bar">
        ${this.tags.map(t => `
          <button class="tag-btn ${t.id === this.activeTag ? 'active' : ''}" data-tag="${t.id}" title="${t.label}">
            <i class="fas ${t.icon}"></i>
            <span>${t.label}</span>
          </button>
        `).join('')}
      </div>
    `;
    this.attachEvents();
  }

  attachEvents() {
    this.container.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTag = btn.dataset.tag;
        this.container.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.onTagChange(this.activeTag);
      });
    });
  }

  setActive(tagId) {
    this.activeTag = tagId;
    this.container.querySelectorAll('.tag-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tag === tagId);
    });
  }
}
