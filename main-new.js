import "./style.css";
import "./src/styles/enhanced.css";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import { SceneManager } from "./src/core/Scene.js";
import { ModelLoader } from "./src/core/ModelLoader.js";
import { ParticleSystem } from "./src/components/ParticleSystem.js";
import { CursorEffect } from "./src/components/CursorEffect.js";
import { ThemeManager } from "./src/components/ThemeManager.js";
import { ProjectsManager } from "./src/components/ProjectsManager.js";
import { ContactForm } from "./src/components/ContactForm.js";
import { ScrollEffects } from "./src/components/ScrollEffects.js";

gsap.registerPlugin(ScrollTrigger);

class PortfolioApp {
  constructor() {
    this.canvas = document.querySelector(".experience-canvas");
    this.loaderWrapper = document.getElementById("loader-wrapper");
    this.aboutSection = document.querySelector(".section--about");

    this.titleText = null;
    this.subtitleText = null;
    this.bookCover = null;
    this.lightSwitch = null;
    this.mixer = null;
    this.clock = new THREE.Clock();

    this.isMobile = window.matchMedia("(max-width: 992px)").matches;

    this.cameraPositions = {
      default: {
        x: 1.009028643133046,
        y: 0.5463638814987481,
        z: 0.4983449671971262,
      },
      defaultRot: {
        x: -0.8313297556598935,
        y: 0.9383399492446749,
        z: 0.7240714481613063,
      },
      about: this.isMobile
        ? { x: 0.09, y: 0.23, z: 0.51 }
        : { x: 0.12, y: 0.2, z: 0.55 },
      aboutRot: this.isMobile
        ? { x: -1.57, y: 0, z: 1.57 }
        : { x: -1.54, y: 0.13, z: 1.41 },
      projects: this.isMobile
        ? { x: 1.1, y: 0.82, z: 0.5 }
        : { x: 1, y: 0.45, z: 0.01 },
      projectsRot: this.isMobile
        ? { x: 0, y: 0, z: 1.55 }
        : { x: 0.05, y: 0.05, z: 0 },
    };

    this.init();
  }

  async init() {
    this.sceneManager = new SceneManager(this.canvas);
    this.scene = this.sceneManager.getScene();
    this.camera = this.sceneManager.getCamera();
    this.renderer = this.sceneManager.getRenderer();
    this.controls = this.sceneManager.getControls();
    this.lights = this.sceneManager.getLights();

    this.particleSystem = new ParticleSystem(this.scene);

    if (!this.isMobile) {
      this.cursorEffect = new CursorEffect();
    }

    this.scrollEffects = new ScrollEffects();
    this.contactForm = new ContactForm();

    this.projectsManager = new ProjectsManager(this.scene, this.camera);

    this.modelLoader = new ModelLoader();

    await this.loadRoom();
    await this.loadIntroText();

    this.themeManager = new ThemeManager(
      this.lights,
      this.titleText,
      this.subtitleText,
      this.lightSwitch
    );

    this.setupEventListeners();
    this.animate();

    this.loaderWrapper.style.display = "none";
  }

