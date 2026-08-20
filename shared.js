/* shared.js — KRTF website common scripts */
(function () {
  'use strict';

  /* ── Fonts preload helper ── */
  var link = document.querySelector('link[data-fonts]');
  if (link) { link.media = 'all'; }

  /* ── Scroll progress bar ── */
  var bar = document.getElementById('scrollbar');
  var hdr = document.getElementById('siteHeader');
  if (bar && hdr) {
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      var pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = pct + '%';
      hdr.classList.toggle('scrolled', h.scrollTop > 60);
    }, { passive: true });
  }

  /* ── Dark mode ── */
  var modeBtn = document.getElementById('modeBtn');
  if (modeBtn) {
    var dark = false;
    modeBtn.addEventListener('click', function () {
      dark = !dark;
      document.body.classList.toggle('dark', dark);
      modeBtn.textContent = dark ? '☀️' : '🌙';
      modeBtn.setAttribute('aria-pressed', dark);
      modeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Toggle dark mode');
    });
  }

  /* ── Mobile nav ── */
  var burger = document.getElementById('burger');
  var mobileNav = document.getElementById('mobileNav');
  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ── Reveal on scroll ── */
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(function (el) { ro.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ── Counter animation ── */
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        if (reduced) { el.textContent = target + suffix; co.unobserve(el); return; }
        var start = performance.now();
        (function tick(now) {
          var p = Math.min((now - start) / 1300, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (p < 1) { requestAnimationFrame(tick); }
          else { el.textContent = target + suffix; }
        })(start);
        co.unobserve(el);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('[data-count]').forEach(function (el) { co.observe(el); });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-btn').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        var ans = document.getElementById(b.getAttribute('aria-controls'));
        if (ans) ans.hidden = true;
      });
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        var myAns = document.getElementById(btn.getAttribute('aria-controls'));
        if (myAns) myAns.hidden = false;
      }
    });
  });

  /* ── Contact form ── */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('submitBtn');
      if (btn) { btn.textContent = 'Message Sent ✓'; btn.disabled = true; }
      form.reset();
      if (typeof gtag === 'function') {
        gtag('event', 'form_submit', { event_category: 'Contact', event_label: 'KRTF Contact Form' });
      }
      setTimeout(function () {
        if (btn) { btn.textContent = 'Send Message'; btn.disabled = false; }
      }, 3500);
    });
  }

  /* ── GA4 outbound tracking ── */
  document.querySelectorAll('a[href*="krtcodisha.com"]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'outbound_link_click', { event_category: 'Outbound', event_label: a.href, transport_type: 'beacon' });
      }
    });
  });

})();
