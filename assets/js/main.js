
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
  quoteForm.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(quoteForm);
    const lines = [
      'Storm Proof Roofing estimate request',
      `Name: ${d.get('name') || ''}`,
      `Phone: ${d.get('phone') || ''}`,
      `Town: ${d.get('town') || ''}`,
      `Service: ${d.get('service') || ''}`,
      `Timeline: ${d.get('timeline') || ''}`,
      `Project details: ${d.get('details') || ''}`
    ];
    const body = encodeURIComponent(lines.join('\n'));
    const sms = `sms:2077101027?&body=${body}`;
    document.querySelector('#quoteStatus').textContent = 'Your text message is ready to send.';
    document.querySelector('#quoteStatus').classList.add('success');
    window.location.href = sms;
  });
}

const year = document.querySelectorAll('[data-year]');
year.forEach(el => el.textContent = new Date().getFullYear());
