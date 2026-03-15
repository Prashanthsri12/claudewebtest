/* ============================================================
   PRITHVI CLINIC — SHARED JAVASCRIPT
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll ────────────────────────────────────────
  const navbar    = document.getElementById('navbar');
  const scrollBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (navbar)    navbar.classList.toggle('scrolled', window.scrollY > 80);
    if (scrollBtn) scrollBtn.classList.toggle('visible', window.scrollY > 400);
    updateActiveNav();
  });

  // ── Active nav link ──────────────────────────────────────
  function updateActiveNav() {
    const links   = document.querySelectorAll('.nav-links > a');
    const sections= document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) current = s.id; });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current || l.getAttribute('href') === './#' + current));
  }

  // ── Hamburger / Mobile Nav ───────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  // ── Scroll Reveal ────────────────────────────────────────
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Counter Animation ────────────────────────────────────
  let counted = false;
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !counted) {
        counted = true;
        document.querySelectorAll('.counter').forEach(counter => {
          const target = parseInt(counter.dataset.target, 10);
          const duration = 1800;
          const step = target / (duration / 16);
          let cur = 0;
          const t = setInterval(() => {
            cur += step;
            if (cur >= target) { cur = target; clearInterval(t); }
            counter.textContent = Math.floor(cur);
          }, 16);
        });
      }
    });
  }, { threshold: 0.5 });
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) counterObs.observe(statsBar);

  // ── Smooth Scroll ────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  // ── Scroll to Top ────────────────────────────────────────
  if (scrollBtn) scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── Testimonials Slider ──────────────────────────────────
  const track = document.querySelector('.testimonials-track');
  if (track) {
    const cards   = track.querySelectorAll('.testimonial-card');
    const dots    = document.querySelectorAll('.t-dot');
    const prevBtn = document.getElementById('tPrev');
    const nextBtn = document.getElementById('tNext');
    let idx = 0;
    const perView = () => window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;

    function go(n) {
      const pv = perView();
      const max = Math.max(0, cards.length - pv);
      idx = Math.max(0, Math.min(n, max));
      const w = track.parentElement.offsetWidth;
      const gap = 24;
      const cardW = (w - gap * (pv - 1)) / pv;
      track.style.transform = `translateX(-${idx * (cardW + gap)}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
    if (prevBtn) prevBtn.addEventListener('click', () => go(idx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(idx + 1));
    window.addEventListener('resize', () => go(idx));

    // Auto-advance
    setInterval(() => go(idx + 1 > Math.max(0, cards.length - perView()) ? 0 : idx + 1), 5000);
  }

  // ── Blog Filter ──────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const blogCards  = document.querySelectorAll('.blog-card[data-cat]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      blogCards.forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
      });
    });
  });

  // ── Appointment Form ─────────────────────────────────────
  const apptForm = document.getElementById('appointmentForm');
  if (apptForm) {
    const form       = apptForm.querySelector('form');
    const successDiv = document.getElementById('formSuccess');
    if (form) {
      // Set min date
      const dateInput = form.querySelector('input[type="date"]');
      if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

      form.addEventListener('submit', e => {
        e.preventDefault();
        if (window.location.hostname === 'localhost' || window.location.protocol === 'file:') {
          apptForm.style.display = 'none';
          if (successDiv) successDiv.style.display = 'block';
          return;
        }
        fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() })
          .finally(() => { apptForm.style.display = 'none'; if (successDiv) successDiv.style.display = 'block'; });
      });
    }
  }

  // ── Close mobile nav helper ──────────────────────────────
  window.closeMobileNav = function() {
    if (mobileNav)  mobileNav.classList.remove('open');
    if (hamburger)  hamburger.classList.remove('active');
    document.body.style.overflow = '';
  };

});
