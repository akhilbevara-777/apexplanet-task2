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

function isPhoneValid(value) {
  return /^\+?[0-9\s\-]{7,15}$/.test(value.trim());
}

function validateField(field) {
  const value = field.value.trim();
  const feedback = field.nextElementSibling;

  field.setCustomValidity('');

  if (!value) {
    field.setCustomValidity('required');
    if (feedback) feedback.textContent = 'This field cannot be empty.';
    return false;
  }

  if (field.type === 'email') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      field.setCustomValidity('invalid');
      if (feedback) feedback.textContent = 'Please enter a valid email address.';
      return false;
    }
  }

  if (field.type === 'tel') {
    if (!isPhoneValid(value)) {
      field.setCustomValidity('invalid');
      if (feedback) feedback.textContent = 'Enter a valid phone number (7-15 digits).';
      return false;
    }
  }

  const maxLength = field.getAttribute('maxlength');
  if (maxLength && value.length > Number(maxLength)) {
    field.setCustomValidity('invalid');
    if (feedback) feedback.textContent = `Maximum ${maxLength} characters allowed.`;
    return false;
  }

  return true;
}

function handleFormSubmit(event) {
  event.preventDefault();
  if (!contactForm) return;

  const fields = Array.from(contactForm.querySelectorAll('input, textarea'));
  let formValid = true;

  fields.forEach((field) => {
    const valid = validateField(field);
    if (!valid) {
      formValid = false;
    }
  });

  contactForm.classList.add('was-validated');

  if (!formValid) {
    showAlert('Please correct the highlighted fields before sending.', 'danger');
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
  const fields = Array.from(contactForm.querySelectorAll('input, textarea'));
  fields.forEach((field) => {
    field.addEventListener('input', () => {
      validateField(field);
      if (contactForm.classList.contains('was-validated')) {
        field.classList.remove('is-invalid');
        field.classList.remove('is-valid');
        if (field.checkValidity()) {
          field.classList.add('is-valid');
        } else {
          field.classList.add('is-invalid');
        }
      }
    });
  });
}
