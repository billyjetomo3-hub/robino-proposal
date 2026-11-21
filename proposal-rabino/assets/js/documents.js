/**
 * BARANGAY PORTAL — DOCUMENT REQUEST & TRACKING ENGINE
 * Submission validation, unique BRGY-XXXXX ID generation, timeline visualization & print slip
 */

(function () {
  'use strict';

  function initDocRequestForm() {
    const form = document.getElementById('documentRequestForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('reqFullName').value.trim();
      const address = document.getElementById('reqAddress').value.trim();
      const contactNumber = document.getElementById('reqContact').value.trim();
      const documentType = document.getElementById('reqDocType').value;
      const purpose = document.getElementById('reqPurpose').value.trim();

      if (!fullName || !address || !contactNumber || !documentType || !purpose) {
        window.BarangayComponents.showToast('Please fill out all required document request fields.', 'warning');
        return;
      }

      const storage = window.BarangayStorage;
      const nextId = storage.generateNextRequestId();
      const todayStr = new Date().toISOString().split('T')[0];
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newRecord = {
        id: nextId,
        fullName: fullName,
        address: address,
        contactNumber: contactNumber,
        documentType: documentType,
        purpose: purpose,
        status: 'Pending',
        dateSubmitted: todayStr,
        timeline: [
          { status: 'Pending', timestamp: `${todayStr} ${timeStr}`, note: 'Request successfully submitted through Resident Portal.' }
        ]
      };

      const requests = storage.getRequests();
      requests.unshift(newRecord);
      storage.set(storage.KEYS.REQUESTS, requests);

      form.reset();
      showRequestSuccessModal(newRecord);
    });
  }

  function showRequestSuccessModal(req) {
    let modal = document.getElementById('requestSuccessModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'requestSuccessModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-box" style="max-width: 580px; text-align: center;">
          <div class="modal-body" style="padding: 2.5rem 2rem;">
            <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--secondary-green-light); color: var(--secondary-green); font-size: 2.2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
              <i class="fa-solid fa-check"></i>
            </div>
            <h2 style="font-size: 1.6rem; margin-bottom: 0.5rem;">Request Submitted!</h2>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Your document application has been recorded in the barangay database. Please save your tracking number:</p>
            <div style="background: var(--bg-alt); border: 2px dashed var(--primary-blue); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem;">
              <span style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Reference Tracking Code</span>
              <span id="successTrackingId" style="font-size: 1.85rem; font-weight: 800; color: var(--primary-blue); letter-spacing: 0.05em;"></span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 2rem;">You can use this code in the Track Document tab at any time to follow your document's approval status.</p>
            <div style="display: flex; gap: 0.75rem; justify-content: center;">
              <button type="button" class="btn btn-outline" id="successTrackNowBtn"><i class="fa-solid fa-magnifying-glass"></i> Track Status Now</button>
              <button type="button" class="btn btn-primary" id="successPrintSlipBtn"><i class="fa-solid fa-print"></i> Print Application Slip</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#successTrackNowBtn').addEventListener('click', () => {
        modal.classList.remove('open');
        const searchInput = document.getElementById('trackSearchInput');
        if (searchInput && req) {
          searchInput.value = req.id;
          executeTrackSearch(req.id);
          searchInput.scrollIntoView({ behavior: 'smooth' });
        }
      });

      modal.querySelector('#successPrintSlipBtn').addEventListener('click', () => {
        printRequestSlip(req);
      });
    }

  function executeTrackSearch(query) {
    const resultBox = document.getElementById('trackResultBox');
    if (!resultBox) return;

    if (!query) {
      resultBox.innerHTML = `
        <div style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted);">
          <i class="fa-solid fa-file-magnifying-glass" style="font-size: 2.5rem; margin-bottom: 1rem; display: block;"></i>
          Enter your Reference ID (e.g., BRGY-00001) or Full Name to view status.
        </div>
      `;
      return;
    }

    const q = query.trim().toLowerCase();
    const requests = window.BarangayStorage.getRequests();
    const match = requests.find(r => r.id.toLowerCase() === q || r.fullName.toLowerCase().includes(q));

    if (!match) {
      if (window.BarangaySound) window.BarangaySound.play('warning');
      resultBox.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1.5rem; background: var(--bg-alt); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; color: var(--color-warning); margin-bottom: 0.85rem; display: block;"></i>
          <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">No Request Found</h3>
          <p style="color: var(--text-secondary); max-width: 360px; margin: 0 auto;">No records found for "<strong>${window.BarangayStorage.escapeHtml(query)}</strong>".</p>
        </div>
      `;
      return;
    }

    if (window.BarangaySound) window.BarangaySound.play('notification');

    const statusSteps = ['Pending', 'Processing', 'Completed'];
    const currentStepIdx = match.status === 'Rejected' ? -1 : statusSteps.indexOf(match.status);

    resultBox.innerHTML = `
      <div class="card" style="padding: 1.75rem;">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
          <div>
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Tracking Reference</span>
            <h3 style="font-size: 1.4rem; color: var(--primary-blue); font-weight: 800;">${match.id}</h3>
          </div>
          <span class="badge ${match.status === 'Completed' ? 'badge-success' : match.status === 'Processing' ? 'badge-blue' : match.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}">
            ${match.status}
          </span>
        </div>

        ${match.status === 'Rejected' ? `
          <div style="background: var(--color-danger-light); border-radius: var(--radius-md); padding: 0.85rem 1rem; color: var(--color-danger); margin-bottom: 1.25rem;">
            <strong>Application Rejected:</strong> Please coordinate with the Barangay Desk.
          </div>
        ` : `
          <div style="display: flex; align-items: center; justify-content: space-between; position: relative; margin: 1.5rem 0.5rem 2rem 0.5rem;">
            <div style="position: absolute; top: 18px; left: 0; right: 0; height: 4px; background: var(--border-color); z-index: 1;"></div>
            <div style="position: absolute; top: 18px; left: 0; width: ${currentStepIdx === 0 ? '0%' : currentStepIdx === 1 ? '50%' : '100%'}; height: 4px; background: var(--secondary-green); z-index: 1; transition: width 0.4s ease;"></div>
            ${statusSteps.map((step, idx) => `
              <div style="position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center;">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: ${idx <= currentStepIdx ? 'var(--secondary-green)' : 'var(--bg-surface)'}; border: 3px solid ${idx <= currentStepIdx ? 'var(--secondary-green)' : 'var(--border-color)'}; color: ${idx <= currentStepIdx ? '#FFFFFF' : 'var(--text-muted)'}; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 700;">
                  ${idx <= currentStepIdx ? '<i class=\"fa-solid fa-check\"></i>' : (idx + 1)}
                </div>
                <span style="font-size: 0.8rem; font-weight: 600; margin-top: 0.4rem; color: ${idx <= currentStepIdx ? 'var(--text-primary)' : 'var(--text-muted)'};">${step}</span>
              </div>
            `).join('')}
          </div>
        `}

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.25rem; background: var(--bg-alt); padding: 1rem; border-radius: var(--radius-md);">
          <div><div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Applicant</div><div style="font-weight:600;">${window.BarangayStorage.escapeHtml(match.fullName)}</div></div>
          <div><div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Document</div><div style="font-weight:600;">${window.BarangayStorage.escapeHtml(match.documentType)}</div></div>
          <div><div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Purpose</div><div style="font-weight:600;">${window.BarangayStorage.escapeHtml(match.purpose)}</div></div>
          <div><div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Date Filed</div><div style="font-weight:600;">${match.dateSubmitted}</div></div>
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button type="button" class="btn btn-outline btn-sm" id="printFromTrackerBtn"><i class="fa-solid fa-print"></i> Print Application Slip</button>
        </div>
      </div>
    `;

    resultBox.querySelector('#printFromTrackerBtn').addEventListener('click', () => {
      printRequestSlip(match);
    });
  }

    modal.querySelector('#successTrackingId').textContent = req.id;
    modal.classList.add('open');
    if (window.BarangaySound) window.BarangaySound.play('success');
  }
  function printRequestSlip(req) {
    if (window.BarangaySound) window.BarangaySound.play('click');
    const settings = window.BarangayStorage ? window.BarangayStorage.getSettings() : {};
    const printWin = window.open('', '_blank', 'width=750,height=700');
    if (!printWin) {
      window.BarangayComponents.showToast('Please enable pop-ups to print slip.', 'warning');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Document Request Slip - ${req.id}</title>
        <style>
          body { font-family: 'Poppins', sans-serif, Arial; padding: 40px; color: #172B4D; }
          .header { text-align: center; border-bottom: 2px solid #1E5AA8; padding-bottom: 15px; margin-bottom: 25px; }
          .header h1 { margin: 0; color: #1E5AA8; font-size: 22px; text-transform: uppercase; }
          .header p { margin: 4px 0 0 0; color: #64748B; font-size: 13px; }
          .slip-box { border: 1px solid #E2E8F0; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .row { display: flex; margin-bottom: 12px; }
          .label { width: 180px; font-weight: bold; color: #64748B; font-size: 13px; text-transform: uppercase; }
          .value { font-weight: 600; font-size: 15px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #94A3B8; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${settings.barangayName || 'Barangay San Isidro'}</h1>
          <p>OFFICIAL DOCUMENT APPLICATION SLIP</p>
          <p>${settings.address || 'Municipal Hall Compound, Philippines'}</p>
        </div>
        <div class="slip-box">
          <div class="row"><div class="label">Reference ID:</div><div class="value" style="color:#1E5AA8; font-size:18px;">${req.id}</div></div>
          <div class="row"><div class="label">Document Requested:</div><div class="value">${req.documentType}</div></div>
          <div class="row"><div class="label">Applicant Name:</div><div class="value">${req.fullName}</div></div>
          <div class="row"><div class="label">Address:</div><div class="value">${req.address}</div></div>
          <div class="row"><div class="label">Contact Number:</div><div class="value">${req.contactNumber}</div></div>
          <div class="row"><div class="label">Purpose:</div><div class="value">${req.purpose}</div></div>
          <div class="row"><div class="label">Date Submitted:</div><div class="value">${req.dateSubmitted}</div></div>
          <div class="row"><div class="label">Status:</div><div class="value">${req.status}</div></div>
        </div>
        <p style="font-size:13px; color:#64748B;">Please present this slip together with valid IDs when claiming your document at the Barangay Hall.</p>
        <div class="footer"><p>Barangay Community Information Portal</p></div>
        <script>window.onload = function() { window.print(); }<\/script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDocRequestForm();

    const trackInput = document.getElementById('trackSearchInput');
    const trackBtn = document.getElementById('trackSearchBtn');
    if (trackBtn && trackInput) {
      trackBtn.addEventListener('click', () => executeTrackSearch(trackInput.value));
      trackInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeTrackSearch(trackInput.value);
        }
      });
    }
  });

})();

