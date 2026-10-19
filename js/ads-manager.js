/**
 * VerimHub - Google AdSense Architecture & Placement Manager
 * Designed for: High Viewability, Zero CLS, Core Web Vitals Optimization
 */

const ADSENSE_CONFIG = {
  // Canlıya geçildiğinde buraya yayıncı kimliğinizi giriniz:
  publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
  isLive: false, // AdSense onaylandıktan sonra true yapın
  testMode: true
};

document.addEventListener('DOMContentLoaded', () => {
  initAdPlacements();
  initAdViewabilityTracker();
});

function initAdPlacements() {
  const adContainers = document.querySelectorAll('.ad-container');

  adContainers.forEach(container => {
    const slotType = container.getAttribute('data-ad-slot') || 'responsive';
    
    if (ADSENSE_CONFIG.isLive && ADSENSE_CONFIG.publisherId !== 'ca-pub-XXXXXXXXXXXXXXXX') {
      // Canlı Google AdSense Entegrasyonu
      container.innerHTML = `
        <span class="ad-label">REKLAM / SPONSORLU</span>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${ADSENSE_CONFIG.publisherId}"
             data-ad-slot="1234567890"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      `;
      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn('AdSense load error:', e);
      }
    } else {
      // Demo / Test / Simülasyon Görünümü (CLS olmadan mükemmel boyutlandırma)
      // Kullanıcıya reklam yerleşimlerinin tam nereye oturduğunu gösterir
      applySimulatedAdStyle(container, slotType);
    }
  });
}

function applySimulatedAdStyle(container, slotType) {
  let title = 'Google AdSense Stratejik Alanı';
  let desc = 'TBM Optimizasyonlu Responsive Görüntülü Reklam';

  if (slotType === 'sticky-sidebar') {
    title = 'Dikey Yapışkan Reklam (300x600)';
    desc = 'Sayfa ile kayan, %75+ Viewability sağlayan yüksek TBM birimi.';
  } else if (slotType === 'in-article-top') {
    title = 'Yazı Başı Premium Alanı';
    desc = 'İlk ekran altı, okuyucunun doğrudan gördüğü yüksek teklifli alan.';
  } else if (slotType === 'in-article-mid') {
    title = 'İçerik İçi Doğal (In-Article) Reklam';
    desc = 'Akışla uyumlu, kullanıcıyı rahatsız etmeyen yüksek CTR birimi.';
  }

  container.innerHTML = `
    <span class="ad-label">SPONSORLU ALAN • ADSENSE PREVIEW</span>
    <div class="ad-placeholder">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
      <div>
        <strong style="display:block; font-size:0.9rem; color:var(--text-primary); margin-bottom:0.25rem;">${title}</strong>
        <p>${desc}</p>
      </div>
    </div>
  `;
}

/**
 * Viewability Tracker:
 * Google AdSense reklamvereni görünür reklamlar için daha fazla öder.
 * Bu IntersectionObserver ile reklam görünürlük metrikleri izlenir.
 */
function initAdViewabilityTracker() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        entry.target.classList.add('ad-viewable');
      }
    });
  }, { threshold: [0.5] });

  document.querySelectorAll('.ad-container').forEach(ad => observer.observe(ad));
}
