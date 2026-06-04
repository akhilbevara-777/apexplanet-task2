const registerForm = document.getElementById('registerForm');
const registerAlert = document.getElementById('registerAlert');
const fullNameField = document.getElementById('fullName');
const usernameField = document.getElementById('username');
const usernameStatus = document.getElementById('usernameStatus');
const emailField = document.getElementById('registerEmail');
const emailStatus = document.getElementById('emailStatus');
const phoneField = document.getElementById('registerPhone');
const passwordField = document.getElementById('registerPassword');
const confirmPasswordField = document.getElementById('confirmPassword');
const strengthBar = document.getElementById('passwordStrengthBar');
const strengthLabel = document.getElementById('strengthLabel');
const passwordToggles = document.querySelectorAll('.password-toggle');
const loadUsersBtn = document.getElementById('loadUsersBtn');
const loadUsersSpinner = document.getElementById('loadUsersSpinner');
const userDataAlert = document.getElementById('userDataAlert');
const userList = document.getElementById('userList');

let placeholderUsers = null;
let usernameTimer = null;
let emailTimer = null;

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

function fetchJSONPlaceholderUsers() {
  if (placeholderUsers) {
    return Promise.resolve(placeholderUsers);
  }

  return fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Unable to reach the user service.');
      }
      return response.json();
    })
    .then((data) => {
      placeholderUsers = data;
      return data;
    });
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

function showUserAlert(message, type = 'info') {
  if (!userDataAlert) return;
  userDataAlert.className = `alert alert-${type} alert-dismissible fade show`;
  userDataAlert.textContent = message;
  userDataAlert.classList.remove('d-none');
}

