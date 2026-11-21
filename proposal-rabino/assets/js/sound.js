/**
 * BARANGAY PORTAL — WEB AUDIO API SYNTHESIZER
 * Zero external audio dependencies. Programmatic sound generation.
 */

(function (window) {
  'use strict';

  let audioCtx = null;
  let lastHoverTime = 0;

  function getSoundState() {
    const pref = localStorage.getItem('barangay_sound_enabled');
    return pref === null ? true : pref === 'true';
  }

  function getVolume() {
    const vol = parseFloat(localStorage.getItem('barangay_sound_volume'));
    return isNaN(vol) ? 0.22 : Math.max(0, Math.min(1, vol));
  }

  const SoundSystem = {
    enabled: getSoundState(),
    volume: getVolume(),

    init() {
      if (!audioCtx) {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (AudioCtxClass) {
          audioCtx = new AudioCtxClass();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    },

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('barangay_sound_enabled', this.enabled ? 'true' : 'false');
      if (this.enabled) {
        this.play('notification');
      }
      return this.enabled;
    },

    setVolume(newVol) {
      this.volume = Math.max(0, Math.min(1, newVol));
      localStorage.setItem('barangay_sound_volume', this.volume.toString());
    },

    play(soundType) {
      if (!this.enabled) return;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const nowMs = Date.now();
      if (soundType === 'hover') {
        if (nowMs - lastHoverTime < 120) return;
        lastHoverTime = nowMs;
      }

      try {
        const ctx = this.init();
        if (!ctx) return;

        const now = ctx.currentTime;
        const mainGain = ctx.createGain();
        mainGain.gain.setValueAtTime(this.volume, now);
        mainGain.connect(ctx.destination);

        switch (soundType) {
          case 'click': {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(650, now);
            osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);
            gain.gain.setValueAtTime(0.7, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
            osc.connect(gain);
            gain.connect(mainGain);
            osc.start(now);
            osc.stop(now + 0.065);
            break;
          }

          case 'hover': {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.connect(gain);
            gain.connect(mainGain);
            osc.start(now);
            osc.stop(now + 0.045);
            break;
          }

          case 'success': {
            [523.25, 659.25].forEach((freq, i) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              const startTime = now + i * 0.09;
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(freq, startTime);
              gain.gain.setValueAtTime(0.6, startTime);
              gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.16);
              osc.connect(gain);
              gain.connect(mainGain);
              osc.start(startTime);
              osc.stop(startTime + 0.17);
            });
            break;
          }

          case 'error': {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.14);
            gain.gain.setValueAtTime(0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
            osc.connect(gain);
            gain.connect(mainGain);
            osc.start(now);
            osc.stop(now + 0.15);
            break;
          }

          case 'warning': {
            [440, 415.3].forEach((freq, i) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              const startTime = now + i * 0.08;
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, startTime);
              gain.gain.setValueAtTime(0.4, startTime);
              gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
              osc.connect(gain);
              gain.connect(mainGain);
              osc.start(startTime);
              osc.stop(startTime + 0.11);
            });
            break;
          }

          case 'notification': {
            [587.33, 880].forEach((freq, i) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              const startTime = now + i * 0.07;
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, startTime);
              gain.gain.setValueAtTime(0.5, startTime);
              gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
              osc.connect(gain);
              gain.connect(mainGain);
              osc.start(startTime);
              osc.stop(startTime + 0.22);
            });
            break;
          }

          case 'modalOpen': {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(480, now + 0.09);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
            osc.connect(gain);
            gain.connect(mainGain);
            osc.start(now);
            osc.stop(now + 0.095);
            break;
          }

          case 'pageTransition': {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.exponentialRampToValueAtTime(360, now + 0.12);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            osc.connect(gain);
            gain.connect(mainGain);
            osc.start(now);
            osc.stop(now + 0.13);
            break;
          }

          case 'logout': {
            [520, 390, 260].forEach((freq, i) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              const startTime = now + i * 0.08;
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, startTime);
              gain.gain.setValueAtTime(0.4, startTime);
              gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);
              osc.connect(gain);
              gain.connect(mainGain);
              osc.start(startTime);
              osc.stop(startTime + 0.13);
            });
            break;
          }
        }
      } catch (err) {
        // Silently catch audio restrictions
      }
    }
  };

  window.BarangaySound = SoundSystem;

})(window);
