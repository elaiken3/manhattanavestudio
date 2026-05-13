'use strict';

/* ── Analytics helper ───────────────────────────────── */
/* Safe wrapper around gtag — no-ops if GA isn't loaded (dev, ad-blockers). */
function track(event, params = {}) {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, params);
    }
  } catch (_) { /* swallow */ }
}

/* Footer year */
const yr = document.getElementById('currentYear');
if (yr) yr.textContent = new Date().getFullYear();

/* ── Mobile nav ─────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open);
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });
}

/* ── Active nav on scroll ───────────────────────────── */
(function () {
  const sections  = document.querySelectorAll('section[id]');
  const anchors   = document.querySelectorAll('.nav__link');
  if (!sections.length || !anchors.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        anchors.forEach(a => {
          const active = a.getAttribute('href') === `#${id}`;
          a.classList.toggle('is-active', active);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
})();

/* ── Scroll animations ──────────────────────────────── */
(function () {
  const targets = document.querySelectorAll('.fade-in');
  if (!targets.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));
})();

/* ── CTA + outbound click tracking ──────────────────── */
(function () {
  document.querySelectorAll('[data-cta]').forEach(el => {
    el.addEventListener('click', () => {
      track('cta_click', {
        cta_label: el.dataset.cta,
        link_text: (el.textContent || '').trim().slice(0, 80),
        link_url:  el.getAttribute('href') || ''
      });
    });
  });

  document.querySelectorAll('[data-outbound], a[href^="http"]').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (!/^https?:\/\//i.test(href)) return;
    if (/manhattanavestudio\.com/i.test(href)) return;
    a.addEventListener('click', () => {
      track('outbound_click', {
        outbound_label: a.dataset.outbound || '',
        link_url:       href,
        link_domain:    (() => { try { return new URL(href).hostname; } catch (_) { return ''; } })()
      });
    });
  });
})();

/* ── Scroll depth tracking (25/50/75/100) ───────────── */
(function () {
  const marks = [25, 50, 75, 100];
  const fired = new Set();
  let ticking = false;

  function check() {
    ticking = false;
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const height    = doc.scrollHeight - doc.clientHeight;
    if (height <= 0) return;
    const pct = Math.min(100, Math.round((scrollTop / height) * 100));
    marks.forEach(m => {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        track('scroll_depth', { percent: m });
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(check); ticking = true; }
  }, { passive: true });
})();

/* ── Contact form ───────────────────────────────────── */
(function () {
  const form      = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const btnText   = submitBtn.querySelector('.btn__text');
  const btnLoad   = submitBtn.querySelector('.btn__loading');
  const feedback  = document.getElementById('formFeedback');

  let formStarted = false;

  function showError(inputId, errId, msg) {
    const el  = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (!el || !err) return;
    el.classList.add('is-invalid');
    el.setAttribute('aria-invalid', 'true');
    err.textContent = msg;
  }

  function clearError(inputId, errId) {
    const el  = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (!el || !err) return;
    el.classList.remove('is-invalid');
    el.removeAttribute('aria-invalid');
    err.textContent = '';
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validate(data) {
    let ok = true;
    const errors = [];

    clearError('name', 'nameError');
    if (!data.name.trim()) {
      showError('name', 'nameError', 'Please enter your name.'); ok = false; errors.push('name');
    }

    clearError('email', 'emailError');
    if (!data.email.trim()) {
      showError('email', 'emailError', 'Please enter your email address.'); ok = false; errors.push('email_missing');
    } else if (!isValidEmail(data.email)) {
      showError('email', 'emailError', 'Please enter a valid email address.'); ok = false; errors.push('email_invalid');
    }

    clearError('message', 'messageError');
    if (!data.message.trim()) {
      showError('message', 'messageError', 'Please tell us about your project.'); ok = false; errors.push('message_missing');
    } else if (data.message.trim().length < 10) {
      showError('message', 'messageError', 'Please add a bit more detail.'); ok = false; errors.push('message_short');
    }

    if (!ok) track('form_error', { fields: errors.join(',') });
    return ok;
  }

  function setLoading(v) {
    submitBtn.disabled = v;
    submitBtn.setAttribute('aria-busy', v);
    btnText.hidden = v;
    btnLoad.hidden = !v;
  }

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className   = `form-feedback is-${type}`;
    feedback.hidden      = false;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // form_start — fires once on first focus inside the form
  form.addEventListener('focusin', () => {
    if (!formStarted) {
      formStarted = true;
      track('form_start', { form_id: 'contactForm' });
    }
  }, { once: false });

  ['name', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => {
      clearError(id, `${id}Error`);
      feedback.hidden = true;
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const data = {
      name:    form.name.value,
      email:   form.email.value,
      project: form.project ? form.project.value : '',
      message: form.message.value,
      website: form.website ? form.website.value : '',
    };

    // Honeypot
    if (data.website) {
      showFeedback("Message sent! We'll be in touch soon.", 'success');
      form.reset();
      return;
    }

    if (!validate(data)) return;

    setLoading(true);
    feedback.hidden = true;

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:    data.name.trim(),
          email:   data.email.trim(),
          message: `${data.project ? `Project type: ${data.project}\n\n` : ''}${data.message.trim()}`,
        }),
      });

      if (!res.ok) throw new Error(`${res.status}`);

      // GA4 recommended lead event
      track('generate_lead', {
        currency:     'USD',
        value:        1,
        project_type: data.project || 'unspecified',
        form_id:      'contactForm'
      });

      showFeedback("Message received! We'll get back to you within one business day.", 'success');
      form.reset();

    } catch (err) {
      console.error('Form error:', err);
      track('form_submit_error', { message: String(err).slice(0, 120) });
      showFeedback(
        'Something went wrong. Please try emailing us directly at hello@manhattanavestudio.com',
        'error'
      );
    } finally {
      setLoading(false);
    }
  });
})();
