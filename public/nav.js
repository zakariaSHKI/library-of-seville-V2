// Mobile Navigation Toggle — shared across all pages
(function () {
  const navbarToggle = document.getElementById('navbarToggle');
  const navbarMenu = document.getElementById('navbarMenu');

  if (!navbarToggle || !navbarMenu) return;

  function closeMenu() {
    navbarToggle.setAttribute('aria-expanded', 'false');
    navbarMenu.classList.remove('open');
  }

  navbarToggle.addEventListener('click', () => {
    const isExpanded = navbarToggle.getAttribute('aria-expanded') === 'true';
    navbarToggle.setAttribute('aria-expanded', String(!isExpanded));
    navbarMenu.classList.toggle('open');
  });

  // Close menu when clicking a nav link
  navbarMenu.querySelectorAll('.navbar-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navbarMenu.classList.contains('open') &&
        !navbarMenu.contains(e.target) &&
        !navbarToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbarMenu.classList.contains('open')) {
      closeMenu();
      navbarToggle.focus();
    }
  });
})();
