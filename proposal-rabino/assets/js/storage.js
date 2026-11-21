/**
 * BARANGAY PORTAL — CENTRALIZED LOCALSTORAGE STORAGE ENGINE
 * Manages all persistent entities, validation, sample seeding, and HTML escaping
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    ANNOUNCEMENTS: 'barangay_announcements',
    REQUESTS: 'barangay_requests',
    OFFICIALS: 'barangay_officials',
    FEEDBACK: 'barangay_feedback',
    EVENTS: 'barangay_events',
    SERVICES: 'barangay_services',
    SETTINGS: 'barangay_settings',
    ADMIN: 'barangay_admin',
    PREFERENCES: 'barangay_preferences'
  };

  // Safe HTML Escaper to prevent stored XSS
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initial Sample Data Seeds
  const SEED_SETTINGS = {
    barangayName: 'Barangay San Isidro',
    city: 'City of Manila',
    province: 'Metro Manila',
    hotlinePolice: '911 / (02) 8527-3011',
    hotlineFire: '160 / (02) 8527-3622',
    hotlineHealth: '(02) 8527-0012',
    hotlineOffice: '(02) 8527-7788',
    officeHours: 'Monday – Friday: 8:00 AM – 5:00 PM',
    address: 'Municipal Compound, Taft Avenue, Barangay San Isidro',
    email: 'info@barangaysanisidro.gov.ph',
    soundEnabled: true,
    volume: 0.25
  };

  const SEED_ADMIN = {
    username: 'admin',
    passwordHash: 'admin123',
    name: 'Administrator',
    role: 'Barangay Captain / Admin'
  };

  const SEED_ANNOUNCEMENTS = [
    {
      id: 'ann-1',
      title: 'Free Community Medical & Dental Mission 2026',
      category: 'Health',
      description: 'The Barangay Health Center, in partnership with the City Health Department, will hold a free whole-day medical, pediatric, dental, and optical check-up for all residents.',
      date: '2026-11-20',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80',
      published: true
    },
    {
      id: 'ann-2',
      title: 'Barangay Clean-Up Drive and Dengue Prevention Operation',
      category: 'Community',
      description: 'All Purok leaders and homeowners are invited to participate in the Oplan Baklas basura and drainage de-clogging this Saturday morning.',
      date: '2026-11-18',
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=700&q=80',
      published: true
    },
    {
      id: 'ann-3',
      title: 'Online Barangay Clearance & Certificate Portal Now Fully Active',
      category: 'General',
      description: 'Constituents can now submit document requests, verify requirements, and track processing timelines completely online without lining up at the hall.',
      date: '2026-11-15',
      imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=700&q=80',
      published: true
    },
    {
      id: 'ann-4',
      title: 'Emergency Storm & Flood Advisory Level 1 Preparedness',
      category: 'Emergency',
      description: 'The Barangay Disaster Risk Reduction Management Office (BDRRMO) advises all low-lying zone residents to monitor alerts and prepare emergency grab bags.',
      date: '2026-11-12',
      imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=700&q=80',
      published: true
    }
  ];

  const SEED_SERVICES = [
    {
      id: 'srv-1',
      name: 'Barangay Clearance',
      category: 'Document',
      fee: 'PHP 50.00',
      processingTime: '1 Business Day',
      requirements: ['Valid Government ID', 'Proof of Residency (Utility Bill)', 'Community Tax Certificate (Cedula)'],
      description: 'Essential document certifying that the constituent has no derogatory record in the barangay. Required for employment, business licensing, and school enrollment.'
    },
    {
      id: 'srv-2',
      name: 'Certificate of Residency',
      category: 'Document',
      fee: 'FREE / PHP 30.00',
      processingTime: 'Same Day',
      requirements: ['Valid ID or Cedula', 'Certification from Purok Leader', 'At least 6 months residency'],
      description: 'Official proof certifying continuous residency within Barangay San Isidro for bank applications, passport processing, and government aid.'
    },
    {
      id: 'srv-3',
      name: 'Certificate of Indigency',
      category: 'Social Welfare',
      fee: 'FREE',
      processingTime: 'Same Day',
      requirements: ['Case assessment note', 'Valid ID', 'Proof of income or no-income affidavit'],
      description: 'Issued to low-income residents for medical hospital subsidies, burial assistance, and public scholarship application waivers.'
    },
    {
      id: 'srv-4',
      name: 'Business Permit Clearance',
      category: 'Commerce',
      fee: 'PHP 250.00',
      processingTime: '1 to 2 Business Days',
      requirements: ['DTI / SEC Registration', 'Contract of Lease or Title', 'Zoning Compliance Clearance'],
      description: 'Mandatory barangay endorsement required by the City Hall before releasing the Mayor’s Business Permit.'
    },
    {
      id: 'srv-5',
      name: 'Senior Citizen Wellness & Pension Assistance',
      category: 'Elderly Care',
      fee: 'FREE',
      processingTime: 'Ongoing Enrollment',
      requirements: ['Senior Citizen OSCA ID', 'Barangay Residency Certification'],
      description: 'Distribution of monthly maintenance medicine, wellness physical fitness check-ups, and social pension coordination.'
    },
    {
      id: 'srv-6',
      name: 'Youth Leadership & Sports Development Program',
      category: 'Youth',
      fee: 'FREE',
      processingTime: 'Seasonal & Open',
      requirements: ['Youth aged 15-30', 'Barangay ID'],
      description: 'Sangguniang Kabataan (SK) basketball & volleyball leagues, IT literacy bootcamps, and academic scholarship endorsements.'
    }
  ];

  const SEED_OFFICIALS = [
    {
      id: 'off-1',
      name: 'Hon. Roberto M. Mendoza',
      position: 'Punong Barangay (Barangay Captain)',
      contactNumber: '0917-555-0101',
      email: 'captain.mendoza@barangaysanisidro.gov.ph',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'off-2',
      name: 'Hon. Maria Clara Santos',
      position: 'Barangay Kagawad - Committee on Health',
      contactNumber: '0918-555-0102',
      email: 'kagawad.santos@barangaysanisidro.gov.ph',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'off-3',
      name: 'Hon. Danilo R. Cruz',
      position: 'Barangay Kagawad - Committee on Peace & Order',
      contactNumber: '0919-555-0103',
      email: 'kagawad.cruz@barangaysanisidro.gov.ph',
      imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'off-4',
      name: 'Hon. Jennifer P. Reyes',
      position: 'Barangay Kagawad - Committee on Education & Livelihood',
      contactNumber: '0920-555-0104',
      email: 'kagawad.reyes@barangaysanisidro.gov.ph',
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'off-5',
      name: 'Hon. Carlos A. Bautista',
      position: 'SK Chairperson (Youth Council)',
      contactNumber: '0921-555-0105',
      email: 'sk.bautista@barangaysanisidro.gov.ph',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'off-6',
      name: 'Atty. Sofia L. Morales',
      position: 'Barangay Secretary',
      contactNumber: '0922-555-0106',
      email: 'sec.morales@barangaysanisidro.gov.ph',
      imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const SEED_EVENTS = [
    {
      id: 'evt-1',
      title: 'Annual General Barangay Assembly (Ulat sa Bayan)',
      description: 'Accountability reporting of all barangay projects, budget expenditures, and open floor consultation with constituents.',
      date: '2026-11-28',
      time: '9:00 AM - 12:00 PM',
      venue: 'San Isidro Covered Court'
    },
    {
      id: 'evt-2',
      title: 'Anti-Rabies Pet Vaccination Drive',
      description: 'Free rabies vaccination, deworming, and pet microchipping for dogs and cats.',
      date: '2026-12-05',
      time: '8:00 AM - 3:00 PM',
      venue: 'Barangay Health Center Plaza'
    },
    {
      id: 'evt-3',
      title: 'Paskuhan sa Barangay Lighting Ceremony & Gift Giving',
      description: 'Traditional Christmas lighting ceremony with grocery packages for senior citizens and indigent families.',
      date: '2026-12-12',
      time: '6:00 PM - 9:00 PM',
      venue: 'Barangay Hall Grounds'
    }
  ];

  const SEED_REQUESTS = [
    {
      id: 'BRGY-00001',
      fullName: 'Juan Dela Cruz',
      contactNumber: '0917-123-4567',
      address: 'Block 4 Lot 12 Dahlia Street, San Isidro',
      documentType: 'Barangay Clearance',
      purpose: 'Job Application (Local Employment)',
      status: 'Completed',
      dateSubmitted: '2026-11-10',
      timeline: [
        { status: 'Pending', timestamp: '2026-11-10 08:30 AM', note: 'Request submitted online' },
        { status: 'Processing', timestamp: '2026-11-10 10:15 AM', note: 'Records verified by Admin Desk' },
        { status: 'Completed', timestamp: '2026-11-10 03:00 PM', note: 'Document signed and released' }
      ]
    },
    {
      id: 'BRGY-00002',
      fullName: 'Maria Santos',
      contactNumber: '0918-987-6543',
      address: '15 Rosal St., Purok 2, San Isidro',
      documentType: 'Certificate of Residency',
      purpose: 'Bank Account Opening',
      status: 'Processing',
      dateSubmitted: '2026-11-12',
      timeline: [
        { status: 'Pending', timestamp: '2026-11-12 09:10 AM', note: 'Request submitted online' },
        { status: 'Processing', timestamp: '2026-11-12 11:45 AM', note: 'Purok residency verification in progress' }
      ]
    },
    {
      id: 'BRGY-00003',
      fullName: 'Antonio P. Ramos',
      contactNumber: '0922-333-8899',
      address: '88 Sampaguita Avenue, San Isidro',
      documentType: 'Certificate of Indigency',
      purpose: 'Hospital Medical Subsidy',
      status: 'Pending',
      dateSubmitted: '2026-11-14',
      timeline: [
        { status: 'Pending', timestamp: '2026-11-14 02:20 PM', note: 'Request submitted online' }
      ]
    }
  ];

  const SEED_FEEDBACK = [
    {
      id: 'fb-101',
      name: 'Elena Bautista',
      email: 'elena.b@gmail.com',
      category: 'Suggestion',
      subject: 'Extend Health Center vaccination hours on Saturdays',
      message: 'It would really help working parents if the health center could allocate at least half-day Saturday clinics.',
      status: 'Resolved',
      date: '2026-11-09'
    },
    {
      id: 'fb-102',
      name: 'Roberto Tan',
      email: 'rtan@yahoo.com',
      category: 'Report',
      subject: 'Non-functional street light on Corner Jasmin St.',
      message: 'The streetlight near the corner store has been flickering and went dark last night.',
      status: 'Pending',
      date: '2026-11-11'
    },
    {
      id: 'fb-103',
      name: 'Grace Lim',
      email: 'grace.l@outlook.com',
      category: 'Concern',
      subject: 'Inquiry regarding garbage collection schedule during holidays',
      message: 'Will the regular garbage truck schedule be followed during the upcoming holiday weekend? Thank you.',
      status: 'Resolved',
      date: '2026-11-13'
    }
  ];

  const StorageEngine = {
    KEYS: STORAGE_KEYS,
    escapeHtml: escapeHtml,

    init() {
      if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(SEED_SETTINGS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ADMIN)) {
        localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(SEED_ADMIN));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
        localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(SEED_ANNOUNCEMENTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(SEED_SERVICES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.OFFICIALS)) {
        localStorage.setItem(STORAGE_KEYS.OFFICIALS, JSON.stringify(SEED_OFFICIALS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SEED_EVENTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(SEED_REQUESTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) {
        localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(SEED_FEEDBACK));
      }
    },

    get(key, fallback = []) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
      } catch (err) {
        console.error('Storage Read Error:', err);
        return fallback;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (err) {
        console.error('Storage Write Error:', err);
        return false;
      }
    },

    getAnnouncements() { return this.get(STORAGE_KEYS.ANNOUNCEMENTS, []); },
    getRequests() { return this.get(STORAGE_KEYS.REQUESTS, []); },
    getOfficials() { return this.get(STORAGE_KEYS.OFFICIALS, []); },
    getFeedback() { return this.get(STORAGE_KEYS.FEEDBACK, []); },
    getEvents() { return this.get(STORAGE_KEYS.EVENTS, []); },
    getServices() { return this.get(STORAGE_KEYS.SERVICES, []); },
    getSettings() { return this.get(STORAGE_KEYS.SETTINGS, SEED_SETTINGS); },

    generateNextRequestId() {
      const requests = this.getRequests();
      let maxNum = 0;
      requests.forEach(r => {
        const match = String(r.id).match(/BRGY-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      });
      const nextNum = maxNum + 1;
      return 'BRGY-' + String(nextNum).padStart(5, '0');
    },

    getStats() {
      const announcements = this.getAnnouncements();
      const requests = this.getRequests();
      const feedback = this.getFeedback();
      const officials = this.getOfficials();
      const events = this.getEvents();
      const services = this.getServices();

      return {
        totalAnnouncements: announcements.length,
        totalRequests: requests.length,
        totalFeedback: feedback.length,
        totalOfficials: officials.length,
        totalEvents: events.length,
        totalServices: services.length,
        pendingRequests: requests.filter(r => r.status === 'Pending').length,
        completedRequests: requests.filter(r => r.status === 'Completed').length,
        resolvedFeedback: feedback.filter(f => f.status === 'Resolved').length
      };
    },

    resetToDemoData() {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(SEED_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(SEED_ADMIN));
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(SEED_ANNOUNCEMENTS));
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(SEED_SERVICES));
      localStorage.setItem(STORAGE_KEYS.OFFICIALS, JSON.stringify(SEED_OFFICIALS));
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SEED_EVENTS));
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(SEED_REQUESTS));
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(SEED_FEEDBACK));
    }
  };

  StorageEngine.init();
  window.BarangayStorage = StorageEngine;

})(window);

