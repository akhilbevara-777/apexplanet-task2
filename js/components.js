const pageScripts = {
  home: "main",
  login: "login",
  register: "register",
};

function renderSiteNav() {
  const nav = document.getElementById("siteNav");
  if (!nav) return;

  const current = window.location.pathname.split("/").pop();
  const isAuthPage = current === "login.html" || current === "register.html";
  const homeLink = isAuthPage ? "index.html" : "#home";

  nav.innerHTML = `
    <header class="sticky-top">
      <nav class="navbar navbar-expand-lg navbar-dark shadow-sm py-3">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center" href="${homeLink}">
            <span class="brand-dot me-2"></span>
            ApexPlanet
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto align-items-lg-center">
              <li class="nav-item"><a class="nav-link" href="${homeLink}">Home</a></li>
              <li class="nav-item"><a class="nav-link" href="${isAuthPage ? "index.html#about" : "#about"}">About</a></li>
              <li class="nav-item"><a class="nav-link" href="${isAuthPage ? "index.html#skills" : "#skills"}">Skills</a></li>
              <li class="nav-item"><a class="nav-link" href="${isAuthPage ? "index.html#projects" : "#projects"}">Projects</a></li>
              <li class="nav-item"><a class="nav-link" href="${isAuthPage ? "index.html#contact" : "#contact"}">Contact</a></li>
              ${isAuthPage ? `
                <li class="nav-item"><a class="nav-link" href="login.html">Login</a></li>
                <li class="nav-item"><a class="nav-link" href="register.html">Register</a></li>
              ` : `
                <li class="nav-item"><a class="nav-link" href="login.html">Login</a></li>
              `}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  `;
}

function renderSiteFooter() {
  const footer = document.getElementById("siteFooter");
  if (!footer) return;

  const current = window.location.pathname.split("/").pop();
  const isAuthPage = current === "login.html" || current === "register.html";
  const homeLink = isAuthPage ? "index.html" : "#home";

  footer.innerHTML = `
    <footer class="py-5">
      <div class="container text-center text-muted small">
        <p class="mb-2">Built for modern portfolios with reusable design and polished UI.</p>
        <div class="d-flex justify-content-center gap-3 flex-wrap">
          <a href="${homeLink}" class="link-light text-decoration-none">Home</a>
          <a href="login.html" class="link-light text-decoration-none">Login</a>
          <a href="register.html" class="link-light text-decoration-none">Register</a>
          <a href="https://github.com/" target="_blank" rel="noopener" class="link-light text-decoration-none">GitHub</a>
        </div>
        <p class="mt-3 mb-0">© 2026 ApexPlanet. Designed for recruiters and modern digital experiences.</p>
      </div>
    </footer>
  `;
}

function unlockPageScripts() {
  const pageKey = document.body.dataset.page;
  if (!pageKey) return;

  const scriptName = pageScripts[pageKey];
  if (!scriptName) return;

  const script = document.createElement("script");
  script.src = `js/${scriptName}.js`;
  script.defer = true;
  document.body.appendChild(script);
}

function highlightActiveNav() {
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const pageKey = document.body.dataset.page;

  navLinks.forEach((link) => {
    if (link.getAttribute("href").includes(pageKey)) {
      link.classList.add("active");
    }
  });
}

function disableMobileNavOnClick() {
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const navCollapse = document.querySelector(".navbar-collapse");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navCollapse && navCollapse.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse);
        bsCollapse.hide();
      }
    });
  });
}

renderSiteNav();
renderSiteFooter();
highlightActiveNav();
disableMobileNavOnClick();
unlockPageScripts();