/* =============================
   Az Agent — Danijel Mrkonjić | script.js
   (originalni dizajn Ivan Horvat, podaci zamijenjeni)
============================= */

document.addEventListener('DOMContentLoaded', () => {

  // ==============================
  // CUSTOM CURSOR
  // ==============================
  // Inicijaliziraj kursor samo na uređajima koji imaju miš (nisu touch)
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  if (!isTouchDevice) {
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursor-dot');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverTargets = document.querySelectorAll('a, button, .service-card, .t-card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  // ==============================
  // NAV SCROLL EFFECT
  // ==============================
  const nav = document.getElementById('nav');
  const scrolledThreshold = 60;

  const handleNavScroll = () => {
    if (window.scrollY > scrolledThreshold) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ==============================
  // SCROLL PROGRESS BAR
  // ==============================
  const scrollProgress = document.getElementById('scroll-progress');
  const handleScrollProgress = () => {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
  };
  window.addEventListener('scroll', handleScrollProgress, { passive: true });


  // ==============================
  // MOBILE HAMBURGER
  // ==============================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ==============================
  // REVEAL ON SCROLL
  // ==============================
  const reveals = document.querySelectorAll('.reveal');

  document.querySelectorAll('.service-card').forEach((card, i) => {
    card.style.setProperty('--index', i % 3);
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.index ? parseFloat(el.dataset.index) * 90 : 0;
        setTimeout(() => el.classList.add('visible'), delay);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ==============================
  // TESTIMONIALS SLIDER
  // ==============================
  // Ovaj dio koda više nije potreban jer koristimo Elfsight widget.
  // Uklanjanjem sprječavamo greške u konzoli koje mogu blokirati druge skripte.
  /*
  const track = document.getElementById('testimonials-track'); // Ovaj element više ne postoji

  function next() {
    const visible = getCardsVisible();
    const maxIndex = totalCards - visible;
    goTo(currentIndex < maxIndex ? currentIndex + 1 : 0);
  }

  function prev() {
    const visible = getCardsVisible();
    const maxIndex = totalCards - visible;
    goTo(currentIndex > 0 ? currentIndex - 1 : maxIndex);
  }

  // ... ostatak starog koda za slider ...
  */

  // ==============================
  // STATS COUNTER ANIMATION
  // ==============================
  const stats = document.querySelectorAll('.stat strong');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      stats.forEach(stat => {
        const raw = stat.textContent;
        const numMatch = raw.match(/[\d.]+/);
        if (!numMatch) return;
        const target = parseFloat(numMatch[0]);
        const suffix = raw.replace(numMatch[0], '');
        let current = 0;
        const duration = 3500;
        const step = target / (duration / 16);

        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          stat.textContent = (Number.isInteger(target) ? Math.round(current) : current.toFixed(0)) + suffix;
          if (current >= target) clearInterval(timer);
        }, 16);
      });
    }
  }, { threshold: 0.8 });

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) statsObserver.observe(statsEl);

  // ==============================
  // TESTIMONIAL TABS
  // ==============================
  const tabs = document.querySelectorAll('.t-tab');
  const panels = document.querySelectorAll('.t-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + tab.dataset.agent).classList.add('active');
    });
  });

  // ==============================
  // ACTIVE NAV LINK ON SCROLL
  // ==============================
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);

        // Ukloni 'active' sa svih linkova
        navLinksAll.forEach(link => link.classList.remove('active'));

        // Dodaj 'active' na pravi link
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(section => sectionObserver.observe(section));

  // ==============================
  // LIGHTBOX FOR GALLERY
  // ==============================
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const galleryImages = document.querySelectorAll('.office-mini-gallery img, .vizitka');

    galleryImages.forEach(img => {
      img.addEventListener('click', () => {
        lightbox.style.display = 'block';
        lightboxImg.src = img.src;
      });
    });

    const closeLightbox = () => {
      lightbox.style.display = 'none';
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // --- COOKIE BANNER LOGIC ---
  const cookieBanner = document.getElementById('cookie-banner');
  const mapIframes = document.querySelectorAll('.cc-map-placeholder iframe');
  const mapOverlays = document.querySelectorAll('.map-consent-overlay');
  const mapConsentBtns = document.querySelectorAll('.map-consent-btn');

  const revokeCookieConsent = () => {
    // Odbijeno: sakrij karte i prikaži overlay
    mapIframes.forEach(iframe => {
      iframe.src = ''; // Ukloni src da se karta prestane učitavati
    });
    mapOverlays.forEach(overlay => {
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';
    });
    localStorage.setItem('cookieConsent', 'false');
  };

  const handleCookieConsent = (consent) => {
    if (consent === 'true') {
      // Prihvaćeno: učitaj karte i sakrij overlay
      localStorage.setItem('cookieConsent', 'true');
      mapIframes.forEach(iframe => {
        iframe.src = iframe.dataset.src;
      });
      mapOverlays.forEach(overlay => {
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
      });
    } else {
      revokeCookieConsent();
    }
    // Ako je odbijeno, ne radi ništa, karte ostaju blokirane
    if (cookieBanner) {
      cookieBanner.classList.remove('visible');
    }
  };

  if (cookieBanner) {
    const acceptBtn = document.getElementById('cookie-accept-btn');
    const declineBtn = document.getElementById('cookie-decline-btn');
    const privacyLink = document.getElementById('open-privacy-from-cookie');
    const consent = localStorage.getItem('cookieConsent');

    // Provjeri je li pristanak već dan
    if (consent) {
      handleCookieConsent(consent);
    } else {
      // Pričekaj malo prije prikaza da ne bude previše naglo
      setTimeout(() => {
        cookieBanner.classList.add('visible');
      }, 1500);
    }

    declineBtn.addEventListener('click', () => {
      revokeCookieConsent();
      if (cookieBanner) cookieBanner.classList.remove('visible');
    });

    acceptBtn.addEventListener('click', () => {
      handleCookieConsent('true');
    });

    mapConsentBtns.forEach(btn => {
      btn.addEventListener('click', () => handleCookieConsent('true'));
    });

    // Omogući otvaranje pravila privatnosti i iz bannera
    const openPrivacyBtn = document.getElementById('open-privacy');
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      openPrivacyBtn.click(); // Simulira klik na originalni link
    });

  }

  // --- TEXT MODAL LOGIC (Refactored) ---
  const textModal = document.getElementById('text-modal');
  if (textModal) {
    const modalTextContent = document.getElementById('modal-text-content');
    const closeModalBtn = document.querySelector('.text-modal-close');

    const openPrivacyBtn = document.getElementById('open-privacy');
    const openImpressumBtn = document.getElementById('open-impressum');

    const privacyContent = document.getElementById('privacy-policy-content');
    const impressumContent = document.getElementById('impressum-content');

    const openModal = (content) => {
      if (content) {
        modalTextContent.innerHTML = content.innerHTML;
        textModal.style.display = 'block';
      }
    };

    const closeModal = () => {
      textModal.style.display = 'none';
      modalTextContent.innerHTML = '';
    };

    if (openPrivacyBtn) openPrivacyBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(privacyContent); });
    if (openImpressumBtn) openImpressumBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(impressumContent); });
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === textModal) closeModal(); });

    // Event listener za gumbe unutar modala (koristimo delegaciju na modal)
    textModal.addEventListener('click', function (e) {
      const targetId = e.target.id;
      if (targetId === 'privacy-accept-cookies') {
        handleCookieConsent('true');
        closeModal();
      } else if (targetId === 'privacy-decline-cookies') {
        localStorage.setItem('cookieConsent', 'false');
        revokeCookieConsent();
        closeModal();
      }
    });
  }
});