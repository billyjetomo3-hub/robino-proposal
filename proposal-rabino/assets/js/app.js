/**
 * BARANGAY PORTAL — HOMEPAGE CONTROLLER
 * Hero animated statistics, latest announcements preview, upcoming events, and weather placeholder
 */

(function () {
  'use strict';

  function animateCount(el, target, duration = 1200) {
    if (!el) return;
    const startTime = performance.now();
    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(step);
  }

  function initHeroStatistics() {
    if (!window.BarangayStorage) return;
    const stats = window.BarangayStorage.getStats();

    const statEls = {
      announcements: document.getElementById('statTotalAnnouncements'),
      requests: document.getElementById('statTotalRequests'),
      feedback: document.getElementById('statTotalFeedback'),
      services: document.getElementById('statTotalServices')
    };

    let observed = false;
    const statsContainer = document.getElementById('heroStatsRow');
    if (!statsContainer) {
      if (statEls.announcements) animateCount(statEls.announcements, stats.totalAnnouncements);
      if (statEls.requests) animateCount(statEls.requests, stats.totalRequests);
      if (statEls.feedback) animateCount(statEls.feedback, stats.totalFeedback);
      if (statEls.services) animateCount(statEls.services, stats.totalServices);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !observed) {
          observed = true;
          if (statEls.announcements) animateCount(statEls.announcements, stats.totalAnnouncements);
          if (statEls.requests) animateCount(statEls.requests, stats.totalRequests);
          if (statEls.feedback) animateCount(statEls.feedback, stats.totalFeedback);
          if (statEls.services) animateCount(statEls.services, stats.totalServices);
          observer.unobserve(statsContainer);
        }
      });
    }, { threshold: 0.2 });

  function renderLatestAnnouncements() {
    const container = document.getElementById('latestAnnouncementsGrid');
    if (!container || !window.BarangayStorage) return;

    const announcements = window.BarangayStorage.getAnnouncements().filter(a => a.published !== false).slice(0, 3);
    if (announcements.length === 0) {
      container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; color: var(--text-muted);">No announcements published at this time.</div>`;
      return;
    }

    container.innerHTML = announcements.map((ann, idx) => `
      <div class="card reveal-on-scroll stagger-${idx + 1}" style="display:flex; flex-direction:column; padding:0; overflow:hidden;">
        <div style="height:190px; overflow:hidden; position:relative; background:var(--bg-alt);">
          <img src="${window.BarangayStorage.escapeHtml(ann.imageUrl)}" alt="${window.BarangayStorage.escapeHtml(ann.title)}" style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease;" onerror="this.src='https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=700&q=80'">
          <span class="badge badge-blue" style="position:absolute; top:14px; left:14px;">${window.BarangayStorage.escapeHtml(ann.category)}</span>
        </div>
        <div style="padding:1.5rem; display:flex; flex-direction:column; flex-grow:1;">
          <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.5rem; display:flex; align-items:center; gap:0.4rem;">
            <i class="fa-regular fa-calendar"></i> ${new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <h3 style="font-size:1.18rem; margin-bottom:0.75rem; line-height:1.4;">${window.BarangayStorage.escapeHtml(ann.title)}</h3>
          <p style="font-size:0.9rem; margin-bottom:1.25rem; flex-grow:1; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${window.BarangayStorage.escapeHtml(ann.description)}</p>
          <a href="announcements.html" class="btn btn-outline btn-sm" style="align-self:flex-start;">Read Details <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
    `).join('');
  }

  function renderUpcomingEventsPreview() {
    const container = document.getElementById('upcomingEventsPreviewGrid');
    if (!container || !window.BarangayStorage) return;

    const events = window.BarangayStorage.getEvents().slice(0, 3);
    if (events.length === 0) {
      container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; color: var(--text-muted);">No upcoming events scheduled.</div>`;
      return;
    }

    container.innerHTML = events.map((evt, idx) => `
      <div class="card reveal-on-scroll stagger-${idx + 1}" style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
            <span class="badge badge-green"><i class="fa-solid fa-calendar-check"></i> ${window.BarangayStorage.escapeHtml(evt.date)}</span>
            <span style="font-size:0.82rem; font-weight:600; color:var(--text-muted);"><i class="fa-regular fa-clock"></i> ${window.BarangayStorage.escapeHtml(evt.time || 'TBA')}</span>
          </div>
          <h3 style="font-size:1.2rem; margin-bottom:0.6rem;">${window.BarangayStorage.escapeHtml(evt.title)}</h3>
          <p style="font-size:0.9rem; margin-bottom:1rem;">${window.BarangayStorage.escapeHtml(evt.description)}</p>
        </div>
        <div style="padding-top:0.85rem; border-top:1px solid var(--border-color); display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; color:var(--text-secondary);">
          <i class="fa-solid fa-location-dot" style="color:var(--primary-blue);"></i> <strong>Venue:</strong> ${window.BarangayStorage.escapeHtml(evt.venue)}
        </div>
      </div>
    `).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeroStatistics();
    renderLatestAnnouncements();
    renderUpcomingEventsPreview();

    const revealEls = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => observer.observe(el));
  });

})();

    observer.observe(statsContainer);
  }
