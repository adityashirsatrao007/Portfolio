import gsap from "gsap";

export class ThemeManager {
  constructor(lights, titleText, subtitleText, lightSwitch) {
    this.currentTheme = "light";
    this.lights = lights;
    this.titleText = titleText;
    this.subtitleText = subtitleText;
    this.lightSwitch = lightSwitch;
    this.pointLights = [];

    this.detectSystemTheme();
    this.createToggleButton();
  }

  detectSystemTheme() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      this.switchTheme("dark");
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      this.switchTheme(e.matches ? "dark" : "light");
    });
  }

  createToggleButton() {
    const button = document.createElement("button");
    button.id = "theme-toggle";
    button.className = "theme-toggle";
    button.setAttribute("aria-label", "Toggle theme");
    button.innerHTML = `
      <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;

    button.addEventListener("click", () => {
      this.toggleTheme();
    });

    document.body.appendChild(button);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
    this.switchTheme(this.currentTheme);
  }

  switchTheme(themeType) {
    this.currentTheme = themeType;

    if (themeType === "dark") {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");

      if (this.lightSwitch) {
        this.lightSwitch.rotation.z = Math.PI / 7;
      }

      if (this.lights.room) {
        gsap.to(this.lights.room.color, {
          r: 0.27254901960784313,
          g: 0.23137254901960785,
          b: 0.6862745098039216,
        });
        gsap.to(this.lights.room, { intensity: 1.5 });
      }

      if (this.lights.ambient) {
        gsap.to(this.lights.ambient.color, {
          r: 0.17254901960784313,
          g: 0.23137254901960785,
          b: 0.6862745098039216,
        });
        gsap.to(this.lights.ambient, { intensity: 0.3 });
      }

      this.updateTextColors(8, 5);
    } else {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");

      if (this.lightSwitch) {
        this.lightSwitch.rotation.z = 0;
      }

      if (this.lights.room) {
        gsap.to(this.lights.room.color, { r: 1, g: 1, b: 1 });
        gsap.to(this.lights.room, { intensity: 2.5 });
      }

      if (this.lights.ambient) {
        gsap.to(this.lights.ambient.color, { r: 1, g: 1, b: 1 });
        gsap.to(this.lights.ambient, { intensity: 0.6 });
      }

      this.updateTextColors(0.09019607843137255, 1);
    }
  }

  updateTextColors(primary, secondary) {
    if (this.titleText && this.titleText.material) {
      gsap.to(this.titleText.material[0].color, {
        r: primary,
        g: primary,
        b: primary,
        duration: 0,
      });
      gsap.to(this.titleText.material[1].color, {
        r: secondary,
        g: secondary,
        b: secondary,
        duration: 0,
      });
    }

    if (this.subtitleText && this.subtitleText.material) {
      gsap.to(this.subtitleText.material[0].color, {
        r: primary,
        g: primary,
        b: primary,
        duration: 0,
      });
      gsap.to(this.subtitleText.material[1].color, {
        r: secondary,
        g: secondary,
        b: secondary,
        duration: 0,
      });
    }
  }

  setPointLights(lights) {
    this.pointLights = lights;
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}
