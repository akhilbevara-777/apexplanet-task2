async function fetchSampleUsers() {
  const userList = document.getElementById("userSampleList");
  if (!userList) return;

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();
    userList.innerHTML = users
      .slice(0, 4)
      .map(
        (user) => `
          <li class="list-group-item bg-transparent border-1 border-secondary text-light">
            <strong>${user.username}</strong> · <span class="text-muted">${user.email}</span>
          </li>
        `
      )
      .join("");
  } catch (error) {
    userList.innerHTML = "<li class=\"list-group-item bg-transparent text-muted\">Unable to load suggestions.</li>";
  }
}

function attachPasswordToggles() {
  document.querySelectorAll(".password-field").forEach((field) => {
    const toggle = field.parentElement.querySelector(".password-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const isPassword = field.type === "password";
      field.type = isPassword ? "text" : "password";
      toggle.innerHTML = isPassword ? '<i class="bi bi-eye-slash-fill"></i>' : '<i class="bi bi-eye-fill"></i>';
    });
  });
}

function showAvailabilityMessage(input, message, isValid) {
  const feedback = input.parentElement.querySelector(".form-text");
  feedback.textContent = message;
  feedback.className = `form-text ${isValid ? "text-success" : "text-danger"}`;
}

async function checkAvailability(input) {
  const value = input.value.trim();
  if (!value) {
    showAvailabilityMessage(input, "Enter a value to check availability.", false);
    return;
  }

  const field = input.dataset.check;
  if (!field) return;

  showAvailabilityMessage(input, "Checking availability…", true);

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();
    const isTaken = users.some((user) => user[field].toLowerCase() === value.toLowerCase());

    if (isTaken) {
      showAvailabilityMessage(input, `${field === "username" ? "Username" : "Email"} is already taken.", false);
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    } else {
      showAvailabilityMessage(input, `${field === "username" ? "Username" : "Email"} is available.", true);
      input.classList.add("is-valid");
      input.classList.remove("is-invalid");
    }
  } catch (error) {
    showAvailabilityMessage(input, "Unable to verify availability. Try again later.", false);
  }
}

function validateRegisterForm() {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const confirm = document.getElementById("registerConfirmPassword").value.trim();
  const status = document.getElementById("registerStatus");

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !username || !email || !password || !confirm) {
    status.textContent = "Please fill in every field before continuing.";
    status.className = "text-danger small mt-3";
    return false;
  }

  if (!validEmail.test(email)) {
    status.textContent = "Enter a valid email address.";
    status.className = "text-danger small mt-3";
    return false;
  }

  if (password.length < 8) {
    status.textContent = "Password must be at least 8 characters.";
    status.className = "text-danger small mt-3";
    return false;
  }

  if (password !== confirm) {
    status.textContent = "Passwords do not match.";
    status.className = "text-danger small mt-3";
    return false;
  }

  status.textContent = "Registration details are valid. Creating account...";
  status.className = "text-success small mt-3";
  return true;
}

function initializeRegistrationForm() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateRegisterForm()) return;

    const status = document.getElementById("registerStatus");
    const button = document.getElementById("registerSubmit");
    button.disabled = true;
    button.textContent = "Creating account...";

    setTimeout(() => {
      status.textContent = "Account created successfully — welcome aboard!";
      status.className = "text-success small mt-3";
      button.disabled = false;
      button.textContent = "Register";
      form.reset();
    }, 1200);
  });

  ["registerUsername", "registerEmail"].forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("blur", () => checkAvailability(input));
  });
}

function attachUserRefreshButton() {
  const refreshButton = document.getElementById("loadUsersBtn");
  if (!refreshButton) return;
  refreshButton.addEventListener("click", fetchSampleUsers);
}

ready(() => {
  attachPasswordToggles();
  initializeRegistrationForm();
  attachUserRefreshButton();
  fetchSampleUsers();
});