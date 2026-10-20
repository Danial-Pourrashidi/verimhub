/**
 * VerimHub - Google Analytics 4 (GA4) & Search Console Tracker
 * Bu dosya sitenizin tüm sayfalarında GA4 izlemesini yönetir.
 * 
 * Kurulum:
 * 1. analytics.google.com adresinden aldığınız "G-XXXXXXXXXX" kodunu aşağıdaki GA4_MEASUREMENT_ID alanına yapıştırın.
 */

const GA4_MEASUREMENT_ID = 'G-NPHWJVXM1R'; // Canlı Google Analytics 4 Ölçüm Kimliği

(function initGoogleAnalytics() {
  if (!GA4_MEASUREMENT_ID || GA4_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    // Henüz GA4 kodu girilmediyse konsolda bilgi ver
    console.info('[VerimHub GA4]: Google Analytics kimliği bekleniyor (G-XXXXXXXXXX).');
    return;
  }

  // Google gtag.js dinamik yükleme
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', GA4_MEASUREMENT_ID, {
    send_page_view: true,
    cookie_flags: 'SameSite=None;Secure'
  });

  console.log('[VerimHub GA4]: Google Analytics 4 başarıyla aktif edildi.');
})();
