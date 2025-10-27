/* scripts.js - extracted from inline script with mobile menu handling */
(function () {
  const header = document.getElementById('site-header');
  const navItems = document.querySelectorAll('nav ul li.nav-item');
  const navList = document.getElementById('nav-list');
  const menuBtn = document.getElementById('menu-toggle');

  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }

  // Staggered reveal of nav items after DOM loads (desktop)
  function revealNav() {
    // only stagger on md+ (desktop) for nicer effect
    if (window.matchMedia('(min-width: 768px)').matches) {
      navItems.forEach((li, i) => setTimeout(() => li.classList.add('visible'), i * 80));
    } else {
      // on mobile ensure they are not hidden when the panel opens; keep default visible state
      navItems.forEach(li => li.classList.remove('visible'));
    }
  }

  function openMenu() {
    if (!navList || !menuBtn) return;
    navList.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    // make nav items instantly visible inside panel
    navItems.forEach((li, i) => setTimeout(() => li.classList.add('visible'), i * 40));
    // add one-time document listener to detect outside clicks
    setTimeout(() => document.addEventListener('click', onDocClick), 0);
  }

  function closeMenu() {
    if (!navList || !menuBtn) return;
    navList.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    // remove visible state for mobile so next open can animate
    navItems.forEach(li => li.classList.remove('visible'));
    document.removeEventListener('click', onDocClick);
  }

  function toggleMenu() {
    if (!navList) return;
    if (navList.classList.contains('open')) closeMenu();
    else openMenu();
  }

  function onDocClick(e) {
    // close when clicking outside the navList and menu button
    if (!navList || !menuBtn) return;
    if (navList.contains(e.target) || menuBtn.contains(e.target)) return;
    closeMenu();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') closeMenu();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('DOMContentLoaded', () => {
    revealNav();
    // initial check in case page is loaded scrolled
    onScroll();

    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });
    }

    // close on Escape
    document.addEventListener('keydown', onKeyDown);

    // When resizing, if moving to desktop remove mobile panel state
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // if now desktop, ensure nav-list is visible as flex and items are visible
        if (window.matchMedia('(min-width: 768px)').matches) {
          navList.classList.remove('open');
          navItems.forEach(li => li.classList.add('visible'));
          if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
          document.removeEventListener('click', onDocClick);
        } else {
          // smaller than md
          navItems.forEach(li => li.classList.remove('visible'));
        }
      }, 120);
    });

    // focus/blur accessibility handling for keyboard users
    document.querySelectorAll('a.nav-link').forEach(a => {
      a.addEventListener('focus', () => a.classList.add('focused'));
      a.addEventListener('blur', () => a.classList.remove('focused'));
    });
  });
})();
