const loginForm = document.getElementById('loginForm');
const loginAlert = document.getElementById('loginAlert');
const passwordInput = document.getElementById('loginPassword');
const passwordToggle = document.querySelector('.password-toggle');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return password.length >= 8 && password.length <= 32;
}

function showAlert(message, type = 'danger') {
  if (!loginAlert) return;
  loginAlert.className = `alert alert-${type} alert-dismissible fade show`;
  loginAlert.textContent = message;
  loginAlert.classList.remove('d-none');
}

function clearAlert() {
  if (!loginAlert) return;
  loginAlert.classList.add('d-none');
  loginAlert.textContent = '';
}

function togglePasswordVisibility() {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  passwordToggle.innerHTML = isPassword ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
}

function setFieldState(field, valid) {
  if (!field) return;
  field.classList.remove('is-valid', 'is-invalid');
  field.classList.add(valid ? 'is-valid' : 'is-invalid');
}

passwordToggle.addEventListener('click', togglePasswordVisibility);

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearAlert();

  const emailField = document.getElementById('loginEmail');
  const passwordField = passwordInput;
  const emailValue = emailField.value.trim();
  const passwordValue = passwordField.value;

  const emailValid = validateEmail(emailValue);
  const passwordValid = validatePassword(passwordValue);

  setFieldState(emailField, emailValid);
  setFieldState(passwordField, passwordValid);

  if (!emailValid || !passwordValid) {
    const errorMessage = !emailValid
      ? 'Please enter a valid email address.'
      : 'Password must be between 8 and 32 characters.';
    showAlert(errorMessage, 'danger');
    return;
  }

  showAlert('Login successful. Redirecting...', 'success');
  loginForm.reset();
  emailField.classList.remove('is-valid');
  passwordField.classList.remove('is-valid');
});

loginForm.querySelectorAll('input').forEach((field) => {
  field.addEventListener('input', () => {
    if (field.id === 'loginEmail') {
      setFieldState(field, validateEmail(field.value.trim()));
    }
    if (field.id === 'loginPassword') {
      setFieldState(field, validatePassword(field.value));
    }
    clearAlert();
  });
});
