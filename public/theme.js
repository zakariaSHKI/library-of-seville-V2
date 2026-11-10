// Theme Manager (Light / Dark Mode)
(function () {
  const STORAGE_KEY = 'los_theme';

  function getSavedTheme() {
    try {
      // Check query parameter ?theme=dark or ?theme=light (useful for testing/sharing)
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get('theme');
      if (urlTheme === 'dark' || urlTheme === 'light') {
        try { localStorage.setItem(STORAGE_KEY, urlTheme); } catch (e) {}
        return urlTheme;
      }
    } catch (e) {}

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {}

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  let currentTheme = document.documentElement.getAttribute('data-theme') || getSavedTheme();

  function updateButtons(theme) {
    const isDark = (theme === 'dark');
    let label = '';
    if (window.t) {
      label = isDark ? window.t('nav.themeLight') : window.t('nav.themeDark');
    }
    if (!label) {
      const isAr = (document.documentElement.lang === 'ar' || document.documentElement.dir === 'rtl');
      label = isDark
        ? (isAr ? 'تفعيل الوضع النهاري' : 'Switch to light mode')
        : (isAr ? 'تفعيل الوضع الليلي' : 'Switch to dark mode');
    }

    document.querySelectorAll('.theme-toggle').forEach((btn) => {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
      btn.setAttribute('data-theme-current', theme);
    });
  }

  function applyTheme(theme, save = true) {
    currentTheme = (theme === 'dark') ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (save) {
      try {
        localStorage.setItem(STORAGE_KEY, currentTheme);
      } catch (e) {}
    }
    updateButtons(currentTheme);
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: currentTheme } }));
  }

  function toggleTheme() {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
  }

  function init() {
    applyTheme(currentTheme, false);

    // Event delegation for any .theme-toggle button in DOM
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-toggle');
      if (btn) {
        e.preventDefault();
        toggleTheme();
      }
    });

    // Update localized button labels when language changes
    window.addEventListener('languageChanged', () => {
      updateButtons(currentTheme);
    });

    // Listen to OS theme changes if user hasn't explicitly set a preference
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        try {
          if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light', false);
          }
        } catch (err) {}
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.themeManager = {
    getTheme: () => currentTheme,
    setTheme: applyTheme,
    toggleTheme: toggleTheme
  };
})();