  async loadRoom() {
    try {
      const room = await this.modelLoader.loadModel("/models/room.glb");

      const video = document.createElement("video");
      video.src = "/textures/arcane.mp4";
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.loop = true;
      video.preload = "auto";
      video.crossOrigin = "anonymous";
      video.id = "tv-video";
      video.style.cssText =
        "position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none;";
      document.body.appendChild(video);

      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.NearestFilter;
      videoTexture.magFilter = THREE.NearestFilter;
      videoTexture.generateMipmaps = false;
      videoTexture.encoding = THREE.sRGBEncoding;

      room.scene.children.forEach((child) => {
        if (child.name !== "Wall") {
          child.castShadow = true;
        }
        child.receiveShadow = true;

        if (child.children) {
          child.children.forEach((innerChild) => {
            if (innerChild.name !== "Book001" && innerChild.name !== "Switch") {
              innerChild.castShadow = true;
            }

            if (innerChild.name === "Book001") {
              const bookCoverTexture = this.modelLoader.loadTexture(
                "/textures/Dark mysterious sci-fi adventure novel book cover.png"
              );
              bookCoverTexture.flipY = false;
              innerChild.material = new THREE.MeshStandardMaterial({
                side: THREE.DoubleSide,
                color: 0xffffff,
                map: bookCoverTexture,
              });
            }

            innerChild.receiveShadow = true;
          });
        }

        if (child.name === "Stand") {
          child.children[0].material = new THREE.MeshBasicMaterial({
            map: videoTexture,
          });
          video.play();
        }

        if (child.name === "CPU") {
          child.children[0].material = new THREE.MeshPhysicalMaterial();
          child.children[0].material.roughness = 0;
          child.children[0].material.color.set(0x999999);
          child.children[0].material.ior = 3;
          child.children[0].material.transmission = 1;
          child.children[0].material.opacity = 1;

          child.children[1].material = new THREE.MeshPhysicalMaterial();
          child.children[1].material.roughness = 0;
          child.children[1].material.color.set(0x999999);
          child.children[1].material.ior = 3;
          child.children[1].material.transmission = 1;
          child.children[1].material.opacity = 1;
        }

        if (child.name === "Book") {
          this.bookCover = child.children[0];

          const bookTexture = this.modelLoader.loadTexture(
            "/textures/Aditya Shirsatrao.png"
          );
          bookTexture.flipY = false;
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: bookTexture,
          });
        }

        if (child.name === "SwitchBoard") {
          this.lightSwitch = child.children[0];
        }
      });

      if (this.isMobile) {
        room.scene.scale.set(0.95, 0.95, 0.95);
      }

      this.scene.add(room.scene);

      this.mixer = new THREE.AnimationMixer(room.scene);
      const clips = room.animations;
      const clipNames = [
        "fan_rotation",
        "fan_rotation.001",
        "fan_rotation.002",
        "fan_rotation.003",
        "fan_rotation.004",
      ];

