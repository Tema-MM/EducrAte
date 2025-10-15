
// Placeholder for now – future: animation, Find My Student logic, etc.
console.log("EduCrate script loaded.");

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Newsletter signup
  const form = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('newsletter-email');
  const feedback = document.getElementById('newsletter-feedback');
  if (form && emailInput && feedback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = String(emailInput.value || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        feedback.hidden = false;
        feedback.textContent = 'Please enter a valid email address.';
        feedback.style.color = '#b4231a';
        emailInput.setAttribute('aria-invalid', 'true');
        emailInput.focus();
        return;
      }
      try {
        const key = 'educrate.newsletter';
        const current = JSON.parse(localStorage.getItem(key) || '[]');
        if (!current.includes(email)) current.push(email);
        localStorage.setItem(key, JSON.stringify(current));
        feedback.hidden = false;
        feedback.textContent = 'Thanks for subscribing!';
        feedback.style.color = '#0f5132';
        emailInput.value = '';
        emailInput.removeAttribute('aria-invalid');
      } catch (err) {
        feedback.hidden = false;
        feedback.textContent = 'Unable to save subscription locally. Please try again later.';
        feedback.style.color = '#b4231a';
      }
    });
  }
});
