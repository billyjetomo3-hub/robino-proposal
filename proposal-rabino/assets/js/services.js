/**
 * BARANGAY PORTAL — COMMUNITY SERVICES DIRECTORY CONTROLLER
 * Service listings, requirements modals, fee schedule & online application linkage
 */

(function () {
  'use strict';

  let currentCategory = 'all';

  function renderServicesGrid() {
    const container = document.getElementById('servicesGrid');
    if (!container || !window.BarangayStorage) return;

    let services = window.BarangayStorage.getServices();
    if (currentCategory !== 'all') {
      services = services.filter(s => s.category.toLowerCase().includes(currentCategory.toLowerCase()));
    }

    if (services.length === 0) {
      container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">No services found in this category.</div>`;
      return;
    }

    container.innerHTML = services.map((srv, idx) => `
      <div class="card reveal-on-scroll stagger-${(idx % 3) + 1}" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <span class="badge badge-blue">${window.BarangayStorage.escapeHtml(srv.category)}</span>
            <span style="font-size: 0.82rem; font-weight: 700; color: var(--secondary-green);"><i class="fa-solid fa-coins"></i> ${window.BarangayStorage.escapeHtml(srv.fee)}</span>
          </div>
          <h3 style="font-size: 1.25rem; margin-bottom: 0.6rem; color: var(--text-primary);">${window.BarangayStorage.escapeHtml(srv.name)}</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 1.25rem;">${window.BarangayStorage.escapeHtml(srv.description)}</p>
        </div>

        <div>
          <div style="background: var(--bg-alt); padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.82rem; margin-bottom: 1.25rem;">
            <div style="margin-bottom: 0.35rem; font-weight: 600; color: var(--text-primary);">
              <i class="fa-regular fa-clock" style="color: var(--primary-blue);"></i> Turnaround: <strong>${window.BarangayStorage.escapeHtml(srv.processingTime)}</strong>
            </div>
            <div style="color: var(--text-muted); font-size: 0.78rem;">
              <i class="fa-solid fa-list-check" style="color: var(--secondary-green);"></i> Requirements: ${(srv.requirements || []).length} items needed
            </div>
          </div>

          <div style="display: flex; gap: 0.65rem;">
            <button type="button" class="btn btn-outline btn-sm view-service-btn" data-id="${srv.id}" style="flex: 1;">Requirements</button>
            <a href="documents.html" class="btn btn-primary btn-sm" style="flex: 1;"><i class="fa-solid fa-file-pen"></i> Apply Now</a>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.view-service-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openServiceModal(btn.getAttribute('data-id'));
      });
  function openServiceModal(id) {
    const srv = window.BarangayStorage.getServices().find(s => s.id === id);
    if (!srv) return;

    let modal = document.getElementById('serviceDetailModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'serviceDetailModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-box" style="max-width: 580px;">
          <div class="modal-header">
            <h3 class="modal-title"><i class="fa-solid fa-hand-holding-hand" style="color:var(--secondary-green);"></i> Service Guidelines</h3>
            <button type="button" class="modal-close-btn" id="modalSrvCloseBtn"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <span class="badge badge-blue" id="modalSrvCategory" style="margin-bottom: 0.5rem;"></span>
            <h2 id="modalSrvName" style="font-size: 1.35rem; margin-bottom: 0.75rem;"></h2>
            <p id="modalSrvDesc" style="color: var(--text-secondary); margin-bottom: 1.25rem; font-size: 0.95rem; line-height: 1.6;"></p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: var(--bg-alt); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
              <div>
                <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">Standard Fee</span>
                <div id="modalSrvFee" style="font-weight: 700; color: var(--secondary-green); font-size: 1.05rem;"></div>
              </div>
              <div>
                <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">Processing Time</span>
                <div id="modalSrvTime" style="font-weight: 700; color: var(--primary-blue); font-size: 1.05rem;"></div>
              </div>
            </div>

            <h4 style="font-size: 1rem; margin-bottom: 0.65rem;">Checklist of Requirements:</h4>
            <ul id="modalSrvReqs" style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;"></ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="modalSrvDismissBtn">Close</button>
            <a href="documents.html" class="btn btn-primary"><i class="fa-solid fa-file-pen"></i> Submit Application</a>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeAction = () => {
        modal.classList.remove('open');
        if (window.BarangaySound) window.BarangaySound.play('click');
      };

      modal.querySelector('#modalSrvCloseBtn').addEventListener('click', closeAction);
      modal.querySelector('#modalSrvDismissBtn').addEventListener('click', closeAction);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAction();
      });
    }

    modal.querySelector('#modalSrvCategory').textContent = srv.category;
    modal.querySelector('#modalSrvName').textContent = srv.name;
    modal.querySelector('#modalSrvDesc').textContent = srv.description;
    modal.querySelector('#modalSrvFee').textContent = srv.fee;
    modal.querySelector('#modalSrvTime').textContent = srv.processingTime;

    const reqsUl = modal.querySelector('#modalSrvReqs');
    reqsUl.innerHTML = (srv.requirements || []).map(r => `
      <li style="display: flex; align-items: center; gap: 0.65rem; font-size: 0.9rem; color: var(--text-primary);">
        <i class="fa-solid fa-circle-check" style="color: var(--secondary-green);"></i> ${window.BarangayStorage.escapeHtml(r)}
      </li>
    `).join('');

    modal.classList.add('open');
    if (window.BarangaySound) window.BarangaySound.play('modalOpen');
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderServicesGrid();

    document.querySelectorAll('.srv-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.srv-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-cat') || 'all';
        if (window.BarangaySound) window.BarangaySound.play('click');
        renderServicesGrid();
      });
    });
  });

})();

    });
  }
