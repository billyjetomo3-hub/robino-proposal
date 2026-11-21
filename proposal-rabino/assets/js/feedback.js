/**
 * BARANGAY PORTAL — CITIZEN FEEDBACK CONTROLLER
 * Submission of Concerns, Reports, and Suggestions with instant confirmation
 */

(function () {
  'use strict';

  function initFeedbackForm() {
    const form = document.getElementById('citizenFeedbackForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fbName').value.trim();
      const email = document.getElementById('fbEmail').value.trim();
      const category = document.getElementById('fbCategory').value;
      const subject = document.getElementById('fbSubject').value.trim();
      const message = document.getElementById('fbMessage').value.trim();

      if (!name || !email || !category || !subject || !message) {
        window.BarangayComponents.showToast('Please fill out all required feedback fields.', 'warning');
        return;
      }

      const storage = window.BarangayStorage;
      const newFeedback = {
        id: 'fb-' + Date.now(),
        name: name,
        email: email,
        category: category,
        subject: subject,
        message: message,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      };

      const allFeedback = storage.getFeedback();
      allFeedback.unshift(newFeedback);
      storage.set(storage.KEYS.FEEDBACK, allFeedback);

      form.reset();
      window.BarangayComponents.showToast('Thank you! Your feedback has been received.', 'success', 'Feedback Submitted');

      showFeedbackSuccessModal(newFeedback);
    });
  }

  function showFeedbackSuccessModal(fb) {
    let modal = document.getElementById('feedbackSuccessModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'feedbackSuccessModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-box" style="max-width: 500px; text-align: center;">
          <div class="modal-body" style="padding: 2.25rem 1.75rem;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--secondary-green-light); color: var(--secondary-green); font-size: 1.85rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto;">
              <i class="fa-solid fa-paper-plane"></i>
            </div>
            <h2 style="font-size: 1.45rem; margin-bottom: 0.5rem;">Feedback Transmitted!</h2>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem;">
              Your <strong>${window.BarangayStorage.escapeHtml(fb.category)}</strong> has been filed with the Barangay Public Assistance and Complaints Desk.
            </p>
            <div style="background: var(--bg-alt); padding: 1rem; border-radius: var(--radius-md); text-align: left; font-size: 0.88rem; margin-bottom: 1.5rem;">
              <div><strong>Ticket Code:</strong> ${fb.id}</div>
              <div><strong>Subject:</strong> ${window.BarangayStorage.escapeHtml(fb.subject)}</div>
              <div><strong>Status:</strong> <span class="badge badge-warning">Pending Review</span></div>
            </div>
            <button type="button" class="btn btn-primary" id="fbSuccessCloseBtn" style="width: 100%;">Return to Portal</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#fbSuccessCloseBtn').addEventListener('click', () => {
        modal.classList.remove('open');
        if (window.BarangaySound) window.BarangaySound.play('click');
      });
    }

    modal.classList.add('open');
    if (window.BarangaySound) window.BarangaySound.play('success');
  }

  document.addEventListener('DOMContentLoaded', initFeedbackForm);

})();
