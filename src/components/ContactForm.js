export class ContactForm {
  constructor() {
    this.createForm();
    this.setupEventListeners();
  }

  createForm() {
    const formHTML = `
      <div class="contact-form-container" id="contact-form-container">
        <button class="close-form-btn" id="close-form-btn" aria-label="Close contact form">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="contact-form-wrapper">
          <h2>Get In Touch</h2>
          <p class="form-subtitle">Have a project in mind? Let's work together!</p>
          <form id="contact-form" class="contact-form" novalidate>
            <div class="form-group">
              <label for="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Your name"
                aria-required="true"
              />
              <span class="error-message" id="name-error"></span>
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="your.email@example.com"
                aria-required="true"
              />
              <span class="error-message" id="email-error"></span>
            </div>

            <div class="form-group">
              <label for="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                placeholder="Project discussion"
                aria-required="true"
              />
              <span class="error-message" id="subject-error"></span>
            </div>

            <div class="form-group">
              <label for="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                placeholder="Tell me about your project..."
                aria-required="true"
              ></textarea>
              <span class="error-message" id="message-error"></span>
            </div>

            <button type="submit" class="btn btn-primary btn-submit">
              <span class="btn-text">Send Message</span>
              <span class="btn-loader" style="display: none;">
                <svg class="spinner" width="20" height="20" viewBox="0 0 50 50">
                  <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                </svg>
              </span>
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", formHTML);
  }

  setupEventListeners() {
    const form = document.getElementById("contact-form");
    const closeBtn = document.getElementById("close-form-btn");
    const container = document.getElementById("contact-form-container");

    form.addEventListener("submit", (e) => this.handleSubmit(e));

    closeBtn.addEventListener("click", () => {
      this.closeForm();
    });

    container.addEventListener("click", (e) => {
      if (e.target === container) {
        this.closeForm();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeForm();
      }
    });

    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach(input => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => {
        if (input.classList.contains("error")) {
          this.validateField(input);
        }
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);

    let isValid = true;
    let errorMessage = "";

    if (!value) {
      isValid = false;
      errorMessage = "This field is required";
    } else if (fieldName === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = "Please enter a valid email address";
      }
    } else if (fieldName === "message" && value.length < 10) {
      isValid = false;
      errorMessage = "Message must be at least 10 characters";
    }

    if (isValid) {
      field.classList.remove("error");
      field.classList.add("valid");
      errorElement.textContent = "";
    } else {
      field.classList.remove("valid");
      field.classList.add("error");
      errorElement.textContent = errorMessage;
    }

    return isValid;
  }

  async handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const inputs = form.querySelectorAll("input, textarea");
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showToast("Please fix the errors in the form", "error");
      return;
    }

    const submitBtn = form.querySelector(".btn-submit");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoader = submitBtn.querySelector(".btn-loader");

    submitBtn.disabled = true;
    btnText.style.display = "none";
    btnLoader.style.display = "inline-block";

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    };

    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("Form submitted:", formData);

    submitBtn.disabled = false;
    btnText.style.display = "inline";
    btnLoader.style.display = "none";

    this.showToast("Message sent successfully! I'll get back to you soon.", "success");
    form.reset();
    inputs.forEach(input => {
      input.classList.remove("valid", "error");
    });

    setTimeout(() => {
      this.closeForm();
    }, 2000);
  }

  showToast(message, type = "info") {
    const existingToast = document.querySelector(".toast");
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <svg class="toast-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${type === "success"
            ? '<polyline points="20 6 9 17 4 12"></polyline>'
            : type === "error"
            ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
            : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
          }
        </svg>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }

  openForm() {
    const container = document.getElementById("contact-form-container");
    container.classList.add("active");
    document.body.style.overflow = "hidden";

    const firstInput = container.querySelector("input");
    setTimeout(() => {
      firstInput.focus();
    }, 300);
  }

  closeForm() {
    const container = document.getElementById("contact-form-container");
    container.classList.remove("active");
    document.body.style.overflow = "";
  }
}
