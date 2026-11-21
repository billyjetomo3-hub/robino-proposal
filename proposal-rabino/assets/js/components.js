/**
 * BARANGAY PORTAL — MASTERED COMPONENTS SYSTEM
 * SVG Brand Logos, Toast Notifications, Dark Mode Engine, Global Search & Header Sync
 */

(function (window) {
  'use strict';

  // SVG Brand Emblem Generator (Crisp vector government seal)
  function getBrangayLogoSvg(variant = 'portal') {
    return `
      <svg class="brand-emblem-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Barangay Official Seal">
        <circle cx="50" cy="50" r="47" fill="#1E5AA8" stroke="#1F7A45" stroke-width="4"/>
        <circle cx="50" cy="50" r="41" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="3 2"/>
        <!-- Shield Background -->
        <path d="M50 16L72 26V48C72 63 62 76 50 82C38 76 28 63 28 48V26L50 16Z" fill="#FFFFFF"/>
        <!-- Shield Half Colors -->
        <path d="M50 18L70 27V48C70 61.5 61 73.5 50 79V18Z" fill="#1F7A45" opacity="0.9"/>
        <path d="M50 18L30 27V48C30 61.5 39 73.5 50 79V18Z" fill="#1E5AA8" opacity="0.9"/>
        <!-- House Silhouette -->
        <path d="M50 32L61 41V56H54V47H46V56H39V41L50 32Z" fill="#FFFFFF"/>
        <!-- Three Stars -->
        <polygon points="50,22 51.5,25.5 55,25.5 52,27.5 53.5,31 50,29 46.5,31 48,27.5 45,25.5 48.5,25.5" fill="#F59E0B"/>
        <polygon points="37,34 38,36 40.5,36 38.5,37.5 39.5,40 37,38.5 34.5,40 35.5,37.5 33.5,36 36,36" fill="#F59E0B"/>
        <polygon points="63,34 64,36 66.5,36 64.5,37.5 65.5,40 63,38.5 60.5,40 61.5,37.5 59.5,36 62,36" fill="#F59E0B"/>
        <!-- People / Community Hands Silhouette -->
        <path d="M42 66C44 63 47 61 50 61C53 61 56 63 58 66C56 68 53 69 50 69C47 69 44 68 42 66Z" fill="#FFFFFF"/>
        <circle cx="50" cy="58" r="3.5" fill="#FFFFFF"/>
      </svg>
    `;
  }

  // Toast Notification System
  function showToast(message, type = 'info', title = null) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const typeIcons = {
      success: 'fa-circle-check',
      error: 'fa-circle-xmark',
      warning: 'fa-triangle-exclamation',
      info: 'fa-circle-info'
    };

    const defaultTitles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="toast-icon"><i class="fa-solid ${typeIcons[type] || 'fa-bell'}"></i></div>
      <div class="toast-content">
        <div class="toast-title">${title || defaultTitles[type] || 'Notification'}</div>
        <div class="toast-message">${window.BarangayStorage ? window.BarangayStorage.escapeHtml(message) : message}</div>
      </div>
      <button type="button" class="toast-close" aria-label="Close notification"><i class="fa-solid fa-xmark"></i></button>
    `;

    container.appendChild(toast);

    // Play Sound
    if (window.BarangaySound) {
      window.BarangaySound.play(type === 'success' ? 'success' : type === 'error' ? 'error' : 'notification');
    }

    // Slide in
    setTimeout(() => toast.classList.add('show'), 15);

    function dismiss() {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 320);
    }

    toast.querySelector('.toast-close').addEventListener('click', dismiss);
    setTimeout(dismiss, 4500);
  }

  // Dark Mode Engine
  const ThemeManager = {
    current: localStorage.getItem('barangay_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),

    apply(theme) {
      this.current = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('barangay_theme', theme);

      // Update toggles
      document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      });

      // Dispatch event for components like canvas charts
      window.dispatchEvent(new CustomEvent('barangayThemeChange', { detail: { theme } }));
    },

    toggle() {
      if (window.BarangaySound) {
        window.BarangaySound.play('click');
      }
      this.apply(this.current === 'dark' ? 'light' : 'dark');
    }
  };

  // Global Search Modal Engine
  function openGlobalSearch() {
    let modal = document.getElementById('globalSearchModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'globalSearchModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-box" style="max-width:680px;">
          <div class="modal-header">
            <h3 class="modal-title"><i class="fa-solid fa-magnifying-glass" style="color:var(--primary-blue);"></i> Global Portal Search</h3>
            <button type="button" class="modal-close-btn" id="closeSearchModalBtn"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <div class="form-group" style="margin-bottom:1.5rem;">
              <input type="text" id="globalSearchInput" class="form-control" placeholder="Search announcements, document requests, officials, events..." style="font-size:1.05rem; padding:0.85rem 1.25rem;">
            </div>
            <div id="globalSearchResults" style="max-height:360px; overflow-y:auto; display:flex; flex-direction:column; gap:0.75rem;">
              <div style="text-align:center; padding:2rem; color:var(--text-muted);">
                <i class="fa-solid fa-keyboard" style="font-size:2rem; margin-bottom:0.75rem; display:block;"></i>
                Type keywords to instantly search through all official barangay records.
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#closeSearchModalBtn').addEventListener('click', closeGlobalSearch);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGlobalSearch();
      });

      const searchInput = modal.querySelector('#globalSearchInput');
      searchInput.addEventListener('input', (e) => executeGlobalSearch(e.target.value.trim()));
    }

    modal.classList.add('open');
    if (window.BarangaySound) {
      window.BarangaySound.play('modalOpen');
    }
    const input = document.getElementById('globalSearchInput');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 80);
    }
  }

  function closeGlobalSearch() {
    const modal = document.getElementById('globalSearchModal');
    if (modal) {
      modal.classList.remove('open');
      if (window.BarangaySound) {
        window.BarangaySound.play('click');
      }
    }
  }

  function executeGlobalSearch(query) {
    const resultsContainer = document.getElementById('globalSearchResults');
    if (!resultsContainer) return;

    if (!query || query.length < 2) {
      resultsContainer.innerHTML = `
        <div style="text-align:center; padding:2rem; color:var(--text-muted);">
          <i class="fa-solid fa-keyboard" style="font-size:2rem; margin-bottom:0.75rem; display:block;"></i>
          Type keywords to instantly search through all official barangay records.
        </div>
      `;
      return;
    }

    const q = query.toLowerCase();
    const storage = window.BarangayStorage;
    const announcements = storage.getAnnouncements();
    const requests = storage.getRequests();
    const officials = storage.getOfficials();
    const events = storage.getEvents();

    let matches = [];

    announcements.forEach(a => {
      if (a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)) {
        matches.push({
          type: 'Announcement',
          icon: 'fa-bullhorn',
          badgeClass: 'badge-blue',
          title: a.title,
          desc: a.description,
          link: 'announcements.html'
        });
      }
    });

    requests.forEach(r => {
      if (r.id.toLowerCase().includes(q) || r.fullName.toLowerCase().includes(q) || r.documentType.toLowerCase().includes(q) || r.status.toLowerCase().includes(q)) {
        matches.push({
          type: 'Request Track',
          icon: 'fa-file-lines',
          badgeClass: 'badge-green',
          title: `${r.id} - ${r.fullName} (${r.documentType})`,
          desc: `Status: ${r.status} | Purpose: ${r.purpose}`,
          link: 'documents.html'
        });
      }
    });

    officials.forEach(o => {
      if (o.name.toLowerCase().includes(q) || o.position.toLowerCase().includes(q)) {
        matches.push({
          type: 'Official',
          icon: 'fa-user-tie',
          badgeClass: 'badge-warning',
          title: o.name,
          desc: `${o.position} · ${o.contactNumber}`,
          link: 'officials.html'
        });
      }
    });

    events.forEach(e => {
      if (e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)) {
        matches.push({
          type: 'Event',
          icon: 'fa-calendar-day',
          badgeClass: 'badge-success',
          title: e.title,
          desc: `${e.date} (${e.time}) · Venue: ${e.venue}`,
          link: 'events.html'
        });
      }
    });

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align:center; padding:2.5rem; color:var(--text-muted);">
          <i class="fa-solid fa-magnifying-glass-chart" style="font-size:2rem; margin-bottom:0.75rem; display:block;"></i>
          No records found matching "<strong>${storage.escapeHtml(query)}</strong>".
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matches.map(item => `
      <a href="${item.link}" class="card" style="padding:1rem 1.25rem; text-decoration:none; display:flex; align-items:flex-start; gap:1rem; border-radius:var(--radius-md);">
        <div style="width:38px; height:38px; border-radius:var(--radius-md); background:var(--bg-alt); display:flex; align-items:center; justify-content:center; color:var(--primary-blue); font-size:1.1rem; flex-shrink:0;">
          <i class="fa-solid ${item.icon}"></i>
        </div>
        <div style="flex-grow:1;">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
            <span class="badge ${item.badgeClass}">${item.type}</span>
            <strong style="color:var(--text-primary); font-size:0.95rem;">${storage.escapeHtml(item.title)}</strong>
          </div>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">${storage.escapeHtml(item.desc)}</p>
        </div>
        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:0.85rem; align-self:center;"></i>
      </a>
    `).join('');
  }

  function initializeComponents() {
    ThemeManager.apply(ThemeManager.current);

    // Populate logo slots
    document.querySelectorAll('.brand-emblem-slot').forEach(slot => {
      slot.innerHTML = getBrangayLogoSvg();
    });

    // Populate editable barangay name
    if (window.BarangayStorage) {
      const settings = window.BarangayStorage.getSettings();
      document.querySelectorAll('.dynamic-barangay-name').forEach(el => {
        el.textContent = settings.barangayName || 'Barangay San Isidro';
      });
    }

    // Bind theme toggles
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => ThemeManager.toggle());
    });

    // Bind sound toggles
    document.querySelectorAll('.sound-toggle-btn').forEach(btn => {
      function updateSoundBtnUI() {
        const isEnabled = window.BarangaySound ? window.BarangaySound.enabled : true;
        btn.innerHTML = isEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
        btn.classList.toggle('sound-on', isEnabled);
        btn.classList.toggle('sound-muted', !isEnabled);
        btn.setAttribute('title', isEnabled ? 'Sound: ON (Click to Mute)' : 'Sound: Muted (Click to Enable)');
      }
      updateSoundBtnUI();
      btn.addEventListener('click', () => {
        if (window.BarangaySound) {
          window.BarangaySound.toggle();
          updateSoundBtnUI();
        }
      });
    });

    // Bind Global Search button
    document.querySelectorAll('.search-trigger-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openGlobalSearch();
      });
    });

    // Keyboard shortcut for search
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openGlobalSearch();
      }
      if (e.key === 'Escape') {
        closeGlobalSearch();
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
      }
    });

    // Mobile Hamburger
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    if (hamburgerBtn && mobileDrawer) {
      hamburgerBtn.addEventListener('click', () => {
        if (window.BarangaySound) window.BarangaySound.play('click');
        const isOpen = hamburgerBtn.classList.toggle('open');
        mobileDrawer.classList.toggle('open', isOpen);
      });
    }

    // Back to top button
    document.querySelectorAll('.back-to-top-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.BarangaySound) window.BarangaySound.play('click');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Sound effect on regular interactive buttons
    document.querySelectorAll('.btn, .nav-item, .footer-links a').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (window.BarangaySound) window.BarangaySound.play('hover');
      });
      el.addEventListener('click', () => {
        if (window.BarangaySound) window.BarangaySound.play('click');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initializeComponents);

  window.BarangayComponents = {
    getLogoSvg: getBrangayLogoSvg,
    showToast: showToast,
    ThemeManager: ThemeManager,
    openGlobalSearch: openGlobalSearch,
    closeGlobalSearch: closeGlobalSearch
  };

})(window);

