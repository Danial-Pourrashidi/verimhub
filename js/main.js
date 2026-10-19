/**
 * VerimHub - Core Client Logic
 * Features: Dark/Light Mode, Instant Search, Reading Progress, Cookie Consent, FAQ Accordions
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSearch();
  initCategoryFilters();
  initReadingProgress();
  initTableOfContents();
  initFAQAccordion();
  initCookieConsent();
});

/* ==========================================================================
   1. THEME MANAGEMENT (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const storedTheme = localStorage.getItem('vh_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme);
    updateThemeIcon(storedTheme);
  } else if (systemPrefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcon('light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('vh_theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(newTheme === 'dark' ? 'Karanlık tema aktif edildi' : 'Aydınlık tema aktif edildi');
    });
  }
}

function updateThemeIcon(theme) {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;
  if (theme === 'dark') {
    themeToggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>`;
    themeToggleBtn.setAttribute('title', 'Aydınlık Mod');
  } else {
    themeToggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>`;
    themeToggleBtn.setAttribute('title', 'Karanlık Mod');
  }
}

/* ==========================================================================
   2. INSTANT LIVE SEARCH
   ========================================================================== */
function initSearch() {
  const searchInput = document.getElementById('heroSearchInput');
  const articlesContainer = document.getElementById('articlesGrid');
  if (!searchInput || !articlesContainer) return;

  const articleCards = articlesContainer.querySelectorAll('.article-card');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    let matchCount = 0;

    articleCards.forEach(card => {
      const title = card.querySelector('.card-title')?.innerText.toLowerCase() || '';
      const excerpt = card.querySelector('.card-excerpt')?.innerText.toLowerCase() || '';
      const category = card.querySelector('.badge')?.innerText.toLowerCase() || '';

      if (title.includes(query) || excerpt.includes(query) || category.includes(query)) {
        card.style.display = 'flex';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const noResultsMsg = document.getElementById('noResultsMsg');
    if (noResultsMsg) {
      noResultsMsg.style.display = matchCount === 0 ? 'block' : 'none';
    }
  });
}

/* ==========================================================================
   3. CATEGORY FILTER TAGS
   ========================================================================== */
function initCategoryFilters() {
  const filterTags = document.querySelectorAll('.filter-tag');
  const articlesContainer = document.getElementById('articlesGrid');
  if (!filterTags.length || !articlesContainer) return;

  const articleCards = articlesContainer.querySelectorAll('.article-card');

  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');

      const selectedCat = tag.getAttribute('data-category');

      articleCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (selectedCat === 'all' || cardCat === selectedCat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. READING PROGRESS BAR
   ========================================================================== */
function initReadingProgress() {
  const progressBar = document.getElementById('readingProgressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

/* ==========================================================================
   5. TABLE OF CONTENTS ACTIVE SPY & SMOOTH SCROLL
   ========================================================================== */
function initTableOfContents() {
  const tocLinks = document.querySelectorAll('.toc-list a');
  if (!tocLinks.length) return;

  const headings = Array.from(document.querySelectorAll('.article-body h2, .article-body h3'));

  window.addEventListener('scroll', () => {
    let currentActive = null;
    const scrollPosition = window.scrollY + 140;

    headings.forEach(heading => {
      if (heading.offsetTop <= scrollPosition) {
        currentActive = heading.getAttribute('id');
      }
    });

    tocLinks.forEach(link => {
      if (currentActive && link.getAttribute('href') === `#${currentActive}`) {
        link.style.color = 'var(--primary)';
        link.style.fontWeight = '700';
      } else {
        link.style.color = '';
        link.style.fontWeight = '';
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   6. FAQ ACCORDION INTERACTION
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. GDPR / KVKK COOKIE CONSENT BANNER
   ========================================================================== */
function initCookieConsent() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  const consentStatus = localStorage.getItem('vh_cookie_consent');
  if (!consentStatus) {
    setTimeout(() => {
      banner.style.display = 'block';
    }, 1200);
  }

  const acceptBtn = document.getElementById('cookieAcceptBtn');
  const declineBtn = document.getElementById('cookieDeclineBtn');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('vh_cookie_consent', 'accepted');
      banner.style.display = 'none';
      showToast('Çerez tercihleriniz kaydedildi.');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('vh_cookie_consent', 'declined');
      banner.style.display = 'none';
      showToast('Yalnızca zorunlu çerezler kullanılacaktır.');
    });
  }
}

/* ==========================================================================
   8. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-box';
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
