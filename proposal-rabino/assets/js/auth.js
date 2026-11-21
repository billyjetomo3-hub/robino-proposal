/**
 * BARANGAY PORTAL — DEMO AUTHENTICATION ENGINE
 * Demonstrates session handling, login verification, route protection, and logout.
 * 
 * SECURITY DISCLAIMER: This is a frontend demonstration system using LocalStorage & SessionStorage.
 * Real government deployment requires enterprise backend server authentication and RBAC.
 */

(function (window) {
  'use strict';

  const SESSION_KEY = 'barangay_admin_session';

  const AuthEngine = {
    login(username, password) {
      const adminCreds = window.BarangayStorage.get(window.BarangayStorage.KEYS.ADMIN, {
        username: 'admin',
        passwordHash: 'admin123',
        name: 'Administrator'
      });

      if (username.trim().toLowerCase() === adminCreds.username.toLowerCase() && password === adminCreds.passwordHash) {
        const sessionData = {
          username: adminCreds.username,
          name: adminCreds.name || 'Administrator',
          loginTime: Date.now(),
          token: 'DEMO-AUTH-TOKEN-' + Math.random().toString(36).substring(2)
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        if (window.BarangaySound) {
          window.BarangaySound.play('success');
        }
        return { success: true };
      } else {
        if (window.BarangaySound) {
          window.BarangaySound.play('error');
        }
        return { success: false, message: 'Invalid username or password. (Demo: admin / admin123)' };
      }
    },

    isAuthenticated() {
      try {
        const session = sessionStorage.getItem(SESSION_KEY);
        if (!session) return false;
        const data = JSON.parse(session);
        // Expiration check (8 hours)
        if (Date.now() - data.loginTime > 8 * 3600 * 1000) {
          this.logout();
          return false;
        }
        return true;
      } catch (e) {
        return false;
      }
    },

    getCurrentUser() {
      try {
        const session = sessionStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
      } catch (e) {
        return null;
      }
    },

    logout() {
      if (window.BarangaySound) {
        window.BarangaySound.play('logout');
      }
      sessionStorage.removeItem(SESSION_KEY);
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 250);
    },

    requireAuth() {
      if (!this.isAuthenticated()) {
        window.location.replace('login.html?unauthorized=true');
      }
    }
  };

  window.BarangayAuth = AuthEngine;

})(window);
