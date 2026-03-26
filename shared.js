/* ============================================
   GAMEDB — SHARED JS UTILITIES
   ============================================ */

/* ---- SCROLL PROGRESS BAR ---- */
(function() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

/* ---- CUSTOM CURSOR (desktop only) ---- */
(function() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const dot = document.createElement('div'); dot.className = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }, { passive: true });
  function animateRing() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
  document.querySelectorAll('a, button, .game-card, .fav-card, .lib-btn, .filter-toggle').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
})();

/* ---- HEADER SCROLL ---- */
(function() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---- MOBILE NAV ---- */
(function() {
  const btn = document.getElementById('navHamburger');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); btn.classList.remove('open');
  }));
})();

/* ---- SCROLL REVEAL (IntersectionObserver) ---- */
(function() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!targets.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(t => obs.observe(t));
})();

/* ---- TOAST SYSTEM ---- */
window.GameDB = window.GameDB || {};
(function() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);

  window.GameDB.toast = function(title, msg, type = 'success', duration = 3500) {
    const icons = { success: '✓', info: 'ℹ', warn: '⚠' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span class="toast-icon">${icons[type] || '✓'}</span><div class="toast-body"><div class="toast-title">${title}</div>${msg ? `<div class="toast-msg">${msg}</div>` : ''}</div>`;
    container.appendChild(t);
    requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')); });
    setTimeout(() => {
      t.classList.remove('show'); t.classList.add('hide');
      setTimeout(() => t.remove(), 450);
    }, duration);
  };
})();

/* ---- RIPPLE EFFECT on buttons ---- */
(function() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-accent, .btn-outline, .lib-btn, .btn-accent-sm');
    if (!btn) return;
    const r = document.createElement('span'); r.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
    btn.style.position = 'relative'; btn.style.overflow = 'hidden';
    btn.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });
})();

/* ---- PAGE TRANSITION on nav links ---- */
(function() {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('fading');
      setTimeout(() => { window.location.href = href; }, 200);
    });
  });
  window.addEventListener('pageshow', () => {
    overlay.classList.remove('fading');
  });
})();

/* ---- COUNTER ANIMATION ---- */
window.GameDB.animateCounter = function(el, target, suffix = '', duration = 1400) {
  let start = null;
  const startVal = 0;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(startVal + (target - startVal) * eased) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
};
