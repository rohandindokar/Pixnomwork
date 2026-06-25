/* =====================================================
   STOCKLIN CARPENTRY & PAINTING — SCRIPT
   No build step, no dependencies. Vanilla JS only.
   ===================================================== */

/* ---------- Image placeholder fallback ----------
   Every <img> in a .media figure has onerror="imgFallback(this)" inline in the HTML.
   If the file at src="" doesn't exist (because you haven't added the real photo yet),
   this swaps in a labelled placeholder instead of a broken-image icon.
   Once you drop a real file at the matching path (e.g. images/hero.jpg), this never fires
   and the real photo just shows — no code changes needed.
*/
function imgFallback(img) {
  const fig = img.closest('.media');
  if (!fig) return;
  fig.classList.add('media--empty');
  const label = fig.dataset.placeholderText || 'Add image here';
  if (!fig.querySelector('.media__placeholder')) {
    const ph = document.createElement('div');
    ph.className = 'media__placeholder';
    ph.innerHTML =
      '<img class="media__icon" src="https://api.iconify.design/ph/image.svg?color=%236B4226" alt="">' +
      '<span>' + label + '</span>';
    fig.appendChild(ph);
  }
  img.remove();
}

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  const navIcon = document.getElementById('nav-toggle-icon');

  function setNav(open) {
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navIcon.src = open
      ? 'https://api.iconify.design/ph/x.svg?color=%231F2421'
      : 'https://api.iconify.design/ph/list.svg?color=%231F2421';
  }

  navToggle.addEventListener('click', () => {
    setNav(!nav.classList.contains('is-open'));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setNav(false));
  });

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    header.style.boxShadow = window.scrollY > 8 ? '0 2px 10px rgba(31,36,29,0.08)' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll-reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.service-card, .work-tile, .process-list li, .section-head, .hero-copy, .media--hero, .media--about'
  );
  revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Lightbox for the Work gallery ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  let lastFocused = null;

  function openLightbox(tile) {
    const img = tile.querySelector('img');
    const caption = tile.dataset.caption || '';
    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxImg.style.display = '';
    } else {
      lightboxImg.style.display = 'none';
    }
    lightboxCaption.textContent = caption;
    lastFocused = document.activeElement;
    lightbox.hidden = false;
    lightboxClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.work-tile').forEach(tile => {
    tile.addEventListener('click', () => openLightbox(tile));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });

  /* ---------- Contact form ----------
     GitHub Pages only serves static files — there is no server here to receive
     this form, so submitting it right now just shows a local confirmation message
     and does NOT send an email or text to anyone.

     To make it actually deliver submissions, pick one:
       1) Formspree (https://formspree.io) — create a free form, then set this
          <form>'s action="https://formspree.io/f/yourFormId" and method="POST",
          and delete the preventDefault() block below so it submits normally.
       2) Web3Forms, Netlify Forms, or EmailJS — similar idea: point the form at
          their endpoint, or call their JS SDK from inside handleSubmit() below.
  */
  const form = document.getElementById('contact-form');
  const formNote = document.getElementById('form-note');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

    if (!name || !phone || !message) {
      formNote.textContent = 'Please fill in your name, phone, and a short project description.';
      formNote.dataset.state = 'error';
      return;
    }

    // Placeholder "success" — wire this to Formspree/Netlify/EmailJS per the note above.
    formNote.textContent = "Thanks — this is saved locally only for now. Once a form backend is connected, you'll get a real notification here.";
    formNote.dataset.state = 'success';
    form.reset();
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
});
