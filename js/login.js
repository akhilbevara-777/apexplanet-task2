function ready(callback) {
  if (document.readyState !== "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}

function attachPasswordToggles() {
  document.querySelectorAll(".password-field").forEach((field) => {
    const toggle = field.parentElement.querySelector(".password-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const input = field;
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      toggle.innerHTML = isPassword ? '<i class="bi bi-eye-slash-fill"></i>' : '<i class="bi bi-eye-fill"></i>';
    });
  });
}

function validateLoginForm() {
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const status = document.getElementById("loginStatus");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!validEmail.test(email)) {
    status.textContent = "Please enter a valid email address.";
    status.className = "text-danger small mt-3";
    return false;
  }

  if (password.length < 6) {
    status.textContent = "Password must be at least 6 characters.";
    status.className = "text-danger small mt-3";
    return false;
  }

  status.textContent = "Credentials look good. Signing in...";
  status.className = "text-success small mt-3";
  return true;
}

function initializeLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateLoginForm()) return;

    const status = document.getElementById("loginStatus");
    const button = document.getElementById("loginSubmit");
    button.disabled = true;
    button.textContent = "Signing in...";

    setTimeout(() => {
      status.textContent = "Welcome back! Your credentials were accepted.";
      status.className = "text-success small mt-3";
      button.disabled = false;
      button.textContent = "Sign In";
    }, 1000);
  });
}

ready(() => {
  attachPasswordToggles();
  initializeLoginForm();
});