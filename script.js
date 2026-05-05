/* ===================================================
   KECAMATAN KAMANG TANGAH — Main Script
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Navbar: Scroll shadow + Active link ----- */
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Shadow on scroll
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Back-to-top visibility
    backToTop.classList.toggle('visible', window.scrollY > 400);

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ----- Hamburger / Mobile Menu ----- */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const open = navLinksEl.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close menu when a link is clicked
  navLinksEl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      navLinksEl.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });


  /* ----- Back to Top ----- */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ----- Stats Counter (Intersection Observer) ----- */
  const statNums = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      el.textContent = formatNumber(Math.floor(current)) + suffix;
      if (current >= target) clearInterval(timer);
    }, stepTime);
  }

  function formatNumber(n) {
    return n >= 1000 ? (n / 1000).toFixed(n % 1000 === 0 ? 0 : 0) + '.000' : n;
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statsObserver.observe(el));


  /* ----- Tab Toggle: Berita / Pengumuman ----- */
  const tabBtns    = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });


  /* ----- Contact Form ----- */
  const form = document.getElementById('kontakForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      let valid = true;
      const fields = form.querySelectorAll('[required]');

      fields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        } else {
          field.classList.remove('error');
        }
      });

      // Email format check
      const emailField = form.querySelector('#email');
      if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.classList.add('error');
        valid = false;
      }

      if (valid) {
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Mengirim…';
        btn.disabled = true;

        // Simulate send
        setTimeout(() => {
          form.reset();
          formSuccess.classList.add('show');
          btn.textContent = 'Kirim Pesan ✉️';
          btn.disabled = false;

          setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }, 1200);
      }
    });

    // Clear error on input
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => field.classList.remove('error'));
    });
  }


  /* ----- Smooth Scroll for Anchor Links ----- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 72; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ----- Scroll Reveal (fade-up cards) ----- */
  const revealEls = document.querySelectorAll(
    '.layanan-card, .berita-card, .org-card, .stat-card, .galeri-item, .pengumuman-item'
  );

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${(i % 6) * 0.08}s`;
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    revealObserver.observe(el);
  });

  // Add CSS for revealed state
  const style = document.createElement('style');
  style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);


  /* ----- Galeri: Lightbox-style zoom on click ----- */
  const galeriItems = document.querySelectorAll('.galeri-item');

  galeriItems.forEach(item => {
    item.addEventListener('click', () => {
      const caption = item.querySelector('.galeri-overlay span')?.textContent || '';
      const bg = item.style.background;

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;inset:0;z-index:9999;
        background:rgba(0,0,0,.85);
        display:flex;flex-direction:column;
        align-items:center;justify-content:center;
        cursor:pointer;animation:fadeIn .2s ease;
      `;

      const box = document.createElement('div');
      box.style.cssText = `
        width:min(640px,90vw);height:min(420px,60vw);
        border-radius:16px;${bg};
        box-shadow:0 20px 60px rgba(0,0,0,.5);
        margin-bottom:20px;
      `;

      const label = document.createElement('p');
      label.style.cssText = 'color:#fff;font-size:1.1rem;font-weight:600;';
      label.textContent = caption;

      const closeHint = document.createElement('p');
      closeHint.style.cssText = 'color:rgba(255,255,255,.5);font-size:.8rem;margin-top:10px;';
      closeHint.textContent = 'Klik untuk menutup';

      overlay.appendChild(box);
      overlay.appendChild(label);
      overlay.appendChild(closeHint);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      overlay.addEventListener('click', () => {
        overlay.remove();
        document.body.style.overflow = '';
      });
    });
  });

}); // end DOMContentLoaded
