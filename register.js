const registerForm = document.getElementById('registerForm');
const registerAlert = document.getElementById('registerAlert');
const fullNameField = document.getElementById('fullName');
const emailField = document.getElementById('registerEmail');
const phoneField = document.getElementById('registerPhone');
const passwordField = document.getElementById('registerPassword');
const confirmPasswordField = document.getElementById('confirmPassword');
const strengthBar = document.getElementById('passwordStrengthBar');
const strengthLabel = document.getElementById('strengthLabel');
const passwordToggles = document.querySelectorAll('.password-toggle');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^\+?[0-9\s\-]{7,15}$/.test(phone.trim());
}

function getPasswordStrength(password) {
  const conditions = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
    password.length >= 10,
  ];
  const score = conditions.filter(Boolean).length;

  if (password.length === 0) {
    return { score: 0, label: 'Enter password', color: 'bg-secondary', width: '0%' };
  }
  if (score <= 2) {
    return { score, label: 'Weak', color: 'bg-danger', width: '25%' };
  }
  if (score === 3) {
    return { score, label: 'Fair', color: 'bg-warning', width: '55%' };
  }
  if (score === 4) {
    return { score, label: 'Good', color: 'bg-info', width: '75%' };
  }
  return { score, label: 'Strong', color: 'bg-success', width: '100%' };
}

function showAlert(message, type = 'danger') {
  if (!registerAlert) return;
  registerAlert.className = `alert alert-${type} alert-dismissible fade show`;
  registerAlert.textContent = message;
  registerAlert.classList.remove('d-none');
}

function clearAlert() {
  if (!registerAlert) return;
  registerAlert.classList.add('d-none');
  registerAlert.textContent = '';
}

function setFieldState(field, valid) {
  field.classList.remove('is-valid', 'is-invalid');
  field.classList.add(valid ? 'is-valid' : 'is-invalid');
}

function togglePasswordVisibility(event) {
  const button = event.currentTarget;
  const input = button.previousElementSibling;
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  button.innerHTML = isPassword ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
}

function updateStrengthMeter() {
  const value = passwordField.value;
  const strength = getPasswordStrength(value);
  strengthBar.style.width = strength.width;
  strengthBar.className = `progress-bar rounded-pill ${strength.color}`;
  strengthBar.setAttribute('aria-valuenow', parseInt(strength.width, 10));
  strengthLabel.textContent = strength.label;
}

passwordToggles.forEach((toggle) => toggle.addEventListener('click', togglePasswordVisibility));

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearAlert();

  const nameValue = fullNameField.value.trim();
  const emailValue = emailField.value.trim();
  const phoneValue = phoneField.value.trim();
  const passwordValue = passwordField.value;
  const confirmValue = confirmPasswordField.value;

  const nameValid = nameValue.length > 0 && nameValue.length <= 60;
  const emailValid = validateEmail(emailValue);
  const phoneValid = validatePhone(phoneValue);
  const passwordValid = passwordValue.length >= 8 && passwordValue.length <= 32;
  const matchValid = passwordValue === confirmValue && passwordValid;

  setFieldState(fullNameField, nameValid);
  setFieldState(emailField, emailValid);
  setFieldState(phoneField, phoneValid);
  setFieldState(passwordField, passwordValid);
  setFieldState(confirmPasswordField, matchValid);

  if (!nameValid || !emailValid || !phoneValid || !passwordValid || !matchValid) {
    showAlert('Please fix the highlighted fields before completing registration.', 'danger');
    return;
  }

  showAlert('Registration successful. Welcome aboard!', 'success');
  registerForm.reset();
  updateStrengthMeter();
  document.querySelectorAll('.is-valid').forEach((field) => field.classList.remove('is-valid'));
});

fullNameField.addEventListener('input', () => {
  setFieldState(fullNameField, fullNameField.value.trim().length > 0 && fullNameField.value.trim().length <= 60);
  clearAlert();
});

emailField.addEventListener('input', () => {
  setFieldState(emailField, validateEmail(emailField.value.trim()));
  clearAlert();
});

phoneField.addEventListener('input', () => {
  setFieldState(phoneField, validatePhone(phoneField.value.trim()));
  clearAlert();
});

passwordField.addEventListener('input', () => {
  setFieldState(passwordField, passwordField.value.length >= 8 && passwordField.value.length <= 32);
  updateStrengthMeter();
  clearAlert();
});

confirmPasswordField.addEventListener('input', () => {
  setFieldState(confirmPasswordField, confirmPasswordField.value === passwordField.value && confirmPasswordField.value.length > 0);
  clearAlert();
});

window.addEventListener('load', updateStrengthMeter);
