/**
 * Focus Cinema — Interactive Experience Engine
 * Handles: Viewfinder cursor, Video Theater Modal, Category Filtering,
 * Booking Drawer/Modal, and Responsive Controls.
 */

(function () {
  'use strict';

  // State
  const state = {
    activeCategory: 'all',
    activeVideoId: null
  };

  // Custom Camera Viewfinder Cursor
  function setupViewfinderCursor() {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return;

    const root = document.documentElement;
    const frame = document.getElementById('fc-frame');
    const dot = document.getElementById('fc-dot');
    if (!frame || !dot) return;

    const FRAME_EASE = 0.16;
    const DOT_EASE = 0.55;
    const CLICKABLE = 'a, button, [role="button"], summary, label[for], select, input, [data-cursor], .filter-btn, .work-card, .btn-primary, .btn-outline';

    let mx = -100, my = -100;
    let fx = mx, fy = my;
    let dx = mx, dy = my;
    let raf = null, shown = false;

    root.classList.add('fc-cursor-on');

    function loop() {
      fx += (mx - fx) * FRAME_EASE;
      fy += (my - fy) * FRAME_EASE;
      dx += (mx - dx) * DOT_EASE;
      dy += (my - dy) * DOT_EASE;
      frame.style.transform = `translate3d(${fx.toFixed(2)}px, ${fy.toFixed(2)}px, 0)`;
      dot.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;

      if (Math.abs(mx - fx) + Math.abs(my - fy) + Math.abs(mx - dx) + Math.abs(my - dy) > 0.1) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }

    function kick() {
      if (!raf) raf = requestAnimationFrame(loop);
    }

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        fx = dx = mx;
        fy = dy = my;
        shown = true;
        root.classList.add('fc-visible');
      }
      const t = e.target && e.target.closest ? e.target.closest(CLICKABLE) : null;
      root.classList.toggle('fc-link', !!t);
      kick();
    }, { passive: true });

    window.addEventListener('mousedown', () => {
      root.classList.add('fc-down');
    });

    window.addEventListener('mouseup', () => {
      setTimeout(() => root.classList.remove('fc-down'), 90);
    });

    document.addEventListener('mouseleave', () => {
      root.classList.remove('fc-visible');
      shown = false;
    });
  }

  // Video Theater Modal
  const videoData = {
    'showreel': {
      title: 'Grand Mercure GIFT City — Agency Showreel',
      category: 'Hospitality & Commercial',
      desc: 'Cinematic property tour, aerial drone footage, and luxury interior cinematography filmed at Gandhinagar Gujarat.',
      youtubeId: 'C2CJpW53Ucw'
    },
    'realestate': {
      title: 'Real Estate Drone Walk-Through',
      category: 'Real Estate & Luxury Living',
      desc: 'High-rise residential property showcase with dusk lighting, architectural framing, and natural material textures.',
      youtubeId: '7DN4Z1Aokmc'
    },
    'udaipur': {
      title: 'The City of Lakes — Udaipur Drone Shoot',
      category: 'Tourism & Brand Film',
      desc: 'City Palace and Lake Pichola captured at golden hour with licensed aerial cinematography.',
      youtubeId: 'NiT_kLc16_U'
    },
    'lucknow': {
      title: 'Real Estate Land Shoot in Lucknow',
      category: 'Commercial Acreage & Drone Survey',
      desc: 'High-resolution aerial perimeter mapping and open plot development showcase with contextual landmarks.',
      youtubeId: 'q498bW1mNeU'
    }
  };

  function setupVideoModal() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-modal-iframe');
    const titleEl = document.getElementById('video-modal-title');
    const catEl = document.getElementById('video-modal-cat');
    const descEl = document.getElementById('video-modal-desc');
    const ytLink = document.getElementById('video-modal-yt-link');
    const closeBtn = document.getElementById('video-modal-close');
    if (!modal || !iframe) return;

    function openVideo(key) {
      const data = videoData[key];
      if (!data) return;

      iframe.src = `https://www.youtube-nocookie.com/embed/${data.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
      if (titleEl) titleEl.textContent = data.title;
      if (catEl) catEl.textContent = data.category;
      if (descEl) descEl.textContent = data.desc;
      if (ytLink) ytLink.href = `https://youtu.be/${data.youtubeId}`;

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeVideo() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      iframe.src = 'about:blank';
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-video]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        // If clicking the direct "Watch on YouTube" pill inside the card, allow default link
        if (e.target.closest('.no-modal')) return;
        e.preventDefault();
        const key = trigger.getAttribute('data-video');
        openVideo(key);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeVideo);

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('video-modal-backdrop')) {
        closeVideo();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeVideo();
      }
    });
  }

  // Portfolio Category Filtering
  function setupPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.work-card');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-filter');
        filterBtns.forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });

        cards.forEach(card => {
          const cardCat = card.getAttribute('data-category') || '';
          if (cat === 'all' || cardCat.includes(cat)) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Project Inquiry Booking Modal
  function setupBookingModal() {
    const modal = document.getElementById('booking-modal');
    const openBtns = document.querySelectorAll('[data-open-booking]');
    const closeBtn = document.getElementById('booking-modal-close');
    const form = document.getElementById('booking-form');
    if (!modal) return;

    function openBooking(presetService) {
      if (presetService && form) {
        const serviceSelect = form.querySelector('[name="service"]');
        if (serviceSelect) serviceSelect.value = presetService;
      }
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const firstInput = modal.querySelector('input, select');
      if (firstInput) firstInput.focus();
    }

    function closeBooking() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const service = btn.getAttribute('data-service') || '';
        openBooking(service);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeBooking);

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('booking-modal-backdrop')) {
        closeBooking();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeBooking();
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('[name="name"]')?.value || 'Client';
        const service = form.querySelector('[name="service"]')?.value || 'Video Production';
        const city = form.querySelector('[name="city"]')?.value || 'India';
        const details = form.querySelector('[name="details"]')?.value || '';

        const text = encodeURIComponent(
          `Hi Focus Cinema, I am ${name}.\n` +
          `Project: ${service}\n` +
          `Location: ${city}\n` +
          (details ? `Details: ${details}\n` : '') +
          `I would like to discuss a shoot.`
        );

        window.open(`https://wa.me/919096012144?text=${text}`, '_blank');
        closeBooking();
      });
    }
  }

  // Smooth Timecode Counter in Showreel & Hero HUD
  function setupHUDTimecode() {
    const tcEl = document.getElementById('hud-timecode');
    if (!tcEl) return;
    let seconds = 0;
    setInterval(() => {
      seconds = (seconds + 1) % 67; // 00:01:06 loop
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      const str = `00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      tcEl.textContent = str;
    }, 1000);
  }

  // Initialize all modules upon DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    setupViewfinderCursor();
    setupVideoModal();
    setupPortfolioFilter();
    setupBookingModal();
    setupHUDTimecode();
  });
})();