      clipNames.forEach((clipName) => {
        const clip = THREE.AnimationClip.findByName(clips, clipName);
        if (clip) {
          const action = this.mixer.clipAction(clip);
          action.play();
        }
      });
    } catch (error) {
      console.error("Error loading room:", error);
      this.loaderWrapper.style.display = "none";
    }
  }

  async loadIntroText() {
    const loader = new FontLoader();

    return new Promise((resolve) => {
      loader.load("/fonts/unione.json", (font) => {
        const textMaterials = [
          new THREE.MeshPhongMaterial({ color: 0x171f27, flatShading: true }),
          new THREE.MeshPhongMaterial({ color: 0xffffff }),
        ];
        const titleGeo = new TextGeometry("ADITYA SHIRSATRAO", {
          font: font,
          size: 0.08,
          height: 0.01,
        });
        this.titleText = new THREE.Mesh(titleGeo, textMaterials);
        this.titleText.rotation.y = Math.PI * 0.5;
        this.titleText.position.set(-0.27, 0.55, 0.5);
        this.scene.add(this.titleText);

        loader.load("/fonts/helvatica.json", (font2) => {
          const subTitleGeo = new TextGeometry("MERN Stack Developer", {
            font: font2,
            size: 0.018,
            height: 0,
          });
          this.subtitleText = new THREE.Mesh(subTitleGeo, textMaterials);
          this.subtitleText.rotation.y = Math.PI * 0.5;
          this.subtitleText.position.set(-0.255, 0.5, 0.5);
          this.scene.add(this.subtitleText);
          resolve();
        });
      });
    });
  }

  setupEventListeners() {
    document.getElementById("logo").addEventListener("click", (e) => {
      e.preventDefault();
      this.resetCamera();
    });

    document.getElementById("about-menu").addEventListener("click", (e) => {
      e.preventDefault();
      this.goToAbout();
    });

    document.getElementById("projects-menu").addEventListener("click", (e) => {
      e.preventDefault();
      this.goToProjects();
    });

    document.getElementById("close-btn").addEventListener("click", (e) => {
      e.preventDefault();
      this.resetCamera();
    });

    const originalContactBtn = document.getElementById("contact-btn");
    if (originalContactBtn) {
      originalContactBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.contactForm.openForm();
      });
    }

    window.addEventListener("click", (e) => {
      const closeBtn = document.getElementById("close-btn");
      const projectsBtn = document.getElementById("projects-menu");

      if (
        e.target === closeBtn ||
        closeBtn.contains(e.target) ||
        e.target === projectsBtn ||
        projectsBtn.contains(e.target)
      ) {
        return;
      }

      this.projectsManager.handleClick(e.clientX, e.clientY);
    });

    document.addEventListener("fullscreenchange", () => {
      const videoElement = document.getElementById("tv-video");
      if (videoElement && !document.fullscreenElement) {
        videoElement.muted = true;
        videoElement.volume = 0;
      }
    });
  }

  goToAbout() {
    this.disableOrbitControls();
    this.projectsManager.hideProjects();
    this.closeAboutPanel();

    gsap.to(this.camera.position, {
      ...this.cameraPositions.about,
      duration: 1.5,
    });
    gsap.to(this.camera.rotation, {
      ...this.cameraPositions.aboutRot,
      duration: 1.5,
    });

    if (this.bookCover) {
      gsap.to(this.bookCover.rotation, {
        x: Math.PI,
        duration: 1.5,
        delay: 1.5,
        ease: "power2.inOut",
      });
    }

    if (this.themeManager.getCurrentTheme() !== "dark") {
      gsap.to(this.lights.room, { intensity: 1, duration: 1.5 });
    }

    this.openAboutPanel();
    gsap.delayedCall(1.5, () => this.enableCloseBtn());
  }

  goToProjects() {
    this.disableOrbitControls();
    this.resetBookCover();
    this.closeAboutPanel();

    gsap.to(this.camera.position, {
      ...this.cameraPositions.projects,
      duration: 1.5,
    });
    gsap.to(this.camera.rotation, {
      ...this.cameraPositions.projectsRot,
      duration: 1.5,
    });

    gsap.delayedCall(1.5, () => this.enableCloseBtn());
    this.projectsManager.showProjects();
  }

  resetCamera() {
    this.resetBookCover();
    this.projectsManager.hideProjects();
    this.closeAboutPanel();
    this.disableCloseBtn();

    gsap.to(this.camera.position, {
      ...this.cameraPositions.default,
      duration: 1.5,
    });
    gsap.to(this.camera.rotation, {
      ...this.cameraPositions.defaultRot,
      duration: 1.5,
    });

    gsap.delayedCall(1.5, () => this.enableOrbitControls());

    if (this.themeManager.getCurrentTheme() !== "dark") {
      gsap.to(this.lights.room, { intensity: 2.5, duration: 1.5 });
    }
  }

  resetBookCover() {
    if (!this.bookCover) return;
    gsap.killTweensOf(this.bookCover.rotation);
    gsap.to(this.bookCover.rotation, {
      x: 0,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        this.bookCover.rotation.x = 0;
      },
    });
  }

  enableOrbitControls() {
    this.controls.enabled = true;
  }

  disableOrbitControls() {
    this.controls.enabled = false;
  }

  enableCloseBtn() {
    document.getElementById("close-btn").classList.add("show");
  }

  disableCloseBtn() {
    document.getElementById("close-btn").classList.remove("show");
  }

  openAboutPanel() {
    if (this.aboutSection) {
      this.aboutSection.classList.add("open");
    }
    const header = document.querySelector("header");
    if (header) header.classList.add("hidden");
  }

  closeAboutPanel() {
    if (this.aboutSection) {
      this.aboutSection.classList.remove("open");
    }
    const header = document.querySelector("header");
    if (header) header.classList.remove("hidden");
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.mixer) {
      this.mixer.update(this.clock.getDelta());
    }

    if (this.particleSystem) {
      this.particleSystem.update(Date.now());
    }

    this.sceneManager.render();
  }
}

new PortfolioApp();
