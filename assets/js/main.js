
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) toggle.addEventListener('click', () => links.classList.toggle('open'));

const current = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === current) a.classList.add('active');
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, {threshold: .12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const filters = document.querySelectorAll('.filter-btn');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  document.querySelectorAll('[data-category]').forEach(card => {
    card.hidden = !(f === 'all' || card.dataset.category === f);
  });
}));

const quoteForm = document.querySelector('#quoteForm');
if (quoteForm) {
  quoteForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (!quoteForm.reportValidity()) return;

    const status = quoteForm.querySelector('#quoteStatus');
    const submitButton = quoteForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.innerHTML : '';
    const endpoint = quoteForm.dataset.emailEndpoint;
    const formData = new FormData(quoteForm);
    const payload = Object.fromEntries(formData.entries());

    payload._subject = quoteForm.dataset.subject || payload._subject || 'New Storm Proof Roofing Request';
    payload._template = 'table';
    payload._captcha = 'false';
    payload.page = document.title;
    payload.page_url = window.location.href;

    if (status) {
      status.textContent = 'Sending your request...';
      status.classList.remove('success', 'error');
    }
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false || result.success === 'false') {
        throw new Error(result.message || 'The request could not be sent.');
      }

      quoteForm.reset();
      if (status) {
        status.textContent = 'Thank you — your request was sent successfully.';
        status.classList.add('success');
      }
    } catch (error) {
      console.error('Form submission failed:', error);
      if (status) {
        status.textContent = 'We could not send the form. Please call 207-710-1027.';
        status.classList.add('error');
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    }
  });
}

const year = document.querySelectorAll('[data-year]');
year.forEach(el => el.textContent = new Date().getFullYear());


const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const lightboxImage = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  let previousFocus = null;

  const openLightbox = card => {
    previousFocus = card;
    lightboxImage.src = card.dataset.image;
    lightboxImage.alt = card.dataset.title || 'Storm Proof Roofing project';
    lightboxCaption.textContent = card.dataset.title || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImage.src = '';
    if (previousFocus) previousFocus.focus();
  };

  document.querySelectorAll('[data-lightbox]').forEach(card => {
    card.addEventListener('click', () => openLightbox(card));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(card);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}
