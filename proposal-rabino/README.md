# Barangay Community Information Portal — Mastered UI Premium Edition

A complete, modern, accessible, and fully functional digital government service platform for **Barangay San Isidro**.

---

## 1. Technology Restrictions & Compliance

This application adheres to 100% pure vanilla frontend web standards:
- **HTML5** (Semantic structure, ARIA accessibility attributes)
- **CSS3** (Custom properties, fluid typography, responsive grid & flexbox, smooth micro-animations)
- **Vanilla JavaScript (ES6+)** (Modular architecture, zero npm/Node dependencies, zero frameworks)
- **HTML5 Canvas API** (Custom bar and doughnut analytics charts rendered directly from LocalStorage records)
- **Web Audio API** (Lightweight programmatic interface sound synthesizer with zero external audio assets)
- **Browser LocalStorage & SessionStorage** (Centralized data persistence and session state management)
- **CDN Assets**:
  - Google Fonts CDN (*Poppins: 300, 400, 500, 600, 700, 800*)
  - Font Awesome 6.5.1 CDN (*SVG & Font Icons*)

**Strictly Prohibited & Excluded**: No React, Vue, Angular, Node.js, PHP, MySQL, Firebase, Bootstrap, or Tailwind CSS. Runs instantly by opening `index.html` in any web browser.

---

## 2. Default Administrative Demo Credentials

| Role | Username | Password |
|---|---|---|
| **Barangay Administrator / Punong Barangay** | `admin` | `admin123` |

> **Security Limitation Notice**: This application operates strictly on client-side LocalStorage and SessionStorage for demonstration and academic evaluation. Real government deployment requires an enterprise-grade backend, server-side authentication, role-based access controls (RBAC), and certified document storage.

---

## 3. Project File Architecture

```
proposal-rabino/
├── index.html               # Main Public Gateway Portal
├── announcements.html       # Public Notices, Advisories & Details Modal
├── documents.html           # Online Request System & BRGY-XXXXX Tracking
├── officials.html           # Barangay Leadership Directory & Profiles
├── services.html            # Frontline Services, Fees & Turnaround Schedule
├── feedback.html            # Citizen Feedback, Incident Reports & Inquiries
├── events.html              # Community Events & Calendar View
├── about.html               # Mission, Vision, Heritage & FAQ Accordion
├── login.html               # Staff Authentication & Session Login
├── admin.html               # Mastered Administrative Command Dashboard
│
├── assets/
│   ├── css/
│   │   ├── style.css        # Government Design System, Palette & Layout
│   │   ├── animations.css   # Micro-interactions, Shimmer & Reduced-Motion
│   │   ├── dashboard.css    # Distinct Admin Layout, Tables & Charts
│   │   └── responsive.css   # Mobile, Tablet & Touchscreen Optimization
│   └── js/
│       ├── storage.js       # Centralized LocalStorage DB Engine & Safe HTML
│       ├── sound.js         # Web Audio API Synthesizer (Click, Chime, Tone)
│       ├── auth.js          # Session Management & Route Guard
│       ├── components.js    # Vector SVG Logo, Dark Mode & Global Search
│       ├── app.js           # Homepage Statistics & Section Hydration
│       ├── announcements.js # Public Notices Filtering, Search & Modal
│       ├── documents.js     # Request Generation & Visual Timeline
│       ├── officials.js     # Officials Profiles & Directory
│       ├── services.js      # Frontline Programs & Checklist Modals
│       ├── feedback.js      # Citizen Feedback Transmittal
│       ├── events.js        # Calendar Filtering & Event Details
│       └── dashboard.js     # Admin CRUD, Canvas Charts & CSV Export
└── README.md
```

---

## 4. Key Functional Features

1. **Custom Vector Branding & Seal**:
   - Circular government emblem with Philippine shield, house silhouette, community hands, and star accents in `#1E5AA8` (Primary Blue) and `#1F7A45` (Secondary Green).
   - Dynamic Barangay Name synchronization across all 9 pages via `BarangayStorage`.

2. **Web Audio API Sound Engine**:
   - Soft click, subtle hover, two-tone success confirmation, low-frequency error alert, gentle warning chime, modal opening sound, page transition, and descending logout tone.
   - User-toggleable sound ON/OFF with volume management and LocalStorage persistence.

3. **Complete Dark Mode System**:
   - Comprehensive palette re-mapping for light and dark environments with full contrast compliance and responsive canvas chart re-drawing.

4. **Global Search Modal (Ctrl+K)**:
   - Instant multi-entity query matching across Announcements, Document Applications, Council Officials, and Community Events.

5. **Document Request & Visual Timeline Tracking**:
   - Auto-generates unique `BRGY-XXXXX` tracking numbers.
   - Interactive visual milestone timeline: *Pending* → *Processing* → *Completed* or *Rejected*.
   - Printable application slip with print-optimized CSS.

6. **Admin Dashboard with Canvas Analytics**:
   - Document requests distribution bar chart and feedback category doughnut chart calculated dynamically from real stored records.
   - Comprehensive CRUD for Announcements, Requests, Officials, Feedback, Services, and Events.
   - Export requests to CSV spreadsheet with single-click download.
   - Configuration tab for editing Barangay Name, hotlines, office hours, and address with live instant propagation.
   - One-click *Re-seed Sample Demo Records* button.

---

## 5. How to Run the Project

1. Double-click `index.html` or open it with any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
2. No Node.js, Python, or local server installation is required.
3. To test admin capabilities, click **Admin Portal** or navigate to `login.html`, log in using `admin` / `admin123`, and explore the dashboard.