function clearUserAlert() {
  if (!userDataAlert) return;
  userDataAlert.classList.add('d-none');
  userDataAlert.textContent = '';
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

function setAvailabilityStatus(element, message, variant = 'muted') {
  element.textContent = message;
  element.className = `form-text text-${variant}`;
  element.classList.remove('d-none');
}

function debounce(fn, delay = 500) {
  return (...args) => {
    clearTimeout(args[args.length - 1]);
    args[args.length - 1] = null;
    fn(...args.slice(0, -1));
  };
}

function checkUsernameAvailability(username) {
  if (username.length < 3 || username.length > 30) {
    setAvailabilityStatus(usernameStatus, 'Username must be 3-30 characters.', 'danger');
    setFieldState(usernameField, false);
    return;
  }

  setAvailabilityStatus(usernameStatus, 'Checking username availability…', 'muted');
  fetchJSONPlaceholderUsers()
    .then((users) => {
      const taken = users.some((user) => user.username.toLowerCase() === username.toLowerCase());
      if (taken) {
        setAvailabilityStatus(usernameStatus, 'Username is already taken.', 'danger');
        setFieldState(usernameField, false);
      } else {
        setAvailabilityStatus(usernameStatus, 'Username is available.', 'success');
        setFieldState(usernameField, true);
      }
    })
    .catch(() => {
      setAvailabilityStatus(usernameStatus, 'Unable to verify username right now.', 'warning');
    });
}

function checkEmailAvailability(email) {
  if (!validateEmail(email)) {
    setAvailabilityStatus(emailStatus, 'Please enter a valid email address first.', 'danger');
    setFieldState(emailField, false);
    return;
  }

  setAvailabilityStatus(emailStatus, 'Checking email availability…', 'muted');
  fetchJSONPlaceholderUsers()
    .then((users) => {
      const taken = users.some((user) => user.email.toLowerCase() === email.toLowerCase());
      if (taken) {
        setAvailabilityStatus(emailStatus, 'Email is already registered.', 'danger');
        setFieldState(emailField, false);
      } else {
        setAvailabilityStatus(emailStatus, 'Email looks available.', 'success');
        setFieldState(emailField, true);
      }
    })
    .catch(() => {
      setAvailabilityStatus(emailStatus, 'Unable to verify email right now.', 'warning');
    });
}

function renderUserList(users) {
  if (!userList) return;
  userList.innerHTML = users
    .slice(0, 10)
    .map(
      (user) => `
      <div class="list-group-item list-group-item-action list-group-item-dark rounded-4 mb-2">
        <div class="d-flex justify-content-between align-items-start gap-3">
          <div>
            <h6 class="mb-1 text-white">${user.name}</h6>
            <p class="mb-1 text-muted small">@${user.username} • ${user.email}</p>
            <p class="mb-0 text-muted small">${user.company.name}</p>
          </div>
          <span class="badge bg-primary">ID ${user.id}</span>
        </div>
      </div>`
    )
    .join('');
}

function loadUserData() {
  clearUserAlert();
  if (loadUsersSpinner) loadUsersSpinner.classList.remove('d-none');
  if (loadUsersBtn) loadUsersBtn.disabled = true;

  fetchJSONPlaceholderUsers()
    .then((users) => {
      renderUserList(users);
      showUserAlert(`Successfully fetched ${users.length} users.`, 'success');
    })
    .catch((error) => {
      showUserAlert(`Unable to load users: ${error.message}`, 'danger');
    })
    .finally(() => {
      if (loadUsersSpinner) loadUsersSpinner.classList.add('d-none');
      if (loadUsersBtn) loadUsersBtn.disabled = false;
    });
}

passwordToggles.forEach((toggle) => toggle.addEventListener('click', togglePasswordVisibility));

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearAlert();

  const nameValue = fullNameField.value.trim();
  const usernameValue = usernameField.value.trim();
  const emailValue = emailField.value.trim();
  const phoneValue = phoneField.value.trim();
  const passwordValue = passwordField.value;
  const confirmValue = confirmPasswordField.value;

  const nameValid = nameValue.length > 0 && nameValue.length <= 60;
  const usernameValid = usernameValue.length >= 3 && usernameValue.length <= 30;
  const emailValid = validateEmail(emailValue);
  const phoneValid = validatePhone(phoneValue);
  const passwordValid = passwordValue.length >= 8 && passwordValue.length <= 32;
  const matchValid = passwordValue === confirmValue && passwordValid;

  setFieldState(fullNameField, nameValid);
  setFieldState(usernameField, usernameValid);
  setFieldState(emailField, emailValid);
  setFieldState(phoneField, phoneValid);
  setFieldState(passwordField, passwordValid);
  setFieldState(confirmPasswordField, matchValid);

  if (!nameValid || !usernameValid || !emailValid || !phoneValid || !passwordValid || !matchValid) {
    showAlert('Please fix the highlighted fields before completing registration.', 'danger');
    return;
  }

  showAlert('Registration successful. Welcome aboard!', 'success');
  registerForm.reset();
  updateStrengthMeter();
  clearUserAlert();
  if (usernameStatus) usernameStatus.classList.add('d-none');
  if (emailStatus) emailStatus.classList.add('d-none');
  document.querySelectorAll('.is-valid').forEach((field) => field.classList.remove('is-valid'));
});

fullNameField.addEventListener('input', () => {
  setFieldState(fullNameField, fullNameField.value.trim().length > 0 && fullNameField.value.trim().length <= 60);
  clearAlert();
});

usernameField.addEventListener('input', () => {
  const value = usernameField.value.trim();
  const valid = value.length >= 3 && value.length <= 30;
  setFieldState(usernameField, valid);
  clearAlert();
  if (!valid) {
    setAvailabilityStatus(usernameStatus, 'Username must be 3-30 characters.', 'danger');
    return;
  }
  clearUserAlert();
  clearTimeout(usernameTimer);
  usernameTimer = setTimeout(() => checkUsernameAvailability(value), 650);
});

emailField.addEventListener('input', () => {
  const value = emailField.value.trim();
  const valid = validateEmail(value);
  setFieldState(emailField, valid);
  clearAlert();
  if (!valid) {
    setAvailabilityStatus(emailStatus, 'Enter a valid email address.', 'danger');
    return;
  }
  clearTimeout(emailTimer);
  emailTimer = setTimeout(() => checkEmailAvailability(value), 650);
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

if (loadUsersBtn) {
  loadUsersBtn.addEventListener('click', loadUserData);
}

window.addEventListener('load', updateStrengthMeter);
