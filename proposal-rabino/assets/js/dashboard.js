/**
 * BARANGAY PORTAL — MASTERED ADMIN DASHBOARD CONTROLLER
 * Canvas API Analytics, Tab Switching, and Centralized CRUD Management
 */

(function () {
  'use strict';

  // 1. Auth Guard
  if (window.BarangayAuth) {
    window.BarangayAuth.requireAuth();
  }

  const AdminState = {
    currentTab: 'dashboard',
    charts: { requests: null, feedback: null }
  };

  function initAdminTabs() {
    document.querySelectorAll('.sidebar-link[data-tab]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = link.getAttribute('data-tab');
        switchAdminTab(targetTab);
      });
    });

    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to end your administrative session?')) {
          window.BarangayAuth.logout();
        }
      });
    }
  }

  function switchAdminTab(tabName) {
    AdminState.currentTab = tabName;
    if (window.BarangaySound) window.BarangaySound.play('pageTransition');

    document.querySelectorAll('.sidebar-link[data-tab]').forEach(l => {
      l.classList.toggle('active', l.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.admin-tab-pane').forEach(pane => {
      pane.style.display = pane.id === `tab-${tabName}` ? 'block' : 'none';
    });

    const titleEl = document.getElementById('adminSectionTitle');
    const titles = {
      dashboard: 'Executive Dashboard & Analytics',
      announcements: 'Manage Public Announcements',
      requests: 'Document Request Management',
      officials: 'Barangay Officials Directory',
      feedback: 'Citizen Feedback & Inquiries',
      services: 'Community Services & Programs',
      events: 'Events & Community Calendar',
      settings: 'Barangay & Portal Settings'
    };
    if (titleEl) titleEl.textContent = titles[tabName] || 'Dashboard';

    // Refresh specific tab
    if (tabName === 'dashboard') {
      refreshDashboardStats();
      renderCanvasCharts();
    } else if (tabName === 'announcements') {
      renderAdminAnnouncementsTable();
    } else if (tabName === 'requests') {
      renderAdminRequestsTable();
    } else if (tabName === 'officials') {
      renderAdminOfficialsTable();
    } else if (tabName === 'feedback') {
      renderAdminFeedbackTable();
    } else if (tabName === 'services') {
      renderAdminServicesTable();
    } else if (tabName === 'events') {
      renderAdminEventsTable();
    } else if (tabName === 'settings') {
      loadSettingsForm();
    }
  }

  function refreshDashboardStats() {
    if (!window.BarangayStorage) return;
    const stats = window.BarangayStorage.getStats();

    const bindings = {
      'adminStatAnn': stats.totalAnnouncements,
      'adminStatReq': stats.totalRequests,
      'adminStatFb': stats.totalFeedback,
      'adminStatOff': stats.totalOfficials,
  // 2. Pure HTML5 Canvas API Charts Engine
  function renderCanvasCharts() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94A3B8' : '#64748B';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

    // Chart 1: Document Requests by Type (Bar Chart)
    const reqCanvas = document.getElementById('requestsChartCanvas');
    if (reqCanvas) {
      const ctx = reqCanvas.getContext('2d');
      const requests = window.BarangayStorage.getRequests();

      // Aggregate counts by type
      const counts = {
        'Clearance': 0,
        'Residency': 0,
        'Indigency': 0,
        'Business': 0
      };

      requests.forEach(r => {
        const type = (r.documentType || '').toLowerCase();
        if (type.includes('clearance') && !type.includes('business')) counts['Clearance']++;
        else if (type.includes('residency')) counts['Residency']++;
        else if (type.includes('indigency')) counts['Indigency']++;
        else if (type.includes('business')) counts['Business']++;
        else counts['Clearance']++;
      });

      const labels = ['Clearance', 'Residency', 'Indigency', 'Business'];
      const data = labels.map(l => counts[l]);
      const maxVal = Math.max(...data, 5);

      // DPR scaling for crisp canvas rendering
      const dpr = window.devicePixelRatio || 1;
      const rect = reqCanvas.getBoundingClientRect();
      reqCanvas.width = (rect.width || 420) * dpr;
      reqCanvas.height = (rect.height || 240) * dpr;
      ctx.scale(dpr, dpr);

      const w = rect.width || 420;
      const h = rect.height || 240;
      const padLeft = 45;
      const padBottom = 35;
      const padTop = 20;
      const padRight = 20;

      ctx.clearRect(0, 0, w, h);

      // Draw Grid Lines
      const chartH = h - padTop - padBottom;
      const chartW = w - padLeft - padRight;
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.font = '11px Poppins, sans-serif';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'right';

      for (let i = 0; i <= 4; i++) {
        const yVal = Math.round((maxVal / 4) * i);
        const yPos = padTop + chartH - (i * (chartH / 4));
        ctx.beginPath();
        ctx.moveTo(padLeft, yPos);
        ctx.lineTo(w - padRight, yPos);
        ctx.stroke();
        ctx.fillText(yVal.toString(), padLeft - 8, yPos + 4);
      }

      // Draw Bars
      const barW = chartW / (labels.length * 1.8);
      const gap = chartW / labels.length;

      labels.forEach((label, i) => {
        const barH = (data[i] / maxVal) * chartH;
        const x = padLeft + (i * gap) + (gap - barW) / 2;
        const y = padTop + chartH - barH;

        // Gradient
        const grad = ctx.createLinearGradient(0, y, 0, y + barH);
        grad.addColorStop(0, '#1E5AA8');
        grad.addColorStop(1, '#1F7A45');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
        ctx.fill();

        // Label
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.fillText(label, x + barW / 2, h - 12);

        // Value top
        ctx.fillStyle = isDark ? '#FFFFFF' : '#172B4D';
        ctx.font = 'bold 11px Poppins, sans-serif';
        ctx.fillText(data[i].toString(), x + barW / 2, y - 6);
      });
    }

    // Chart 2: Feedback Categories (Doughnut Chart)
    const fbCanvas = document.getElementById('feedbackChartCanvas');
    if (fbCanvas) {
      const ctx = fbCanvas.getContext('2d');
      const feedback = window.BarangayStorage.getFeedback();

      const counts = { Concern: 0, Report: 0, Suggestion: 0 };
      feedback.forEach(f => {
        if (counts[f.category] !== undefined) counts[f.category]++;
        else counts['Concern']++;
      });

      const dpr = window.devicePixelRatio || 1;
      const rect = fbCanvas.getBoundingClientRect();
      fbCanvas.width = (rect.width || 420) * dpr;
      fbCanvas.height = (rect.height || 240) * dpr;
      ctx.scale(dpr, dpr);

      const w = rect.width || 420;
      const h = rect.height || 240;
      const centerX = (w / 2) - 50;
      const centerY = h / 2;
      const radius = Math.min(centerX, centerY) - 20;
      const innerRadius = radius * 0.58;

      ctx.clearRect(0, 0, w, h);

      const total = feedback.length || 1;
      const categories = [
        { label: 'Concern', count: counts.Concern, color: '#DC3545' },
        { label: 'Report', count: counts.Report, color: '#F59E0B' },
        { label: 'Suggestion', count: counts.Suggestion, color: '#16A34A' }
      ];

      let startAngle = -Math.PI / 2;

      categories.forEach(cat => {
        const sliceAngle = (cat.count / total) * 2 * Math.PI;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = cat.color;
        ctx.fill();
        startAngle += sliceAngle;
      });

      // Total Counter in Center
      ctx.fillStyle = isDark ? '#FFFFFF' : '#172B4D';
      ctx.font = 'bold 18px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(total.toString(), centerX, centerY + 3);
  // 3. Announcements CRUD
  function renderAdminAnnouncementsTable() {
    const tbody = document.getElementById('adminAnnouncementsTableBody');
    if (!tbody || !window.BarangayStorage) return;

    const announcements = window.BarangayStorage.getAnnouncements();
    if (announcements.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">No announcements on file.</td></tr>`;
      return;
    }

    tbody.innerHTML = announcements.map((ann, idx) => `
      <tr>
        <td style="font-weight:600;">${idx + 1}</td>
        <td>
          <div style="font-weight:600; color:var(--text-primary);">${window.BarangayStorage.escapeHtml(ann.title)}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${ann.date}</div>
        </td>
        <td><span class="badge badge-blue">${window.BarangayStorage.escapeHtml(ann.category)}</span></td>
        <td>
          <button type="button" class="btn btn-sm ${ann.published !== false ? 'btn-secondary' : 'btn-outline'} toggle-publish-btn" data-id="${ann.id}">
            ${ann.published !== false ? '<i class="fa-solid fa-eye"></i> Published' : '<i class="fa-solid fa-eye-slash"></i> Draft'}
          </button>
        </td>
        <td>
          <div class="action-btn-group">
            <button type="button" class="action-btn edit-ann-btn" data-id="${ann.id}" title="Edit Announcement"><i class="fa-solid fa-pen-to-square"></i></button>
            <button type="button" class="action-btn delete-btn delete-ann-btn" data-id="${ann.id}" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.toggle-publish-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const list = window.BarangayStorage.getAnnouncements();
        const item = list.find(a => a.id === id);
        if (item) {
          item.published = item.published === false ? true : false;
          window.BarangayStorage.set(window.BarangayStorage.KEYS.ANNOUNCEMENTS, list);
          if (window.BarangaySound) window.BarangaySound.play('click');
          renderAdminAnnouncementsTable();
        }
      });
    });

    tbody.querySelectorAll('.delete-ann-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this announcement?')) {
          let list = window.BarangayStorage.getAnnouncements();
          list = list.filter(a => a.id !== id);
          window.BarangayStorage.set(window.BarangayStorage.KEYS.ANNOUNCEMENTS, list);
          window.BarangayComponents.showToast('Announcement deleted.', 'info');
          renderAdminAnnouncementsTable();
        }
      });
    });

    tbody.querySelectorAll('.edit-ann-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openEditAnnouncementModal(btn.getAttribute('data-id'));
      });
    });
  }

      ctx.font = '10px Poppins, sans-serif';
      ctx.fillStyle = textColor;
      ctx.fillText('Tickets', centerX, centerY + 18);

  function openEditAnnouncementModal(id = null) {
    let ann = null;
    if (id) {
      ann = window.BarangayStorage.getAnnouncements().find(a => a.id === id);
    }

    let modal = document.getElementById('adminAnnModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'adminAnnModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-box" style="max-width:580px;">
          <div class="modal-header">
            <h3 class="modal-title" id="annModalTitle">Add Announcement</h3>
            <button type="button" class="modal-close-btn" id="closeAnnModal"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <form id="annForm">
            <div class="modal-body">
              <input type="hidden" id="annFormId">
              <div class="form-group">
                <label class="form-label" for="annFormTitle">Title *</label>
                <input type="text" id="annFormTitle" class="form-control" required placeholder="Announcement headline...">
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div class="form-group">
                  <label class="form-label" for="annFormCat">Category</label>
                  <select id="annFormCat" class="form-control">
                    <option value="General">General</option>
                    <option value="Health">Health</option>
                    <option value="Community">Community</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Education">Education</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" for="annFormDate">Date</label>
                  <input type="date" id="annFormDate" class="form-control" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="annFormImg">Image URL</label>
                <input type="url" id="annFormImg" class="form-control" placeholder="https://...">
              </div>
              <div class="form-group">
                <label class="form-label" for="annFormDesc">Description *</label>
                <textarea id="annFormDesc" class="form-control" required placeholder="Full announcement text..."></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" id="cancelAnnModal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Announcement</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      const closeAction = () => modal.classList.remove('open');
      modal.querySelector('#closeAnnModal').addEventListener('click', closeAction);
      modal.querySelector('#cancelAnnModal').addEventListener('click', closeAction);

      modal.querySelector('#annForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = modal.querySelector('#annFormId').value;
        const title = modal.querySelector('#annFormTitle').value.trim();
        const category = modal.querySelector('#annFormCat').value;
        const date = modal.querySelector('#annFormDate').value;
        const imageUrl = modal.querySelector('#annFormImg').value.trim() || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=700&q=80';
        const description = modal.querySelector('#annFormDesc').value.trim();

        let list = window.BarangayStorage.getAnnouncements();

        if (editId) {
          const item = list.find(a => a.id === editId);
          if (item) {
            item.title = title;
            item.category = category;
            item.date = date;
            item.imageUrl = imageUrl;
            item.description = description;
          }
          window.BarangayComponents.showToast('Announcement updated.', 'success');
        } else {
          list.unshift({
            id: 'ann-' + Date.now(),
            title, category, date, imageUrl, description, published: true
          });
          window.BarangayComponents.showToast('Announcement created and published.', 'success');
        }

        window.BarangayStorage.set(window.BarangayStorage.KEYS.ANNOUNCEMENTS, list);
        modal.classList.remove('open');
        renderAdminAnnouncementsTable();
        refreshDashboardStats();
      });
    }

    modal.querySelector('#annModalTitle').textContent = id ? 'Edit Announcement' : 'Add Announcement';
    modal.querySelector('#annFormId').value = id || '';
  // 4. Document Requests Management
  function renderAdminRequestsTable() {
    const tbody = document.getElementById('adminRequestsTableBody');
    if (!tbody || !window.BarangayStorage) return;

    const requests = window.BarangayStorage.getRequests();
    if (requests.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No document requests found.</td></tr>`;
      return;
    }

    tbody.innerHTML = requests.map(req => `
      <tr>
        <td style="font-weight:700; color:var(--primary-blue);">${req.id}</td>
        <td>
          <div style="font-weight:600;">${window.BarangayStorage.escapeHtml(req.fullName)}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${window.BarangayStorage.escapeHtml(req.contactNumber)}</div>
        </td>
        <td>${window.BarangayStorage.escapeHtml(req.documentType)}</td>
        <td style="max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${window.BarangayStorage.escapeHtml(req.purpose)}</td>
        <td>${req.dateSubmitted}</td>
        <td>
          <select class="form-control req-status-select" data-id="${req.id}" style="padding:0.25rem 0.5rem; font-size:0.82rem; width:120px; font-weight:600;">
            <option value="Pending" ${req.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Processing" ${req.status === 'Processing' ? 'selected' : ''}>Processing</option>
            <option value="Completed" ${req.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Rejected" ${req.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </td>
        <td>
          <div class="action-btn-group">
            <button type="button" class="action-btn print-req-btn" data-id="${req.id}" title="Print Official Slip"><i class="fa-solid fa-print"></i></button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.req-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = sel.getAttribute('data-id');
        const newStatus = e.target.value;
        const list = window.BarangayStorage.getRequests();
        const item = list.find(r => r.id === id);
        if (item) {
          item.status = newStatus;
          window.BarangayStorage.set(window.BarangayStorage.KEYS.REQUESTS, list);
          window.BarangayComponents.showToast(`Request ${id} status updated to ${newStatus}.`, 'success');
          refreshDashboardStats();
          renderCanvasCharts();
        }
      });
    });

    tbody.querySelectorAll('.print-req-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const req = window.BarangayStorage.getRequests().find(r => r.id === id);
        if (req) printRequestSlipDirect(req);
      });
    });
  }

    modal.querySelector('#annFormTitle').value = ann ? ann.title : '';
    modal.querySelector('#annFormCat').value = ann ? ann.category : 'General';
    modal.querySelector('#annFormDate').value = ann ? ann.date : new Date().toISOString().split('T')[0];
  function exportRequestsToCSV() {
    const requests = window.BarangayStorage.getRequests();
    if (requests.length === 0) {
      window.BarangayComponents.showToast('No request records to export.', 'warning');
      return;
    }

    let csv = 'Reference ID,Applicant Name,Contact Number,Document Type,Purpose,Status,Date Submitted\n';
    requests.forEach(r => {
      csv += `"${r.id}","${(r.fullName||'').replace(/"/g,'""')}","${(r.contactNumber||'')}","${(r.documentType||'')}","${(r.purpose||'').replace(/"/g,'""')}","${r.status||'Pending'}","${r.dateSubmitted||''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Barangay_Document_Requests_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.BarangayComponents.showToast('Document requests exported to CSV.', 'success');
  }

  function printRequestSlipDirect(req) {
    const settings = window.BarangayStorage ? window.BarangayStorage.getSettings() : {};
    const printWin = window.open('', '_blank', 'width=750,height=700');
    if (!printWin) return;

    printWin.document.write(`
      <!DOCTYPE html><html><head><title>Slip - ${req.id}</title>
      <style>body{font-family:Arial,sans-serif;padding:30px;color:#172B4D;} .header{text-align:center;border-bottom:2px solid #1E5AA8;padding-bottom:12px;margin-bottom:20px;} .box{border:1px solid #CBD5E1;padding:16px;border-radius:6px;} .row{margin-bottom:10px;} .label{font-weight:bold;color:#64748B;display:inline-block;width:160px;}</style>
      </head><body>
      <div class="header"><h2>${settings.barangayName || 'Barangay San Isidro'}</h2><p>Official Document Request Slip</p></div>
      <div class="box">
        <div class="row"><span class="label">Reference ID:</span> <strong>${req.id}</strong></div>
        <div class="row"><span class="label">Document:</span> ${req.documentType}</div>
        <div class="row"><span class="label">Resident Name:</span> ${req.fullName}</div>
        <div class="row"><span class="label">Contact:</span> ${req.contactNumber}</div>
        <div class="row"><span class="label">Purpose:</span> ${req.purpose}</div>
        <div class="row"><span class="label">Status:</span> ${req.status}</div>
        <div class="row"><span class="label">Date Submitted:</span> ${req.dateSubmitted}</div>
      </div>
      <script>window.onload=function(){window.print();}<\/script></body></html>
    `);
    printWin.document.close();
  }

    modal.querySelector('#annFormImg').value = ann ? ann.imageUrl : '';
    modal.querySelector('#annFormDesc').value = ann ? ann.description : '';

    modal.classList.add('open');
  // 5. Officials CRUD
  function renderAdminOfficialsTable() {
    const tbody = document.getElementById('adminOfficialsTableBody');
    if (!tbody || !window.BarangayStorage) return;

    const officials = window.BarangayStorage.getOfficials();
    if (officials.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">No officials on file.</td></tr>`;
      return;
    }

    tbody.innerHTML = officials.map((off, idx) => `
      <tr>
        <td style="font-weight:600;">${idx + 1}</td>
        <td>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <img src="${window.BarangayStorage.escapeHtml(off.imageUrl)}" alt="${off.name}" style="width:34px; height:34px; border-radius:50%; object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'">
            <div>
              <div style="font-weight:600;">${window.BarangayStorage.escapeHtml(off.name)}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${window.BarangayStorage.escapeHtml(off.email)}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-green">${window.BarangayStorage.escapeHtml(off.position)}</span></td>
        <td>${window.BarangayStorage.escapeHtml(off.contactNumber)}</td>
        <td>
          <div class="action-btn-group">
            <button type="button" class="action-btn edit-official-btn" data-id="${off.id}"><i class="fa-solid fa-pen-to-square"></i></button>
            <button type="button" class="action-btn delete-btn delete-official-btn" data-id="${off.id}"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.delete-official-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this official from directory?')) {
          let list = window.BarangayStorage.getOfficials().filter(o => o.id !== id);
          window.BarangayStorage.set(window.BarangayStorage.KEYS.OFFICIALS, list);
          window.BarangayComponents.showToast('Official removed.', 'info');
          renderAdminOfficialsTable();
          refreshDashboardStats();
        }
      });
    });

    tbody.querySelectorAll('.edit-official-btn').forEach(btn => {
      btn.addEventListener('click', () => openEditOfficialModal(btn.getAttribute('data-id')));
    });
  }

  function openEditOfficialModal(id = null) {
    let off = null;
    if (id) off = window.BarangayStorage.getOfficials().find(o => o.id === id);

    let modal = document.getElementById('adminOfficialModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'adminOfficialModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-box" style="max-width:520px;">
          <div class="modal-header">
            <h3 class="modal-title" id="offModalTitle">Add Barangay Official</h3>
            <button type="button" class="modal-close-btn" id="closeOffModal"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <form id="offForm">
            <div class="modal-body">
              <input type="hidden" id="offFormId">
              <div class="form-group">
                <label class="form-label" for="offFormName">Full Name *</label>
                <input type="text" id="offFormName" class="form-control" required placeholder="Hon. Juan Dela Cruz">
              </div>
              <div class="form-group">
                <label class="form-label" for="offFormPosition">Position *</label>
                <input type="text" id="offFormPosition" class="form-control" required placeholder="Barangay Kagawad...">
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div class="form-group">
                  <label class="form-label" for="offFormContact">Contact Number</label>
                  <input type="text" id="offFormContact" class="form-control" placeholder="0917-000-0000">
                </div>
                <div class="form-group">
                  <label class="form-label" for="offFormEmail">Email</label>
                  <input type="email" id="offFormEmail" class="form-control" placeholder="name@barangay.gov.ph">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="offFormImg">Photo URL</label>
                <input type="url" id="offFormImg" class="form-control" placeholder="https://...">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" id="cancelOffModal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Official</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      const closeAction = () => modal.classList.remove('open');
      modal.querySelector('#closeOffModal').addEventListener('click', closeAction);
      modal.querySelector('#cancelOffModal').addEventListener('click', closeAction);

      modal.querySelector('#offForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = modal.querySelector('#offFormId').value;
        const name = modal.querySelector('#offFormName').value.trim();
        const position = modal.querySelector('#offFormPosition').value.trim();
        const contactNumber = modal.querySelector('#offFormContact').value.trim();
        const email = modal.querySelector('#offFormEmail').value.trim();
        const imageUrl = modal.querySelector('#offFormImg').value.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

        let list = window.BarangayStorage.getOfficials();
        if (editId) {
          const item = list.find(o => o.id === editId);
          if (item) {
            item.name = name; item.position = position; item.contactNumber = contactNumber; item.email = email; item.imageUrl = imageUrl;
          }
          window.BarangayComponents.showToast('Official updated.', 'success');
        } else {
          list.push({ id: 'off-' + Date.now(), name, position, contactNumber, email, imageUrl });
          window.BarangayComponents.showToast('Official added.', 'success');
        }
        window.BarangayStorage.set(window.BarangayStorage.KEYS.OFFICIALS, list);
        modal.classList.remove('open');
        renderAdminOfficialsTable();
        refreshDashboardStats();
      });
    }

    modal.querySelector('#offModalTitle').textContent = id ? 'Edit Official' : 'Add Official';
    modal.querySelector('#offFormId').value = id || '';
    modal.querySelector('#offFormName').value = off ? off.name : '';
    modal.querySelector('#offFormPosition').value = off ? off.position : '';
    modal.querySelector('#offFormContact').value = off ? off.contactNumber : '';
    modal.querySelector('#offFormEmail').value = off ? off.email : '';
    modal.querySelector('#offFormImg').value = off ? off.imageUrl : '';
  // 6. Feedback Management
  function renderAdminFeedbackTable() {
    const tbody = document.getElementById('adminFeedbackTableBody');
    if (!tbody || !window.BarangayStorage) return;

    const feedback = window.BarangayStorage.getFeedback();
    if (feedback.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">No feedback records found.</td></tr>`;
      return;
    }

    tbody.innerHTML = feedback.map((fb, idx) => `
      <tr>
        <td style="font-weight:600;">${idx + 1}</td>
        <td>
          <div style="font-weight:600;">${window.BarangayStorage.escapeHtml(fb.name)}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${window.BarangayStorage.escapeHtml(fb.email)}</div>
        </td>
        <td><span class="badge ${fb.category === 'Concern' ? 'badge-danger' : fb.category === 'Report' ? 'badge-warning' : 'badge-green'}">${fb.category}</span></td>
        <td>
          <div style="font-weight:600; font-size:0.88rem;">${window.BarangayStorage.escapeHtml(fb.subject)}</div>
          <div style="font-size:0.8rem; color:var(--text-secondary); max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${window.BarangayStorage.escapeHtml(fb.message)}</div>
        </td>
        <td>
          <button type="button" class="btn btn-sm ${fb.status === 'Resolved' ? 'btn-secondary' : 'btn-outline'} toggle-fb-btn" data-id="${fb.id}">
            ${fb.status === 'Resolved' ? '<i class="fa-solid fa-check"></i> Resolved' : 'Pending'}
          </button>
        </td>
        <td>
          <button type="button" class="action-btn delete-btn delete-fb-btn" data-id="${fb.id}"><i class="fa-solid fa-trash-can"></i></button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.toggle-fb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const list = window.BarangayStorage.getFeedback();
        const item = list.find(f => f.id === id);
        if (item) {
          item.status = item.status === 'Resolved' ? 'Pending' : 'Resolved';
          window.BarangayStorage.set(window.BarangayStorage.KEYS.FEEDBACK, list);
          window.BarangayComponents.showToast(`Feedback marked as ${item.status}.`, 'success');
          renderAdminFeedbackTable();
          refreshDashboardStats();
          renderCanvasCharts();
        }
      });
    });

    tbody.querySelectorAll('.delete-fb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this feedback item?')) {
          let list = window.BarangayStorage.getFeedback().filter(f => f.id !== id);
          window.BarangayStorage.set(window.BarangayStorage.KEYS.FEEDBACK, list);
          window.BarangayComponents.showToast('Feedback removed.', 'info');
          renderAdminFeedbackTable();
          refreshDashboardStats();
          renderCanvasCharts();
        }
      });
    });
  }


    modal.classList.add('open');
    if (window.BarangaySound) window.BarangaySound.play('modalOpen');
  // 7. Services CRUD
  function renderAdminServicesTable() {
    const tbody = document.getElementById('adminServicesTableBody');
    if (!tbody || !window.BarangayStorage) return;

    const services = window.BarangayStorage.getServices();
    tbody.innerHTML = services.map((srv, idx) => `
      <tr>
        <td style="font-weight:600;">${idx + 1}</td>
        <td>
          <div style="font-weight:600;">${window.BarangayStorage.escapeHtml(srv.name)}</div>
          <div style="font-size:0.8rem; color:var(--text-secondary); max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${window.BarangayStorage.escapeHtml(srv.description)}</div>
        </td>
        <td><span class="badge badge-blue">${window.BarangayStorage.escapeHtml(srv.category)}</span></td>
        <td>${window.BarangayStorage.escapeHtml(srv.processingTime)}</td>
        <td style="font-weight:600; color:var(--secondary-green);">${window.BarangayStorage.escapeHtml(srv.fee)}</td>
        <td>
          <button type="button" class="action-btn delete-btn delete-srv-btn" data-id="${srv.id}"><i class="fa-solid fa-trash-can"></i></button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.delete-srv-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this community service?')) {
          let list = window.BarangayStorage.getServices().filter(s => s.id !== id);
          window.BarangayStorage.set(window.BarangayStorage.KEYS.SERVICES, list);
          window.BarangayComponents.showToast('Service removed.', 'info');
          renderAdminServicesTable();
          refreshDashboardStats();
        }
      });
    });
  }

  // 8. Events CRUD
  function renderAdminEventsTable() {
    const tbody = document.getElementById('adminEventsTableBody');
    if (!tbody || !window.BarangayStorage) return;

    const events = window.BarangayStorage.getEvents();
    tbody.innerHTML = events.map((evt, idx) => `
      <tr>
        <td style="font-weight:600;">${idx + 1}</td>
        <td>
          <div style="font-weight:600;">${window.BarangayStorage.escapeHtml(evt.title)}</div>
          <div style="font-size:0.8rem; color:var(--text-secondary); max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${window.BarangayStorage.escapeHtml(evt.description)}</div>
        </td>
        <td>${evt.date} (${evt.time || 'TBA'})</td>
        <td><i class="fa-solid fa-location-dot" style="color:var(--primary-blue);"></i> ${window.BarangayStorage.escapeHtml(evt.venue)}</td>
        <td>
          <button type="button" class="action-btn delete-btn delete-evt-btn" data-id="${evt.id}"><i class="fa-solid fa-trash-can"></i></button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.delete-evt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this event?')) {
          let list = window.BarangayStorage.getEvents().filter(e => e.id !== id);
          window.BarangayStorage.set(window.BarangayStorage.KEYS.EVENTS, list);
          window.BarangayComponents.showToast('Event removed.', 'info');
          renderAdminEventsTable();
          refreshDashboardStats();
        }
      });
    });
  }

  }

    if (window.BarangaySound) window.BarangaySound.play('modalOpen');
  }
  // 9. Portal Settings
  function loadSettingsForm() {
    if (!window.BarangayStorage) return;
    const settings = window.BarangayStorage.getSettings();

    const form = document.getElementById('adminSettingsForm');
    if (!form) return;

    form.querySelector('#settingBarangayName').value = settings.barangayName || 'Barangay San Isidro';
    form.querySelector('#settingCity').value = settings.city || 'City of Manila';
    form.querySelector('#settingProvince').value = settings.province || 'Metro Manila';
    form.querySelector('#settingHotlinePolice').value = settings.hotlinePolice || '';
    form.querySelector('#settingHotlineFire').value = settings.hotlineFire || '';
    form.querySelector('#settingHotlineHealth').value = settings.hotlineHealth || '';
    form.querySelector('#settingHotlineOffice').value = settings.hotlineOffice || '';
    form.querySelector('#settingOfficeHours').value = settings.officeHours || '';
    form.querySelector('#settingAddress').value = settings.address || '';
    form.querySelector('#settingEmail').value = settings.email || '';
  }

  function initSettingsHandler() {
    const form = document.getElementById('adminSettingsForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = window.BarangayStorage.getSettings();

        settings.barangayName = form.querySelector('#settingBarangayName').value.trim();
        settings.city = form.querySelector('#settingCity').value.trim();
        settings.province = form.querySelector('#settingProvince').value.trim();
        settings.hotlinePolice = form.querySelector('#settingHotlinePolice').value.trim();
        settings.hotlineFire = form.querySelector('#settingHotlineFire').value.trim();
        settings.hotlineHealth = form.querySelector('#settingHotlineHealth').value.trim();
        settings.hotlineOffice = form.querySelector('#settingHotlineOffice').value.trim();
        settings.officeHours = form.querySelector('#settingOfficeHours').value.trim();
        settings.address = form.querySelector('#settingAddress').value.trim();
        settings.email = form.querySelector('#settingEmail').value.trim();

        window.BarangayStorage.set(window.BarangayStorage.KEYS.SETTINGS, settings);
        window.BarangayComponents.showToast('Barangay settings saved successfully.', 'success');

        document.querySelectorAll('.dynamic-barangay-name').forEach(el => {
          el.textContent = settings.barangayName;
        });
      });
    }

    const resetBtn = document.getElementById('resetDemoDataBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Warning: This will reset all announcements, requests, officials, feedback, and settings to original demonstration sample data. Continue?')) {
          window.BarangayStorage.resetToDemoData();
          window.BarangayComponents.showToast('Demo data re-seeded.', 'info');
          refreshDashboardStats();
          renderCanvasCharts();
          loadSettingsForm();
        }
      });
    }

    const exportCsvBtn = document.getElementById('exportRequestsCsvBtn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', exportRequestsToCSV);
    }

    const addAnnBtn = document.getElementById('openAddAnnouncementModalBtn');
    if (addAnnBtn) {
      addAnnBtn.addEventListener('click', () => openEditAnnouncementModal(null));
    }

    const addOffBtn = document.getElementById('openAddOfficialModalBtn');
    if (addOffBtn) {
      addOffBtn.addEventListener('click', () => openEditOfficialModal(null));
    }
  }

  // Window Resize & Theme Listener to redraw charts
  window.addEventListener('resize', () => {
    if (AdminState.currentTab === 'dashboard') {
      renderCanvasCharts();
    }
  });

  window.addEventListener('barangayThemeChange', () => {
    if (AdminState.currentTab === 'dashboard') {
      renderCanvasCharts();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    initAdminTabs();
    initSettingsHandler();
    refreshDashboardStats();
    renderCanvasCharts();
  });

})();


      // Legend on Right
      const legendX = w - 120;
      let legendY = 65;
      ctx.textAlign = 'left';

      categories.forEach(cat => {
        ctx.fillStyle = cat.color;
        ctx.beginPath();
        ctx.arc(legendX, legendY - 4, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isDark ? '#F1F5F9' : '#172B4D';
        ctx.font = '12px Poppins, sans-serif';
        ctx.fillText(`${cat.label} (${cat.count})`, legendX + 14, legendY);
        legendY += 30;
      });
    }
  }

      'adminStatEvt': stats.totalEvents
    };

    Object.keys(bindings).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = bindings[id];
    });
  }
