// Nav scroll effect
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile menu
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
if (burger) {
  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    burger.classList.toggle('open');
  });
}

// Add fade-up + stagger to grid items first, then observe everything together
document.querySelectorAll('.features-grid .feature-card, .step').forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.animationDelay = `${i * 0.1}s`;
});

const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Contact form
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const successEl = form.querySelector('.form-success');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    const data = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        form.reset();
        successEl.style.display = 'block';
        btn.style.display = 'none';
      } else {
        throw new Error('Server error');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Send Message';
      alert('Something went wrong. Please try again or email us directly.');
    }
  });
}
