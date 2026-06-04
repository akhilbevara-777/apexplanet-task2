function ready(callback) {
  if (document.readyState !== "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}

function updateScrollProgress() {
  const progress = document.getElementById("progressBar");
  if (!progress) return;

  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progress.style.width = `${percent}%`;
}

function revealOnScroll() {
  const revealItems = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function animateSkillBars() {
  const bars = document.querySelectorAll(".skill-progress");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector(".progress-bar");
          const percent = Number(entry.target.dataset.percent) || 0;
          if (fill) {
            fill.style.width = `${percent}%`;
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const alertBox = document.getElementById("formAlert");
  if (!form || !alertBox) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      alertBox.textContent = "Please fix the highlighted fields before sending.";
      alertBox.className = "alert alert-danger";
      alertBox.classList.remove("d-none");
      return;
    }

    alertBox.textContent = "Message sent successfully. I’ll get back to you shortly.";
    alertBox.className = "alert alert-success";
    alertBox.classList.remove("d-none");
    form.classList.remove("was-validated");
    form.reset();
  });
}

ready(() => {
  updateScrollProgress();
  revealOnScroll();
  animateSkillBars();
  initContactForm();
});

window.addEventListener("scroll", updateScrollProgress);
