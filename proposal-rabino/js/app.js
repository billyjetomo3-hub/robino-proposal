/**
 * BARANGAY SAN ISIDRO COMMUNITY INFORMATION PORTAL
 * Mastered Government Frontend JavaScript Application
 * Vanilla JS - No External Frameworks
 * Fully Connected with LocalStorage Records, Web Audio API, and Modern UI State
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. STATE & AUDIO SYNTHESIS ENGINE (Web Audio API)
  // ==========================================================================
  const State = {
    soundEnabled: localStorage.getItem('portal_sound') === 'true', // OFF by default
    theme: localStorage.getItem('portal_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    audioCtx: null,
  };

  // Web Audio API Synthesizer (Zero network dependencies, instant sound)
  function getAudioContext() {
    if (!State.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        State.audioCtx = new AudioCtxClass();
      }
    }
    if (State.audioCtx && State.audioCtx.state === 'suspended') {
      State.audioCtx.resume();
    }
    return State.audioCtx;
  }

  function playSound(type) {
    if (!State.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'toggle') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // ==========================================================================
  // 2. TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  function showToast(title, message, iconClass = 'fa-circle-check', type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon"><i class="fa-solid ${iconClass}"></i></div>
      <div class="toast-content">
        <span class="toast-title">${title}</span>
        <span class="toast-msg">${message}</span>
      </div>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }


  // ==========================================================================
  // 3. LOCALSTORAGE DATABASE INITIALIZER
  // ==========================================================================
  const INITIAL_SERVICES = [
    {
      id: 'srv-clearance',
      title: 'Barangay Clearance',
      code: 'BC-01',
      icon: 'fa-file-shield',
      category: 'Frontline Certification',
      description: 'Official clearance certifying good moral standing, bona fide residency, and no derogatory barangay records.',
      requirements: ['Valid Government ID', 'Recent Cedula (Community Tax)', 'Proof of Billing'],
      processingTime: 'Same Day (15-30 Mins)',
      fee: '₱50.00 / Free for 1st Time Jobseekers',
      eligible: 'All residents residing for at least 6 months'
    },
    {
      id: 'srv-residency',
      title: 'Certificate of Residency',
      code: 'CR-02',
      icon: 'fa-house-user',
      category: 'Frontline Certification',
      description: 'Official verification of actual residence for school enrollment, banking, government ID, and utility services.',
      requirements: ['Valid Photo ID', 'Lease Contract / Land Title / Billing'],
      processingTime: 'Same Day (10-20 Mins)',
      fee: '₱50.00 / Waived for Student Verification',
      eligible: 'Bonafide residents of Barangay San Isidro'
    },
    {
      id: 'srv-indigency',
      title: 'Certificate of Indigency',
      code: 'CI-03',
      icon: 'fa-hand-holding-heart',
      category: 'Social Welfare & Assistance',
      description: 'Document granted to low-income constituents for hospital financial aid, scholarship grants, and legal assistance.',
      requirements: ['Barangay Verification', 'Assessment by Social Welfare Desk', 'Valid ID'],
      processingTime: '1 Business Day',
      fee: 'FREE of Charge (100% Subsidized)',
      eligible: 'Low-income families and indigent residents'
    },
    {
      id: 'srv-health',
      title: 'Health Services',
      code: 'HS-04',
      icon: 'fa-stethoscope',
      category: 'Public Health & Wellness',
      description: 'Free primary medical consultations, maternal care, child immunizations, maintenance medicines, and dental care.',
      requirements: ['Barangay Health Card / Family Folder', 'Valid Resident ID'],
      processingTime: 'Immediate Frontline Queue',
      fee: 'FREE (Funded by Barangay Healthcare Fund)',
      eligible: 'All infants, children, adults, and pregnant mothers'
    },
    {
      id: 'srv-seniors',
      title: 'Senior Citizen Programs',
      code: 'SC-05',
      icon: 'fa-person-cane',
      category: 'Elderly Affairs',
      description: 'Monthly social pension facilitation, free maintenance medicines, annual birthday gift subsidies, and wellness clubs.',
      requirements: ['OSCA Senior Citizen ID', 'Proof of Barangay Residency'],
      processingTime: 'Regular Monthly Schedules & Priority Desk',
      fee: 'FREE with Monthly Benefits',
      eligible: 'Residents aged 60 years old and above'
    },
    {
      id: 'srv-youth',
      title: 'Youth & Sports Programs',
      code: 'YP-06',
      icon: 'fa-volleyball',
      category: 'Sangguniang Kabataan (SK)',
      description: 'Empowerment programs, varsity leagues, coding & digital skill workshops, leadership retreats, and student subsidies.',
      requirements: ['Katipunan ng Kabataan (KK) Form', 'Student ID / Valid ID'],
      processingTime: 'Quarterly & Open Enrollment',
      fee: 'FREE Participation & Grants',
      eligible: 'Youth constituents aged 15-30 years old'
    }
  ];

  const INITIAL_ANNOUNCEMENTS = [
    {
      id: 'ann-1',
      title: 'Digital Frontline Clearance Portal Launched for All Constituents',
      category: 'Governance',
      date: '2026-11-08',
      image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=700&q=80',
      excerpt: 'Residents can now submit requests for Barangay Clearance, Residency, and Indigency online with same-day digital processing.',
      content: 'In line with our commitment to modern digital governance and convenience, Barangay San Isidro officially rolls out the 2026 Online Frontline Clearance module. Residents are encouraged to use the portal to minimize queuing times. Physical release remains available with prioritized digital lanes.'
    },
    {
      id: 'ann-2',
      title: 'Free Pneumococcal & Flu Vaccination for Senior Citizens & Children',
      category: 'Health',
      date: '2026-11-05',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80',
      excerpt: 'Comprehensive public health drive offering free quadrivalent flu vaccines and pediatric booster shots at the Health Center.',
      content: 'The Barangay San Isidro Health Center, in partnership with the City Health Office, is conducting an intensified vaccination blitz every Tuesday and Thursday this November. All eligible senior citizens and infants are advised to bring their health cards.'
    },
    {
      id: 'ann-3',
      title: 'Community Clean-Up & Anti-Dengue Fogging Drive Across Puroks',
      category: 'Public Advisory',
      date: '2026-11-02',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=700&q=80',
      excerpt: 'Barangay environmental team together with BHERT will conduct neighborhood 4S anti-dengue misting and decluttering drives.',
      content: 'To safeguard our community against seasonal vector-borne diseases, our Sanitation and Disaster Risk Reduction teams will hold synchronized fumigation in all 6 Puroks. Residents are requested to cooperate by clearing stagnant water receptacles.'
    }
  ];

  const INITIAL_EVENTS = [
    {
      id: 'evt-1',
      title: 'Barangay General Assembly & Townhall Meeting 2026',
      date: '2026-11-20',
      time: '8:30 AM - 12:00 PM',
      venue: 'San Isidro Multi-Purpose Covered Court',
      category: 'Assembly',
      description: 'Presentation of the 2026 2nd Semester Accomplishment Report, Fiscal Budget Updates, and Resident Open Forum.'
    },
    {
      id: 'evt-2',
      title: 'Comprehensive Free Medical, Dental & Optical Mission',
      date: '2026-11-28',
      time: '7:30 AM - 3:00 PM',
      venue: 'Barangay Health Center Grounds',
      category: 'Health Mission',
      description: 'Free consultations with volunteer doctors, eye refractions with free reading glasses, dental tooth extractions, and free medicine.'
    },
    {
      id: 'evt-3',
      title: 'Sangguniang Kabataan (SK) Inter-Purok Youth Sports League',
      date: '2026-12-05',
      time: '1:00 PM - 7:00 PM',
      venue: 'Barangay Central Covered Court',
      category: 'Youth Sports',
      description: 'Annual inter-purok basketball and volleyball tournament promoting drug-free sportsmanship, teamwork, and healthy lifestyle.'
    }
  ];

  const INITIAL_REQUESTS = [
    { id: 'req-101', residentName: 'Maria Santos', serviceName: 'Barangay Clearance', purpose: 'Employment Requirement', date: '2026-11-09', status: 'Completed' },
    { id: 'req-102', residentName: 'Juan Dela Cruz', serviceName: 'Certificate of Residency', purpose: 'Bank Account Opening', date: '2026-11-10', status: 'Processing' },
    { id: 'req-103', residentName: 'Corazon Reyes', serviceName: 'Certificate of Indigency', purpose: 'Medical Financial Subsidy', date: '2026-11-10', status: 'Completed' },
    { id: 'req-104', residentName: 'Arnel Mendoza', serviceName: 'Barangay Clearance', purpose: 'Postal ID Application', date: '2026-11-11', status: 'Pending Review' }
  ];

  const INITIAL_FEEDBACK = [
    { id: 'fb-201', name: 'Elena Bautista', email: 'elena.b@gmail.com', rating: 5, message: 'Fast processing of my barangay clearance. Very polite frontline staff!', date: '2026-11-08' },
    { id: 'fb-202', name: 'Roberto Tan', email: 'rtan@yahoo.com', rating: 5, message: 'The online portal makes requesting records so convenient without waiting in line.', date: '2026-11-09' },
    { id: 'fb-203', name: 'Grace Lim', email: 'grace.l@outlook.com', rating: 4, message: 'Prompt response during the medical outreach mission. Good job Barangay San Isidro!', date: '2026-11-10' }
  ];

  function getStored(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn(`Error reading LocalStorage for ${key}:`, e);
    }
    // If not set, persist fallback into LocalStorage
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  function getAnnouncements() {
    return getStored('barangay_announcements', INITIAL_ANNOUNCEMENTS);
  }

  function getServices() {
    return getStored('barangay_services', INITIAL_SERVICES);
  }

  function getEvents() {
    return getStored('barangay_events', INITIAL_EVENTS);
  }

  function getRequests() {
    // Check possible keys: barangay_document_requests or barangay_requests
    const req1 = localStorage.getItem('barangay_document_requests');
    if (req1) {
      try {
        const p = JSON.parse(req1);
        if (Array.isArray(p)) return p;
      } catch (e) {}
    }
    const req2 = localStorage.getItem('barangay_requests');
    if (req2) {
      try {
        const p = JSON.parse(req2);
        if (Array.isArray(p)) return p;
      } catch (e) {}
    }
    localStorage.setItem('barangay_document_requests', JSON.stringify(INITIAL_REQUESTS));
    return INITIAL_REQUESTS;
  }

  function getFeedback() {
    const fb1 = localStorage.getItem('barangay_feedback');
    if (fb1) {
      try {
        const p = JSON.parse(fb1);
        if (Array.isArray(p)) return p;
      } catch (e) {}
    }
    const fb2 = localStorage.getItem('barangay_feedbacks');
    if (fb2) {
      try {
        const p = JSON.parse(fb2);
        if (Array.isArray(p)) return p;
      } catch (e) {}
    }
    localStorage.setItem('barangay_feedback', JSON.stringify(INITIAL_FEEDBACK));
    return INITIAL_FEEDBACK;
  }

  // Animated Counter Function
  function animateCounter(el, target, duration = 1200) {
    if (!el) return;
    const start = 0;
    const startTime = performance.now();

    function update(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * ease);
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(update);
  }

  function refreshStatistics() {
    const annCount = getAnnouncements().length;
    const reqCount = getRequests().length;
    const fbCount = getFeedback().length;
    const srvCount = getServices().length;

    const elAnn = document.getElementById('statAnnouncements');
    const elReq = document.getElementById('statRequests');
    const elFb = document.getElementById('statFeedback');
    const elSrv = document.getElementById('statServices');

    if (elAnn) animateCounter(elAnn, annCount);
    if (elReq) animateCounter(elReq, reqCount);
    if (elFb) animateCounter(elFb, fbCount);
    if (elSrv) animateCounter(elSrv, srvCount);
  }

  // ==========================================================================
  // 4. COMMUNITY SERVICES RENDERING & MODALS
  // ==========================================================================
  function renderServices() {
    const services = getServices();
    const container = document.getElementById('servicesGrid');
    if (!container) return;

    container.innerHTML = services.map((srv, idx) => `
      <div class="service-card reveal-on-scroll delay-${(idx % 3) + 1}">
        <div class="service-icon-box">
          <i class="fa-solid ${srv.icon}"></i>
        </div>
        <h3 class="service-title">${srv.title}</h3>
        <p class="service-description">${srv.description}</p>
        <div class="service-requirements-preview">
          ${srv.requirements.map(req => `<span class="req-pill"><i class="fa-solid fa-check text-green-highlight"></i> ${req}</span>`).join('')}
        </div>
        <div class="service-footer-action">
          <button type="button" class="service-learn-more" data-service-id="${srv.id}">
            Learn More <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button type="button" class="service-request-btn" data-request-id="${srv.id}" data-service-name="${srv.title}">
            <i class="fa-solid fa-paper-plane"></i> Apply Online
          </button>
        </div>
      </div>
    `).join('');

    // Attach listeners
    container.querySelectorAll('.service-learn-more').forEach(btn => {
      btn.addEventListener('click', () => {
        playSound('click');
        const srvId = btn.getAttribute('data-service-id');
        openServiceDetailModal(srvId);
      });
    });

    container.querySelectorAll('.service-request-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playSound('click');
        const srvName = btn.getAttribute('data-service-name');
        openDocumentRequestModal(srvName);
      });
    });
  }

  function openServiceDetailModal(serviceId) {
    const services = getServices();
    const srv = services.find(s => s.id === serviceId);
    if (!srv) return;

    const modalTitle = document.getElementById('genericModalTitle');
    const modalBody = document.getElementById('genericModalBody');
    const modalFooter = document.getElementById('genericModalFooter');

    modalTitle.innerHTML = `<i class="fa-solid ${srv.icon} text-green-highlight"></i> ${srv.title}`;
    modalBody.innerHTML = `
      <p style="font-size:1.05rem; margin-bottom:1.25rem; color:var(--text-secondary); line-height:1.6;">${srv.description}</p>
      <div class="service-modal-meta">
        <div class="meta-box-item">
          <span class="meta-box-label">Processing Time</span>
          <span class="meta-box-val"><i class="fa-regular fa-clock"></i> ${srv.processingTime}</span>
        </div>
        <div class="meta-box-item">
          <span class="meta-box-label">Official Fee</span>
          <span class="meta-box-val"><i class="fa-solid fa-receipt"></i> ${srv.fee}</span>
        </div>
      </div>
      <h4 style="font-size:1rem; margin-bottom:0.5rem; color:var(--text-primary);">Required Documents / Eligibility:</h4>
      <ul class="service-req-list">
        ${srv.requirements.map(r => `<li class="service-req-item"><i class="fa-solid fa-circle-check"></i> ${r}</li>`).join('')}
        <li class="service-req-item"><i class="fa-solid fa-user-check"></i> ${srv.eligible}</li>
      </ul>
    `;

    modalFooter.innerHTML = `
      <button type="button" class="btn-secondary" style="padding:0.6rem 1.25rem; color:var(--text-primary); border-color:var(--border-light);" onclick="window.closePortalModal()">Close</button>
      <button type="button" class="btn-primary" style="padding:0.6rem 1.5rem;" id="modalApplyBtn">
        <i class="fa-solid fa-paper-plane"></i> Apply for this Document
      </button>
    `;

    document.getElementById('modalApplyBtn').addEventListener('click', () => {
      window.closePortalModal();
      openDocumentRequestModal(srv.title);
    });

    openModal('genericModal');
  }

  // ==========================================================================
  // 5. ANNOUNCEMENTS RENDERING & MODALS
  // ==========================================================================
  let currentAnnouncementFilter = 'all';

  function renderAnnouncements(filter = 'all') {
    currentAnnouncementFilter = filter;
    const announcements = getAnnouncements();
    const container = document.getElementById('announcementsGrid');
    if (!container) return;

    const filtered = filter === 'all' 
      ? announcements 
      : announcements.filter(a => a.category.toLowerCase().includes(filter.toLowerCase()));

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--card-bg); border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
          <i class="fa-solid fa-bullhorn" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
          <p style="color: var(--text-muted); font-size: 1.05rem;">No announcements found under this category.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((ann, idx) => {
      const dateFormatted = new Date(ann.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return `
        <article class="announcement-card reveal-on-scroll delay-${(idx % 3) + 1}">
          <div class="announcement-media">
            <img src="${ann.image}" alt="${ann.title}" class="announcement-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=700&q=80'">
            <span class="announcement-cat-badge">${ann.category}</span>
          </div>
          <div class="announcement-body">
            <div class="announcement-date">
              <i class="fa-regular fa-calendar"></i> ${dateFormatted}
            </div>
            <h3 class="announcement-title">${ann.title}</h3>
            <p class="announcement-excerpt">${ann.excerpt}</p>
            <button type="button" class="btn-read-more" data-ann-id="${ann.id}">
              Read Full Notice <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </article>
      `;
    }).join('');

    container.querySelectorAll('.btn-read-more').forEach(btn => {
      btn.addEventListener('click', () => {
        playSound('click');
        const annId = btn.getAttribute('data-ann-id');
        openAnnouncementModal(annId);
      });
    });
  }

  function openAnnouncementModal(annId) {
    const announcements = getAnnouncements();
    const ann = announcements.find(a => a.id === annId);
    if (!ann) return;

    const dateFormatted = new Date(ann.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const modalTitle = document.getElementById('genericModalTitle');
    const modalBody = document.getElementById('genericModalBody');
    const modalFooter = document.getElementById('genericModalFooter');

    modalTitle.innerHTML = `<span class="section-badge" style="margin-bottom:0.25rem;">${ann.category}</span><br>${ann.title}`;
    modalBody.innerHTML = `
      <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.25rem; display:flex; align-items:center; gap:0.5rem;">
        <i class="fa-regular fa-calendar"></i> Published: ${dateFormatted}
      </div>
      <img src="${ann.image}" alt="${ann.title}" style="width:100%; max-height:260px; object-fit:cover; border-radius:var(--radius-md); margin-bottom:1.5rem;" onerror="this.style.display='none'">
      <p style="font-size:1.02rem; line-height:1.75; color:var(--text-secondary);">${ann.content || ann.excerpt}</p>
    `;

    modalFooter.innerHTML = `
      <button type="button" class="btn-secondary" style="padding:0.6rem 1.25rem; color:var(--text-primary); border-color:var(--border-light);" onclick="window.closePortalModal()">Close</button>
      <button type="button" class="btn-primary" style="padding:0.6rem 1.25rem;" id="modalShareBtn">
        <i class="fa-solid fa-share-nodes"></i> Share Advisory
      </button>
    `;

    document.getElementById('modalShareBtn').addEventListener('click', () => {
      playSound('success');
      showToast('Announcement Link Copied', 'Public advisory link ready to share on social channels.');
    });

    openModal('genericModal');
  }

  // ==========================================================================
  // 6. UPCOMING EVENTS RENDERING
  // ==========================================================================
  function renderUpcomingEvents() {
    const allEvents = getEvents();
    const container = document.getElementById('eventsGrid');
    if (!container) return;

    // Filter strictly to upcoming events (relative to current date in 2026)
    const today = new Date('2026-11-11T00:00:00');

    const upcomingEvents = allEvents.filter(evt => {
      const evtDate = new Date(evt.date + 'T23:59:59');
      return evtDate >= today;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    if (upcomingEvents.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--card-bg); border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
          <i class="fa-regular fa-calendar-xmark" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
          <p style="color: var(--text-muted); font-size: 1.05rem;">No upcoming community events scheduled at this moment.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = upcomingEvents.map((evt, idx) => {
      const d = new Date(evt.date);
      const monthStr = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const dayStr = d.getDate();
      const yearStr = d.getFullYear();

      return `
        <div class="event-card reveal-on-scroll delay-${(idx % 3) + 1}">
          <div class="event-card-header">
            <div class="event-date-badge">
              <span class="event-month">${monthStr}</span>
              <span class="event-day">${dayStr}</span>
              <span class="event-year">${yearStr}</span>
            </div>
            <div class="event-header-info">
              <span class="event-category-tag">${evt.category}</span>
              <h3 class="event-title">${evt.title}</h3>
            </div>
          </div>
          <div class="event-meta-info">
            <div class="event-meta-item">
              <i class="fa-regular fa-clock"></i>
              <span>${evt.time}</span>
            </div>
            <div class="event-meta-item">
              <i class="fa-solid fa-location-dot"></i>
              <span>${evt.venue}</span>
            </div>
          </div>
          <p class="event-description">${evt.description}</p>
          <div class="event-actions">
            <button type="button" class="btn-event-rsvp" data-event-title="${evt.title}">
              <i class="fa-regular fa-bell"></i> Set Reminder
            </button>
            <span style="font-size: 0.8rem; font-weight: 600; color: var(--primary-green);">
              <i class="fa-solid fa-users"></i> Open to All
            </span>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.btn-event-rsvp').forEach(btn => {
      btn.addEventListener('click', () => {
        playSound('success');
        const title = btn.getAttribute('data-event-title');
        showToast('Event Reminder Set', `You will receive alerts for: ${title}`);
      });
    });
  }

  // ==========================================================================
  // 7. EMERGENCY HOTLINES INTERACTION
  // ==========================================================================
  function setupHotlines() {
    document.querySelectorAll('.hotline-alt-phone').forEach(btn => {
      btn.addEventListener('click', () => {
        const phone = btn.getAttribute('data-phone');
        navigator.clipboard.writeText(phone).then(() => {
          playSound('success');
          showToast('Hotline Number Copied', `${phone} copied to your clipboard.`);
        }).catch(() => {
          showToast('Hotline Number', `${phone}`);
        });
      });
    });
  }

  // ==========================================================================
  // 8. INTERACTIVE DOCUMENT REQUEST & FEEDBACK MODALS (CONNECTED TO LOCALSTORAGE)
  // ==========================================================================
  function openDocumentRequestModal(preselectedService = '') {
    const services = getServices();
    const modalTitle = document.getElementById('genericModalTitle');
    const modalBody = document.getElementById('genericModalBody');
    const modalFooter = document.getElementById('genericModalFooter');

    modalTitle.innerHTML = `<i class="fa-solid fa-file-signature text-green-highlight"></i> Request Barangay Document Online`;
    modalBody.innerHTML = `
      <form id="docRequestForm" onsubmit="return false;">
        <div class="form-group">
          <label class="form-label" for="reqServiceName">Select Document / Certificate *</label>
          <select id="reqServiceName" class="form-control" required>
            ${services.map(s => `<option value="${s.title}" ${s.title === preselectedService ? 'selected' : ''}>${s.title} (${s.code})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="reqFullName">Full Name (Last, First, Middle) *</label>
          <input type="text" id="reqFullName" class="form-control" placeholder="e.g. Juan P. Dela Cruz" required>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
          <div class="form-group">
            <label class="form-label" for="reqContact">Mobile Number *</label>
            <input type="tel" id="reqContact" class="form-control" placeholder="0917-000-0000" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="reqPurok">Purok / Zone *</label>
            <select id="reqPurok" class="form-control" required>
              <option value="Purok 1 - Mabini">Purok 1 - Mabini</option>
              <option value="Purok 2 - Rizal">Purok 2 - Rizal</option>
              <option value="Purok 3 - Bonifacio">Purok 3 - Bonifacio</option>
              <option value="Purok 4 - Aguinaldo">Purok 4 - Aguinaldo</option>
              <option value="Purok 5 - Silang">Purok 5 - Silang</option>
              <option value="Purok 6 - Luna">Purok 6 - Luna</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="reqPurpose">Purpose of Request *</label>
          <input type="text" id="reqPurpose" class="form-control" placeholder="e.g. Local Employment / Scholarship / Bank Requirement" required>
        </div>
      </form>
    `;

    modalFooter.innerHTML = `
      <button type="button" class="btn-secondary" style="padding:0.6rem 1.25rem; color:var(--text-primary); border-color:var(--border-light);" onclick="window.closePortalModal()">Cancel</button>
      <button type="button" class="btn-primary" style="padding:0.6rem 1.5rem;" id="submitDocRequestBtn">
        <i class="fa-solid fa-check"></i> Submit Online Request
      </button>
    `;

    document.getElementById('submitDocRequestBtn').addEventListener('click', () => {
      const name = document.getElementById('reqFullName').value.trim();
      const service = document.getElementById('reqServiceName').value;
      const purpose = document.getElementById('reqPurpose').value.trim();

      if (!name || !purpose) {
        showToast('Required Fields Missing', 'Please fill in your full name and purpose.', 'fa-circle-exclamation', 'error');
        return;
      }

      // Save to LocalStorage
      const currentRequests = getRequests();
      const newReq = {
        id: 'req-' + Date.now(),
        residentName: name,
        serviceName: service,
        purpose: purpose,
        date: new Date().toISOString().split('T')[0],
        status: 'Processing'
      };

      currentRequests.unshift(newReq);
      localStorage.setItem('barangay_document_requests', JSON.stringify(currentRequests));

      window.closePortalModal();
      playSound('success');
      showToast('Document Request Submitted!', `Reference ID #${newReq.id.slice(-6)}. Saved into LocalStorage.`);
      refreshStatistics();
    });

    openModal('genericModal');
  }

  function openFeedbackModal() {
    const modalTitle = document.getElementById('genericModalTitle');
    const modalBody = document.getElementById('genericModalBody');
    const modalFooter = document.getElementById('genericModalFooter');

    modalTitle.innerHTML = `<i class="fa-solid fa-comments text-green-highlight"></i> Citizen Feedback & Inquiries`;
    modalBody.innerHTML = `
      <form id="feedbackForm" onsubmit="return false;">
        <div class="form-group">
          <label class="form-label" for="fbName">Resident Name *</label>
          <input type="text" id="fbName" class="form-control" placeholder="Your Full Name" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="fbEmail">Email or Contact Number *</label>
          <input type="text" id="fbEmail" class="form-control" placeholder="your.email@example.com / 0917-..." required>
        </div>
        <div class="form-group">
          <label class="form-label" for="fbRating">Satisfaction Rating</label>
          <select id="fbRating" class="form-control">
            <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent Government Service</option>
            <option value="4">⭐⭐⭐⭐ 4 - Very Satisfied</option>
            <option value="3">⭐⭐⭐ 3 - Satisfied</option>
            <option value="2">⭐⭐ 2 - Needs Improvement</option>
            <option value="1">⭐ 1 - Unsatisfactory</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="fbMessage">Your Feedback / Suggestion / Inquiry *</label>
          <textarea id="fbMessage" class="form-control" rows="3" placeholder="Share your message or recommendation to help improve our barangay community..." required></textarea>
        </div>
      </form>
    `;

    modalFooter.innerHTML = `
      <button type="button" class="btn-secondary" style="padding:0.6rem 1.25rem; color:var(--text-primary); border-color:var(--border-light);" onclick="window.closePortalModal()">Cancel</button>
      <button type="button" class="btn-primary" style="padding:0.6rem 1.5rem;" id="submitFeedbackBtn">
        <i class="fa-solid fa-paper-plane"></i> Send Feedback
      </button>
    `;

    document.getElementById('submitFeedbackBtn').addEventListener('click', () => {
      const name = document.getElementById('fbName').value.trim();
      const email = document.getElementById('fbEmail').value.trim();
      const rating = document.getElementById('fbRating').value;
      const message = document.getElementById('fbMessage').value.trim();

      if (!name || !message) {
        showToast('Incomplete Form', 'Please enter your name and feedback message.', 'fa-circle-exclamation', 'error');
        return;
      }

      const currentFeedback = getFeedback();
      const newFb = {
        id: 'fb-' + Date.now(),
        name: name,
        email: email,
        rating: Number(rating),
        message: message,
        date: new Date().toISOString().split('T')[0]
      };

      currentFeedback.unshift(newFb);
      localStorage.setItem('barangay_feedback', JSON.stringify(currentFeedback));

      window.closePortalModal();
      playSound('success');
      showToast('Thank You!', 'Your feedback has been recorded in LocalStorage.');
      refreshStatistics();
    });

    openModal('genericModal');
  }

  function openAllAnnouncementsModal() {
    const announcements = getAnnouncements();
    const modalTitle = document.getElementById('genericModalTitle');
    const modalBody = document.getElementById('genericModalBody');
    const modalFooter = document.getElementById('genericModalFooter');

    modalTitle.innerHTML = `<i class="fa-solid fa-bullhorn text-green-highlight"></i> All Official Announcements (${announcements.length})`;
    modalBody.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        ${announcements.map(ann => {
          const dateStr = new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          return `
            <div style="padding:1rem; border:1px solid var(--border-light); border-radius:var(--radius-md); background:var(--bg-secondary);">
              <span class="section-badge" style="font-size:0.7rem; padding:0.2rem 0.6rem; margin-bottom:0.35rem;">${ann.category}</span>
              <h4 style="font-size:1.05rem; margin-bottom:0.3rem;">${ann.title}</h4>
              <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.5rem;"><i class="fa-regular fa-calendar"></i> ${dateStr}</p>
              <p style="font-size:0.9rem; color:var(--text-secondary);">${ann.excerpt}</p>
            </div>
          `;
        }).join('')}
      </div>
    `;

    modalFooter.innerHTML = `
      <button type="button" class="btn-primary" style="padding:0.6rem 1.5rem;" onclick="window.closePortalModal()">Done</button>
    `;

    openModal('genericModal');
  }

  // ==========================================================================
  // 9. MODAL HELPERS & GLOBAL CONTROLS
  // ==========================================================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  window.closePortalModal = function () {
    playSound('click');
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closePortalModal();
    }
  });

  // ==========================================================================
  // 10. SOUND & DARK THEME TOGGLES
  // ==========================================================================
  function setupToggles() {
    // Sound Toggle
    const soundToggle = document.getElementById('soundToggle');
    const mobileSoundToggle = document.getElementById('mobileSoundToggle');

    function updateSoundUI() {
      const isSoundOn = State.soundEnabled;
      const soundButtons = [soundToggle, mobileSoundToggle].filter(Boolean);
      soundButtons.forEach(btn => {
        if (isSoundOn) {
          btn.classList.add('sound-on');
          btn.innerHTML = '<i class="fa-solid fa-volume-high"></i><span class="sound-status-dot"></span>';
          btn.setAttribute('title', 'Sound Effects: Enabled (Click to Mute)');
        } else {
          btn.classList.remove('sound-on');
          btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i><span class="sound-status-dot"></span>';
          btn.setAttribute('title', 'Sound Effects: Muted (Click to Enable)');
        }
      });
    }

    function toggleSound() {
      State.soundEnabled = !State.soundEnabled;
      localStorage.setItem('portal_sound', State.soundEnabled ? 'true' : 'false');
      updateSoundUI();
      if (State.soundEnabled) {
        playSound('success');
        showToast('Sound Effects Enabled', 'Audio feedback is now active for interactive elements.');
      } else {
        showToast('Sound Effects Muted', 'Portal is running in silent mode.', 'fa-volume-xmark', 'info');
      }
    }

    if (soundToggle) soundToggle.addEventListener('click', toggleSound);
    if (mobileSoundToggle) mobileSoundToggle.addEventListener('click', toggleSound);
    updateSoundUI();

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      State.theme = theme;
      localStorage.setItem('portal_theme', theme);
      const isDark = theme === 'dark';
      const themeButtons = [themeToggle, mobileThemeToggle].filter(Boolean);
      themeButtons.forEach(btn => {
        btn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      });
    }

    function toggleTheme() {
      playSound('toggle');
      const nextTheme = State.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      showToast(nextTheme === 'dark' ? 'Dark Mode Activated' : 'Light Mode Activated', 'Theme preference has been saved.', nextTheme === 'dark' ? 'fa-moon' : 'fa-sun', 'info');
    }

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
    applyTheme(State.theme);
  }

  // ==========================================================================
  // 11. SCROLL REVEAL, STICKY HEADER & MOBILE NAV
  // ==========================================================================
  function setupNavigationAndScroll() {
    const header = document.querySelector('.site-header');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDrawer = document.getElementById('mobileNavDrawer');

    // Sticky shadow
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });

    // Hamburger toggle
    if (hamburgerBtn && mobileDrawer) {
      hamburgerBtn.addEventListener('click', () => {
        playSound('click');
        const isOpen = hamburgerBtn.classList.toggle('open');
        mobileDrawer.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
          hamburgerBtn.classList.remove('open');
          mobileDrawer.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // Scroll Reveal with IntersectionObserver
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));

    // Stats IntersectionObserver for animated count
    const statsSection = document.getElementById('statisticsSection');
    if (statsSection) {
      let statsAnimated = false;
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            refreshStatistics();
          }
        });
      }, { threshold: 0.25 });
      statsObserver.observe(statsSection);
    }

    // Announcement filter pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        playSound('click');
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const category = pill.getAttribute('data-filter');
        renderAnnouncements(category);
      });
    });

    // View All Announcements Link
    const viewAllAnnBtn = document.getElementById('viewAllAnnouncementsBtn');
    if (viewAllAnnBtn) {
      viewAllAnnBtn.addEventListener('click', (e) => {
        e.preventDefault();
        playSound('click');
        openAllAnnouncementsModal();
      });
    }

    // General CTA Button Sound & Action Listeners
    document.querySelectorAll('.btn-primary, .btn-secondary, .nav-link, .btn-directions').forEach(btn => {
      btn.addEventListener('click', () => playSound('click'));
    });

    // Feedback modal trigger
    const feedbackTriggers = document.querySelectorAll('.open-feedback-modal');
    feedbackTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        playSound('click');
        openFeedbackModal();
      });
    });

    // Request Document trigger
    const requestTriggers = document.querySelectorAll('.open-request-modal');
    requestTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        playSound('click');
        openDocumentRequestModal();
      });
    });
  }

  // ==========================================================================
  // 12. INITIALIZATION ON DOM READY
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    setupToggles();
    renderServices();
    renderAnnouncements('all');
    renderUpcomingEvents();
    setupHotlines();
    setupNavigationAndScroll();
    refreshStatistics();

    // Backdrop click to close modals
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          window.closePortalModal();
        }
      });
    });
  });

})();

