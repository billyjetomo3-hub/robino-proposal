/**
 * BARANGAY PORTAL — ANNOUNCEMENTS PAGE CONTROLLER
 * Filter by Category, Search, Sort, Modal Full View, Pagination, and Empty State
 */

(function () {
  'use strict';

  let currentCategory = 'all';
  let searchQuery = '';
  let sortOrder = 'newest';
  let currentPage = 1;
  const itemsPerPage = 6;

  function getFilteredAnnouncements() {
    if (!window.BarangayStorage) return [];
    let list = window.BarangayStorage.getAnnouncements().filter(a => a.published !== false);

    if (currentCategory !== 'all') {
      list = list.filter(a => a.category.toLowerCase() === currentCategory.toLowerCase());
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return list;
  }

  function renderAnnouncementsGrid() {
    const container = document.getElementById('announcementsGrid');
    const paginationContainer = document.getElementById('announcementsPagination');
    if (!container) return;

    const list = getFilteredAnnouncements();
    const totalPages = Math.ceil(list.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <i class="fa-solid fa-bullhorn" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 1rem; display: block;"></i>
          <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">No Announcements Found</h3>
          <p style="color: var(--text-secondary); max-width: 420px; margin: 0 auto;">No official announcements match your filter or search keywords. Try selecting another category.</p>
        </div>
      `;
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = list.slice(startIndex, startIndex + itemsPerPage);

    container.innerHTML = paginatedItems.map((ann, idx) => `
      <div class="card reveal-on-scroll stagger-${(idx % 3) + 1}" style="display: flex; flex-direction: column; padding: 0; overflow: hidden;">
        <div style="height: 200px; overflow: hidden; position: relative; background: var(--bg-alt);">
          <img src="${window.BarangayStorage.escapeHtml(ann.imageUrl)}" alt="${window.BarangayStorage.escapeHtml(ann.title)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=700&q=80'">
          <span class="badge badge-blue" style="position: absolute; top: 14px; left: 14px;">${window.BarangayStorage.escapeHtml(ann.category)}</span>
        </div>
        <div style="padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1;">
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
            <i class="fa-regular fa-calendar"></i> ${new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <h3 style="font-size: 1.18rem; margin-bottom: 0.75rem; line-height: 1.4;">${window.BarangayStorage.escapeHtml(ann.title)}</h3>
          <p style="font-size: 0.9rem; margin-bottom: 1.25rem; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${window.BarangayStorage.escapeHtml(ann.description)}</p>
          <button type="button" class="btn btn-primary btn-sm view-ann-btn" data-id="${ann.id}" style="align-self: flex-start;">
            Read Full Notice <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `).join('');

    // Bind full modal triggers
    container.querySelectorAll('.view-ann-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openAnnouncementModal(btn.getAttribute('data-id'));
      });
    });

    renderPagination(paginationContainer, totalPages);
  }

  function renderPagination(container, totalPages) {
    if (!container || totalPages <= 1) {
      if (container) container.innerHTML = '';
      return;
    }

    let buttonsHtml = `
      <button type="button" class="page-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>
    `;

    for (let p = 1; p <= totalPages; p++) {
      buttonsHtml += `
        <button type="button" class="page-btn page-num-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>
      `;
    }

    buttonsHtml += `
      <button type="button" class="page-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>
    `;

    container.innerHTML = buttonsHtml;

    container.querySelector('.prev-btn').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        if (window.BarangaySound) window.BarangaySound.play('click');
        renderAnnouncementsGrid();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    });

    container.querySelector('.next-btn').addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        if (window.BarangaySound) window.BarangaySound.play('click');
        renderAnnouncementsGrid();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    });

    container.querySelectorAll('.page-num-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = parseInt(btn.getAttribute('data-page'), 10);
        if (window.BarangaySound) window.BarangaySound.play('click');
        renderAnnouncementsGrid();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      });
    });
  }

  function openAnnouncementModal(id) {
    const announcements = window.BarangayStorage.getAnnouncements();
    const ann = announcements.find(a => a.id === id);
    if (!ann) return;

    let modal = document.getElementById('announcementDetailModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'announcementDetailModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-box" style="max-width: 660px;">
          <div class="modal-header">
            <span class="badge badge-blue" id="modalAnnCategory">General</span>
            <button type="button" class="modal-close-btn" id="modalAnnCloseBtn"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <div style="height: 240px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1.25rem;">
              <img id="modalAnnImg" src="" alt="Announcement banner" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
              <i class="fa-regular fa-calendar"></i> Published: <span id="modalAnnDate"></span>
            </div>
            <h2 id="modalAnnTitle" style="font-size: 1.45rem; margin-bottom: 1rem; line-height: 1.35;"></h2>
            <div id="modalAnnBody" style="font-size: 1rem; color: var(--text-secondary); line-height: 1.7; white-space: pre-line;"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="modalAnnDoneBtn">Close Notice</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeAction = () => {
        modal.classList.remove('open');
        if (window.BarangaySound) window.BarangaySound.play('click');
      };

      modal.querySelector('#modalAnnCloseBtn').addEventListener('click', closeAction);
      modal.querySelector('#modalAnnDoneBtn').addEventListener('click', closeAction);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAction();
      });
    }

    modal.querySelector('#modalAnnCategory').textContent = ann.category;
    modal.querySelector('#modalAnnImg').src = ann.imageUrl;
    modal.querySelector('#modalAnnDate').textContent = new Date(ann.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    modal.querySelector('#modalAnnTitle').textContent = ann.title;
    modal.querySelector('#modalAnnBody').textContent = ann.description;

    modal.classList.add('open');
    if (window.BarangaySound) window.BarangaySound.play('modalOpen');
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderAnnouncementsGrid();

    // Category pills
    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.getAttribute('data-cat') || 'all';
        currentPage = 1;
        if (window.BarangaySound) window.BarangaySound.play('click');
        renderAnnouncementsGrid();
      });
    });

    // Search input
    const searchInput = document.getElementById('annSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        currentPage = 1;
        renderAnnouncementsGrid();
      });
    }

    // Sort Select
    const sortSelect = document.getElementById('annSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortOrder = e.target.value;
        if (window.BarangaySound) window.BarangaySound.play('click');
        renderAnnouncementsGrid();
      });
    }
  });

})();
