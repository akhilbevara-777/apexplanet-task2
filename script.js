const scrollProgress = document.getElementById('progressBar');
const revealElements = document.querySelectorAll('.reveal');
const skillBars = document.querySelectorAll('.skill-progress');
const contactForm = document.getElementById('contactForm');
const formAlert = document.getElementById('formAlert');

function updateScrollProgress() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = scrollHeight ? (scrollTop / scrollHeight) * 100 : 0;
  if (scrollProgress) {
    scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }
}

function animateReveals() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.18 });

  revealElements.forEach((element) => observer.observe(element));
}

function animateSkillBars() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const progressEl = entry.target;
      const bar = progressEl.querySelector('.progress-bar');
      const percent = parseInt(progressEl.dataset.percent, 10) || 0;
      if (bar) {
        bar.style.width = `${percent}%`;
        bar.setAttribute('aria-valuenow', percent);
      }
      obs.unobserve(progressEl);
    });
  }, { threshold: 0.25 });

  skillBars.forEach((bar) => observer.observe(bar));
}

function showAlert(message, type = 'success') {
  if (!formAlert) return;
  formAlert.className = `alert alert-${type} alert-dismissible fade show`;
  formAlert.textContent = message;
  formAlert.classList.remove('d-none');
  setTimeout(() => {
    formAlert.classList.add('d-none');
  }, 5500);
}

function handleFormSubmit(event) {
  event.preventDefault();
  if (!contactForm) return;

  if (!contactForm.checkValidity()) {
    contactForm.classList.add('was-validated');
    return;
  }

  showAlert('Message sent successfully. I will get back to you soon!', 'success');
  contactForm.reset();
  contactForm.classList.remove('was-validated');
}

document.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
window.addEventListener('load', () => {
  updateScrollProgress();
  animateReveals();
  animateSkillBars();
});

if (contactForm) {
  contactForm.addEventListener('submit', handleFormSubmit);
}
