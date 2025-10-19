export class CursorEffect {
  constructor() {
    this.cursor = { x: 0, y: 0 };
    this.cursorFollower = { x: 0, y: 0 };
    this.cursorElement = null;
    this.followerElement = null;

    this.init();
  }

  init() {
    this.cursorElement = document.createElement("div");
    this.cursorElement.className = "custom-cursor";
    this.cursorElement.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      pointer-events: none;
      z-index: 10000;
      mix-blend-mode: difference;
      transition: transform 0.1s ease;
    `;
    document.body.appendChild(this.cursorElement);

    this.followerElement = document.createElement("div");
    this.followerElement.className = "cursor-follower";
    this.followerElement.style.cssText = `
      position: fixed;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid rgba(102, 126, 234, 0.5);
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.15s ease;
    `;
    document.body.appendChild(this.followerElement);

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener("mousemove", (e) => {
      this.cursor.x = e.clientX;
      this.cursor.y = e.clientY;

      this.cursorElement.style.left = `${this.cursor.x}px`;
      this.cursorElement.style.top = `${this.cursor.y}px`;
    });

    document.addEventListener("mousedown", () => {
      this.cursorElement.style.transform = "scale(0.8)";
      this.followerElement.style.transform = "scale(0.9)";
    });

    document.addEventListener("mouseup", () => {
      this.cursorElement.style.transform = "scale(1)";
      this.followerElement.style.transform = "scale(1)";
    });

    const interactiveElements = document.querySelectorAll("a, button, .clickable");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        this.cursorElement.style.transform = "scale(1.5)";
        this.followerElement.style.transform = "scale(1.3)";
      });

      el.addEventListener("mouseleave", () => {
        this.cursorElement.style.transform = "scale(1)";
        this.followerElement.style.transform = "scale(1)";
      });
    });

    this.animate();
  }

  animate() {
    this.cursorFollower.x += (this.cursor.x - this.cursorFollower.x) * 0.1;
    this.cursorFollower.y += (this.cursor.y - this.cursorFollower.y) * 0.1;

    this.followerElement.style.left = `${this.cursorFollower.x - 20}px`;
    this.followerElement.style.top = `${this.cursorFollower.y - 20}px`;

    requestAnimationFrame(() => this.animate());
  }

  dispose() {
    if (this.cursorElement) {
      this.cursorElement.remove();
    }
    if (this.followerElement) {
      this.followerElement.remove();
    }
  }
}
