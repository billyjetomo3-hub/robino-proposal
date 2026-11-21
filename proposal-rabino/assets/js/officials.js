/**
 * BARANGAY PORTAL — OFFICIALS DIRECTORY CONTROLLER
 * Filter by Position, Search Officials, Profile Modal with Direct Communication
 */

(function () {
  'use strict';

  let currentPositionFilter = 'all';
  let searchQuery = '';

  function getFilteredOfficials() {
    if (!window.BarangayStorage) return [];
    let list = window.BarangayStorage.getOfficials();

    if (currentPositionFilter !== 'all') {
      list = list.filter(o => o.position.toLowerCase().includes(currentPositionFilter.toLowerCase()));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(o => o.name.toLowerCase().includes(q) || o.position.toLowerCase().includes(q));
    }

    return list;
  }

  function renderOfficialsGrid() {
    const container = document.getElementById('officialsGrid');
    if (!container) return;

    const list = getFilteredOfficials();
    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <i class="fa-solid fa-user-slash" style="font-size: 2.2rem; color: var(--text-muted); margin-bottom: 0.85rem; display: block;"></i>
          <h3 style="font-size: 1.2rem; margin-bottom: 0.35rem;">No Officials Found</h3>
          <p style="color: var(--text-secondary);">No barangay leaders match the selected criteria.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map((official, idx) => `
      <div class="card reveal-on-scroll stagger-${(idx % 3) + 1}" style="text-align: center; padding: 2rem 1.5rem;">
        <div style="width: 120px; height: 120px; border-radius: 50%; overflow: hidden; margin: 0 auto 1.25rem auto; border: 4px solid var(--primary-blue-light); box-shadow: var(--shadow-md);">
          <img src="${window.BarangayStorage.escapeHtml(official.imageUrl)}" alt="${window.BarangayStorage.escapeHtml(official.name)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'">
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-primary);">${window.BarangayStorage.escapeHtml(official.name)}</h3>
        <p style="font-size: 0.88rem; font-weight: 600; color: var(--secondary-green); margin-bottom: 1.25rem;">${window.BarangayStorage.escapeHtml(official.position)}</p>
        
        <div style="background: var(--bg-alt); padding: 1rem; border-radius: var(--radius-md); text-align: left; font-size: 0.85rem; margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary);">
            <i class="fa-solid fa-phone" style="color: var(--primary-blue); width: 16px;"></i>
            <a href="tel:${window.BarangayStorage.escapeHtml(official.contactNumber)}" style="color: inherit;">${window.BarangayStorage.escapeHtml(official.contactNumber)}</a>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); word-break: break-all;">
            <i class="fa-solid fa-envelope" style="color: var(--primary-blue); width: 16px;"></i>
            <a href="mailto:${window.BarangayStorage.escapeHtml(official.email)}" style="color: inherit;">${window.BarangayStorage.escapeHtml(official.email)}</a>
          </div>
        </div>

        <button type="button" class="btn btn-outline btn-sm view-official-btn" data-id="${official.id}" style="width: 100%;">
          <i class="fa-solid fa-id-card"></i> View Profile & Contact
        </button>
      </div>
    `).join('');

    container.querySelectorAll('.view-official-btn').forEach(btn => {
  function openOfficialModal(id) {
    const official = window.BarangayStorage.getOfficials().find(o => o.id === id);
    if (!official) return;

    let modal = document.getElementById('officialDetailModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'officialDetailModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-box" style="max-width: 500px; text-align: center;">
          <div class="modal-header">
            <h3 class="modal-title"><i class="fa-solid fa-user-shield" style="color:var(--primary-blue);"></i> Official Profile</h3>
            <button type="button" class="modal-close-btn" id="modalOffCloseBtn"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body" style="padding: 1.75rem;">
            <div style="width: 120px; height: 120px; border-radius: 50%; overflow: hidden; margin: 0 auto 1.25rem auto; border: 4px solid var(--secondary-green); box-shadow: var(--shadow-md);">
              <img id="modalOffImg" src="" alt="Official photo" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <h2 id="modalOffName" style="font-size: 1.35rem; margin-bottom: 0.25rem;"></h2>
            <div id="modalOffPos" style="font-size: 0.9rem; font-weight: 600; color: var(--secondary-green); margin-bottom: 1.25rem;"></div>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; text-align: left; background: var(--bg-alt); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
              <div>
                <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">Hotline</span>
                <div style="font-size: 0.95rem; font-weight: 600;"><a id="modalOffPhone" href="" style="color: var(--primary-blue);"></a></div>
              </div>
              <div>
                <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">Official Email</span>
                <div style="font-size: 0.9rem; font-weight: 600;"><a id="modalOffMail" href="" style="color: var(--primary-blue);"></a></div>
              </div>
            </div>
            <button type="button" class="btn btn-outline" id="modalOffDoneBtn" style="width: 100%;">Close Profile</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeAction = () => {
        modal.classList.remove('open');
        if (window.BarangaySound) window.BarangaySound.play('click');
      };

      modal.querySelector('#modalOffCloseBtn').addEventListener('click', closeAction);
      modal.querySelector('#modalOffDoneBtn').addEventListener('click', closeAction);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAction();
      });
    }

    modal.querySelector('#modalOffImg').src = official.imageUrl;
    modal.querySelector('#modalOffName').textContent = official.name;
    modal.querySelector('#modalOffPos').textContent = official.position;
    const phoneEl = modal.querySelector('#modalOffPhone');
    phoneEl.textContent = official.contactNumber;
    phoneEl.href = `tel:${official.contactNumber}`;
    const mailEl = modal.querySelector('#modalOffMail');
    mailEl.textContent = official.email;
    mailEl.href = `mailto:${official.email}`;

    modal.classList.add('open');
    if (window.BarangaySound) window.BarangaySound.play('modalOpen');
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderOfficialsGrid();

    document.querySelectorAll('.official-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.official-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPositionFilter = btn.getAttribute('data-pos') || 'all';
        if (window.BarangaySound) window.BarangaySound.play('click');
        renderOfficialsGrid();
      });
    });

    const searchInput = document.getElementById('officialSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderOfficialsGrid();
      });
    }
  });

})();

      btn.addEventListener('click', () => {
        openOfficialModal(btn.getAttribute('data-id'));
      });
    });
  }
