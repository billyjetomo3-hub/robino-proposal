/**
 * BARANGAY PORTAL — EVENTS & COMMUNITY CALENDAR CONTROLLER
 * Filter upcoming vs past events, search events, event details modal
 */

(function () {
  'use strict';

  let currentTab = 'upcoming';
  let searchQuery = '';

  function getFilteredEvents() {
    if (!window.BarangayStorage) return [];
    let list = window.BarangayStorage.getEvents();
    const today = new Date().toISOString().split('T')[0];

    if (currentTab === 'upcoming') {
      list = list.filter(e => e.date >= today);
    } else if (currentTab === 'past') {
      list = list.filter(e => e.date < today);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || (e.venue && e.venue.toLowerCase().includes(q)));
    }

    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return list;
  }

  function renderEventsGrid() {
    const container = document.getElementById('eventsGrid');
    if (!container) return;

    const list = getFilteredEvents();
    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <i class="fa-solid fa-calendar-xmark" style="font-size: 2.2rem; color: var(--text-muted); margin-bottom: 0.85rem; display: block;"></i>
          <h3 style="font-size: 1.2rem; margin-bottom: 0.35rem;">No Events Found</h3>
          <p style="color: var(--text-secondary);">No community activities match the selected filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map((evt, idx) => `
      <div class="card reveal-on-scroll stagger-${(idx % 3) + 1}" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <span class="badge badge-green"><i class="fa-regular fa-calendar"></i> ${window.BarangayStorage.escapeHtml(evt.date)}</span>
            <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);"><i class="fa-regular fa-clock"></i> ${window.BarangayStorage.escapeHtml(evt.time || 'TBA')}</span>
          </div>
          <h3 style="font-size: 1.25rem; margin-bottom: 0.6rem; color: var(--text-primary);">${window.BarangayStorage.escapeHtml(evt.title)}</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 1.25rem;">${window.BarangayStorage.escapeHtml(evt.description)}</p>
        </div>

        <div style="padding-top: 0.85rem; border-top: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
          <div style="font-size: 0.85rem; color: var(--text-secondary);">
            <i class="fa-solid fa-location-dot" style="color: var(--primary-blue);"></i> ${window.BarangayStorage.escapeHtml(evt.venue)}
          </div>
          <button type="button" class="btn btn-outline btn-sm view-event-btn" data-id="${evt.id}">Details</button>
        </div>
      </div>
  function openEventModal(id) {
    const evt = window.BarangayStorage.getEvents().find(e => e.id === id);
    if (!evt) return;

    let modal = document.getElementById('eventDetailModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'eventDetailModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-box" style="max-width: 540px;">
          <div class="modal-header">
            <h3 class="modal-title"><i class="fa-solid fa-calendar-star" style="color:var(--primary-blue);"></i> Event Details</h3>
            <button type="button" class="modal-close-btn" id="modalEvtCloseBtn"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <span class="badge badge-green" id="modalEvtDate" style="margin-bottom: 0.5rem;"></span>
            <h2 id="modalEvtTitle" style="font-size: 1.35rem; margin-bottom: 0.75rem;"></h2>
            <div style="display: flex; gap: 1.5rem; font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
              <div><i class="fa-regular fa-clock" style="color: var(--primary-blue);"></i> <span id="modalEvtTime"></span></div>
              <div><i class="fa-solid fa-location-dot" style="color: var(--primary-blue);"></i> <span id="modalEvtVenue"></span></div>
            </div>
            <p id="modalEvtDesc" style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;"></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="modalEvtDismissBtn">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeAction = () => {
        modal.classList.remove('open');
        if (window.BarangaySound) window.BarangaySound.play('click');
      };

      modal.querySelector('#modalEvtCloseBtn').addEventListener('click', closeAction);
      modal.querySelector('#modalEvtDismissBtn').addEventListener('click', closeAction);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAction();
      });
    }

    modal.querySelector('#modalEvtDate').textContent = evt.date;
    modal.querySelector('#modalEvtTitle').textContent = evt.title;
    modal.querySelector('#modalEvtTime').textContent = evt.time || 'Schedule TBA';
    modal.querySelector('#modalEvtVenue').textContent = evt.venue;
    modal.querySelector('#modalEvtDesc').textContent = evt.description;

    modal.classList.add('open');
    if (window.BarangaySound) window.BarangaySound.play('modalOpen');
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderEventsGrid();

    document.querySelectorAll('.event-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.event-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTab = btn.getAttribute('data-tab') || 'upcoming';
        if (window.BarangaySound) window.BarangaySound.play('click');
        renderEventsGrid();
      });
    });

    const searchInput = document.getElementById('eventSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderEventsGrid();
      });
    }
  });

})();

    `).join('');

    container.querySelectorAll('.view-event-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openEventModal(btn.getAttribute('data-id'));
      });
    });
  }
