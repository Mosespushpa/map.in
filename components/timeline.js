// components/timeline.js
export class Timeline {
  constructor(container, onYearChange) {
    this.container = container;
    this.onYearChange = onYearChange;
    this.milestones = [];
    this.currentYear = 2024;
    this.minYear = 1947;
    this.maxYear = 2024;
    this.isDragging = false;
  }

  async init() {
    const res = await fetch('./data/timeline.json');
    const data = await res.json();
    this.milestones = data.milestones;
    this.render();
    this.attachEvents();
  }

  getYearPercent(year) {
    return ((year - this.minYear) / (this.maxYear - this.minYear)) * 100;
  }

  getYearFromPercent(pct) {
    return Math.round(this.minYear + (pct / 100) * (this.maxYear - this.minYear));
  }

  render() {
    this.container.innerHTML = `
      <div class="timeline-header">
        <span class="timeline-title">Timeline</span>
        <span class="timeline-year-display" id="timelineYearDisplay">${this.currentYear}</span>
      </div>
      <div class="timeline-track-wrap">
        <div class="timeline-track" id="timelineTrack">
          <div class="timeline-fill" id="timelineFill"></div>
          <div class="timeline-handle" id="timelineHandle" tabindex="0" role="slider"
            aria-valuemin="${this.minYear}" aria-valuemax="${this.maxYear}" aria-valuenow="${this.currentYear}">
            <span class="handle-year">${this.currentYear}</span>
          </div>
          ${this.milestones.map(m => `
            <div class="timeline-milestone" style="top:${this.getYearPercent(m.year)}%"
              data-year="${m.year}" title="${m.year}: ${m.label}">
              <div class="milestone-dot"></div>
              <div class="milestone-label">
                <span class="milestone-year">${m.year}</span>
                <span class="milestone-name">${m.label}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    this.updateHandlePosition();
  }

  updateHandlePosition() {
    const pct = this.getYearPercent(this.currentYear);
    const handle = document.getElementById('timelineHandle');
    const fill = document.getElementById('timelineFill');
    const display = document.getElementById('timelineYearDisplay');
    if (!handle) return;
    handle.style.top = `${pct}%`;
    handle.querySelector('.handle-year').textContent = this.currentYear;
    handle.setAttribute('aria-valuenow', this.currentYear);
    if (fill) fill.style.height = `${pct}%`;
    if (display) display.textContent = this.currentYear;

    // Highlight active milestone
    document.querySelectorAll('.timeline-milestone').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.year) === this.getNearestMilestoneYear());
    });
  }

  getNearestMilestoneYear() {
    return this.milestones.reduce((prev, curr) =>
      Math.abs(curr.year - this.currentYear) < Math.abs(prev.year - this.currentYear) ? curr : prev
    ).year;
  }

  setYear(year) {
    this.currentYear = Math.max(this.minYear, Math.min(this.maxYear, year));
    this.updateHandlePosition();
    this.onYearChange(this.currentYear, this.getMilestoneForYear());
  }

  getMilestoneForYear() {
    // Return the most recent milestone at or before current year
    const applicable = this.milestones.filter(m => m.year <= this.currentYear);
    return applicable.length ? applicable[applicable.length - 1] : this.milestones[0];
  }

  attachEvents() {
    const track = document.getElementById('timelineTrack');
    const handle = document.getElementById('timelineHandle');
    if (!track || !handle) return;

    const getYearFromEvent = (e) => {
      const rect = track.getBoundingClientRect();
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const pct = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
      return this.getYearFromPercent(pct);
    };

    handle.addEventListener('mousedown', (e) => { this.isDragging = true; e.preventDefault(); });
    handle.addEventListener('touchstart', (e) => { this.isDragging = true; }, { passive: true });

    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      this.setYear(getYearFromEvent(e));
    });
    document.addEventListener('touchmove', (e) => {
      if (!this.isDragging) return;
      this.setYear(getYearFromEvent(e));
    }, { passive: true });

    document.addEventListener('mouseup', () => { this.isDragging = false; });
    document.addEventListener('touchend', () => { this.isDragging = false; });

    // Click on track to jump
    track.addEventListener('click', (e) => {
      if (e.target === handle || handle.contains(e.target)) return;
      this.setYear(getYearFromEvent(e));
    });

    // Milestone click
    document.querySelectorAll('.timeline-milestone').forEach(el => {
      el.addEventListener('click', () => this.setYear(parseInt(el.dataset.year)));
    });

    // Keyboard
    handle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') this.setYear(this.currentYear - 1);
      if (e.key === 'ArrowDown') this.setYear(this.currentYear + 1);
      if (e.key === 'PageUp') this.setYear(this.currentYear - 10);
      if (e.key === 'PageDown') this.setYear(this.currentYear + 10);
    });
  }
}
