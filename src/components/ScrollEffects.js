export class ScrollEffects {
  constructor() {
    this.progressBar = null;
    this.backToTopBtn = null;
    this.init();
  }

  init() {
    this.createProgressBar();
    this.createBackToTop();
    this.setupListeners();
  }

  createProgressBar() {
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.innerHTML = '<div class="scroll-progress__bar"></div>';
    document.body.appendChild(progressBar);
    this.progressBar = progressBar.querySelector(".scroll-progress__bar");
  }

  createBackToTop() {
    const button = document.createElement("button");
    button.className = "back-to-top";
    button.setAttribute("aria-label", "Back to top");
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    `;

    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    document.body.appendChild(button);
    this.backToTopBtn = button;
  }

  setupListeners() {
    window.addEventListener("scroll", () => {
      this.updateProgress();
      this.toggleBackToTop();
    });
  }

  updateProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    if (this.progressBar) {
      this.progressBar.style.width = scrolled + "%";
    }
  }

  toggleBackToTop() {
    if (this.backToTopBtn) {
      if (window.scrollY > 300) {
        this.backToTopBtn.classList.add("show");
      } else {
        this.backToTopBtn.classList.remove("show");
      }
    }
  }
}
