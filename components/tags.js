// components/tags.js
// Standalone tag navigation — emits CustomEvent('categoryChanged', { detail: category })
// Replaces the inline renderTags() in script.js without modifying it.

(function () {
  const TAGS = [
    { id: 'states',    label: 'States',           icon: 'fa-map' },
    { id: 'uts',       label: 'Union Territories', icon: 'fa-flag' },
    { id: 'rivers',    label: 'Rivers',            icon: 'fa-water' },
    { id: 'ghats',     label: 'Ghats',             icon: 'fa-layer-group' },
    { id: 'forts',     label: 'Forts',             icon: 'fa-chess-rook' },
    { id: 'languages', label: 'Languages',         icon: 'fa-language' },
    { id: 'dynasties', label: 'Dynasties',         icon: 'fa-crown' },
    { id: 'events',    label: 'Historical Events', icon: 'fa-landmark' }
  ];

  let active = 'states';

  function emit(category) {
    document.dispatchEvent(new CustomEvent('categoryChanged', { detail: category }));
  }

  function setActive(id) {
    active = id;
    document.querySelectorAll('.tag-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tag === id);
    });
    emit(id);
  }

  function build(container) {
    container.innerHTML = TAGS.map(t => `
      <button class="tag-btn${t.id === active ? ' active' : ''}" data-tag="${t.id}">
        <i class="fas ${t.icon}"></i>
        <span>${t.label}</span>
      </button>`).join('');

    container.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', () => setActive(btn.dataset.tag));
    });
  }

  function init() {
    const container = document.getElementById('tagsRow');
    if (!container) return;
    build(container);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
