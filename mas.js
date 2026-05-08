'use strict';

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
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
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

/* ── Contact form ───────────────────────────────────── */
(function () {
  const form      = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const btnText   = submitBtn.querySelector('.btn__text');
  const btnLoad   = submitBtn.querySelector('.btn__loading');
  const feedback  = document.getElementById('formFeedback');

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

    clearError('name', 'nameError');
    if (!data.name.trim()) {
      showError('name', 'nameError', 'Please enter your name.'); ok = false;
    }

    clearError('email', 'emailError');
    if (!data.email.trim()) {
      showError('email', 'emailError', 'Please enter your email address.'); ok = false;
    } else if (!isValidEmail(data.email)) {
      showError('email', 'emailError', 'Please enter a valid email address.'); ok = false;
    }

    clearError('message', 'messageError');
    if (!data.message.trim()) {
      showError('message', 'messageError', 'Please tell us about your project.'); ok = false;
    } else if (data.message.trim().length < 10) {
      showError('message', 'messageError', 'Please add a bit more detail.'); ok = false;
    }

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

      showFeedback("Message received! We'll get back to you within one business day.", 'success');
      form.reset();

    } catch (err) {
      console.error('Form error:', err);
      showFeedback(
        'Something went wrong. Please try emailing us directly at hello@manhattanavestudio.com',
        'error'
      );
    } finally {
      setLoading(false);
    }
  });
})();
