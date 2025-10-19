import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import gsap from "gsap";
// import Stats from "three/examples/jsm/libs/stats.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// VARIABLES
let theme = "light";
let bookCover = null;
let lightSwitch = null;
let titleText = null;
let subtitleText = null;
let mixer;
let isMobile = window.matchMedia("(max-width: 992px)").matches;
let canvas = document.querySelector(".experience-canvas");
const loaderWrapper = document.getElementById("loader-wrapper");
const aboutSection = document.querySelector(".section--about");
let clipNames = [
  "fan_rotation",
  "fan_rotation.001",
  "fan_rotation.002",
  "fan_rotation.003",
  "fan_rotation.004",
];
let projects = [
  {
    image: "textures/project-spaze.webp",
    url: "https://www.spaze.social/",
    title: "Spaze",
    description: "Social media platform for creators and artists",
    techStack: ["React", "Node.js", "MongoDB"],
  },
  {
    image: "textures/project-myteachers.jpg",
    url: "https://myteachers.com.au/",
    title: "MyTeachers",
    description: "Online platform connecting students with teachers",
    techStack: ["React", "Express", "PostgreSQL"],
  },
  {
    image: "textures/project-wholesale.jpg",
    url: "https://wholesale.com.np/",
    title: "Wholesale",
    description: "E-commerce platform for wholesale buyers",
    techStack: ["MERN Stack", "Redux", "AWS"],
  },
  {
    image: "textures/project-pelotero.jpg",
    url: "https://www.peloterosenlaweb.com/",
    title: "Pelotero",
    description: "Sports management platform for teams and players",
    techStack: ["React", "Firebase", "Node.js"],
  },
];
let aboutCameraPos = {
  x: 0.12,
  y: 0.2,
  z: 0.55,
};
let aboutCameraRot = {
  x: -1.54,
  y: 0.13,
  z: 1.41,
};
let projectsCameraPos = {
  x: 1,
  y: 0.45,
  z: 0.01,
};
let projectsCameraRot = {
  x: 0.05,
  y: 0.05,
  z: 0,
};
let rubiksCameraPos = {
  x: 0.25,
  y: 0.35,
  z: 0.25,
};
let rubiksCameraRot = {
  x: -0.5,
  y: 0.8,
  z: 0.3,
};
let isViewingRubiks = false;

// SCENE & CAMERA
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
let defaultCameraPos = {
  x: 1.009028643133046,
  y: 0.5463638814987481,
  z: 0.4983449671971262,
};
let defaultCamerRot = {
  x: -0.8313297556598935,
  y: 0.9383399492446749,
  z: 0.7240714481613063,
};
camera.position.set(defaultCameraPos.x, defaultCameraPos.y, defaultCameraPos.z);

// RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// STATS
// const stats = new Stats();
// document.querySelector('.experience').appendChild(stats.dom);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 0.9;
controls.maxDistance = 1.6;
controls.minAzimuthAngle = 0.2;
controls.maxAzimuthAngle = Math.PI * 0.78;
controls.minPolarAngle = 0.3;
controls.maxPolarAngle = Math.PI / 2;
controls.update();

// LOAD MODEL & ASSET
// const loadingManager = new THREE.LoadingManager();
const dracoLoader = new DRACOLoader();
// Use absolute public path so it works in dev and after build
dracoLoader.setDecoderPath("/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(
  "/models/room.glb",
  function (room) {
    // hide loader on loade
    loaderWrapper.style.display = "none";

    // load video
    const video = document.createElement("video");
    video.src = "/textures/arcane.mp4";
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.loop = true;
    video.preload = "auto"; // Stream video instead of full download
    video.crossOrigin = "anonymous"; // Prevent CORS issues
    video.id = "tv-video"; // Add ID for easy reference
    video.style.cssText =
      "position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"; // Completely hide video
    document.body.appendChild(video); // Add to DOM so fullscreen works

    // create video texture
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.NearestFilter;
    videoTexture.magFilter = THREE.NearestFilter;
    videoTexture.generateMipmaps = false;
    videoTexture.encoding = THREE.sRGBEncoding;

    room.scene.children.forEach((child) => {
      // disable shadow by wall
      if (child.name !== "Wall") {
        child.castShadow = true;
      }
      child.receiveShadow = true;

      if (child.children) {
        child.children.forEach((innerChild) => {
          // disable shadow by book cover & switch btn
          if (innerChild.name !== "Book001" && innerChild.name !== "Switch") {
            innerChild.castShadow = true;
          }

          // add texture to book cover
          if (innerChild.name === "Book001") {
            const bookCoverTexture = new THREE.TextureLoader().load(
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

      // transparent texture for glass
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
        bookCover = child.children[0];

        // adding texture to book inner pages
        const bookTexture = new THREE.TextureLoader().load(
          "/textures/Aditya Shirsatrao.png"
        );
        bookTexture.flipY = false;
        child.material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: bookTexture,
        });
      }

      if (child.name === "SwitchBoard") {
        lightSwitch = child.children[0];
      }

      // Enhance keyboard with realistic materials
      if (child.name === "Keyboard" || child.name.includes("Keyboard")) {
        child.traverse((obj) => {
          if (obj.isMesh) {
            obj.material = new THREE.MeshStandardMaterial({
              color: obj.material.color || 0x2a2a2a,
              roughness: 0.6,
              metalness: 0.2,
              envMapIntensity: 0.8,
            });
          }
        });
      }

      // Enhance mouse with glossy finish
      if (child.name === "Mouse" || child.name.includes("Mouse")) {
        child.traverse((obj) => {
          if (obj.isMesh) {
            obj.material = new THREE.MeshStandardMaterial({
              color: obj.material.color || 0x1a1a1a,
              roughness: 0.3,
              metalness: 0.5,
              envMapIntensity: 1.2,
            });
          }
        });
      }

      // Enhance desk/table with wood-like material
      if (
        child.name === "Desk" ||
        child.name === "Table" ||
        child.name.includes("Desk") ||
        child.name.includes("Table")
      ) {
        child.traverse((obj) => {
          if (obj.isMesh) {
            obj.material = new THREE.MeshStandardMaterial({
              color: obj.material.color || 0x8b6f47,
              roughness: 0.7,
              metalness: 0.1,
              envMapIntensity: 0.5,
            });
          }
        });
      }

      // Enhance monitor/screen with realistic glass
      if (
        child.name === "Monitor" ||
        child.name === "Screen" ||
        child.name.includes("Monitor")
      ) {
        child.traverse((obj) => {
          if (obj.isMesh && obj.material) {
            if (obj.name.includes("Glass") || obj.name.includes("Screen")) {
              obj.material = new THREE.MeshPhysicalMaterial({
                color: 0x1a1a1a,
                roughness: 0.1,
                metalness: 0.9,
                clearcoat: 1,
                clearcoatRoughness: 0.1,
                envMapIntensity: 1.5,
              });
            }
          }
        });
      }

      // Enhance chair with fabric/leather material
      if (child.name === "Chair" || child.name.includes("Chair")) {
        child.traverse((obj) => {
          if (obj.isMesh) {
            obj.material = new THREE.MeshStandardMaterial({
              color: obj.material.color || 0x2d2d2d,
              roughness: 0.8,
              metalness: 0.1,
              envMapIntensity: 0.6,
            });
          }
        });
      }

      // Enhance lamp with emissive glow
      if (
        child.name === "Lamp" ||
        child.name.includes("Lamp") ||
        child.name.includes("Light")
      ) {
        child.traverse((obj) => {
          if (obj.isMesh) {
            if (obj.name.includes("Bulb") || obj.name.includes("Light")) {
              obj.material = new THREE.MeshStandardMaterial({
                color: 0xfff4e6,
                emissive: 0xfff4e6,
                emissiveIntensity: 0.5,
                roughness: 0.2,
              });
            }
          }
        });
      }
    });

    // Add a notification to inform users about interactive elements
    const notification = document.createElement("div");
    notification.innerHTML = `
      <div style="position: fixed; bottom: 30px; right: 20px; background-color: rgba(0,0,0,0.7); color: white; 
                padding: 15px; border-radius: 8px; font-size: 14px; z-index: 1000; max-width: 300px;
                transform: translateY(100px); opacity: 0; transition: all 0.5s ease;">
        <strong>New Interactive Elements Added!</strong>
        <ul style="margin: 5px 0 0 15px; padding: 0;">
          <li>Click the TV screen to watch in fullscreen</li>
          <li>Click the phone to see animation effects</li>
          <li>Click the Rubik's cube to see it rotate</li>
        </ul>
      </div>
    `;
    document.body.appendChild(notification.firstElementChild);

    // Show the notification with animation
    setTimeout(() => {
      const notificationElement = document.body.lastElementChild;
      notificationElement.style.transform = "translateY(0)";
      notificationElement.style.opacity = "1";

      // Hide after 10 seconds
      setTimeout(() => {
        notificationElement.style.transform = "translateY(100px)";
        notificationElement.style.opacity = "0";

        // Remove from DOM after animation completes
        setTimeout(() => {
          notificationElement.remove();
        }, 500);
      }, 10000);
    }, 2000);

    scene.add(room.scene);
    animate();

    // add animation
    mixer = new THREE.AnimationMixer(room.scene);
    const clips = room.animations;
    clipNames.forEach((clipName) => {
      const clip = THREE.AnimationClip.findByName(clips, clipName);
      if (clip) {
        const action = mixer.clipAction(clip);
        action.play();
      }
    });

    loadIntroText();

    // add event listeners
    logoListener();
    aboutMenuListener();
    projectsMenuListener();
    init3DWorldClickListeners();
    initResponsive(room.scene);
  },
  function (error) {
    console.error(error);
    // fail-safe: hide loader after error to avoid spinner stuck
    if (loaderWrapper) loaderWrapper.style.display = "none";
  }
);

// ADD LIGHT
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const roomLight = new THREE.PointLight(0xffffff, 2.5, 10);
roomLight.position.set(0.3, 2, 0.5);
roomLight.castShadow = true;
roomLight.shadow.radius = 5;
roomLight.shadow.mapSize.width = 2048;
roomLight.shadow.mapSize.height = 2048;
roomLight.shadow.camera.far = 2.5;
roomLight.shadow.bias = -0.002;
scene.add(roomLight);

// add light for pc fans
const fanLight1 = new THREE.PointLight(0xff0000, 30, 0.2);
const fanLight2 = new THREE.PointLight(0x00ff00, 30, 0.12);
const fanLight3 = new THREE.PointLight(0x00ff00, 30, 0.2);
const fanLight4 = new THREE.PointLight(0x00ff00, 30, 0.2);
const fanLight5 = new THREE.PointLight(0x00ff00, 30, 0.05);
fanLight1.position.set(0, 0.29, -0.29);
fanLight2.position.set(-0.15, 0.29, -0.29);
fanLight3.position.set(0.21, 0.29, -0.29);
fanLight4.position.set(0.21, 0.19, -0.29);
fanLight5.position.set(0.21, 0.08, -0.29);
scene.add(fanLight1);
scene.add(fanLight2);
scene.add(fanLight3);
scene.add(fanLight4);
scene.add(fanLight5);
// add point light for text on wall
const pointLight1 = new THREE.PointLight(0xff0000, 0, 1.1);
const pointLight2 = new THREE.PointLight(0xff0000, 0, 1.1);
const pointLight3 = new THREE.PointLight(0xff0000, 0, 1.1);
const pointLight4 = new THREE.PointLight(0xff0000, 0, 1.1);
pointLight1.position.set(-0.2, 0.6, 0.24);
pointLight2.position.set(-0.2, 0.6, 0.42);
pointLight3.position.set(-0.2, 0.6, 0.01);
pointLight4.position.set(-0.2, 0.6, -0.14);
scene.add(pointLight1);
scene.add(pointLight2);
scene.add(pointLight3);
scene.add(pointLight4);

// SETUP HELPERS
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
// const gridHelper = new THREE.GridHelper(30, 30);
// scene.add(gridHelper);
// const shadowCameraHelper = new THREE.CameraHelper(roomLight.shadow.camera);
// scene.add(shadowCameraHelper);
// const pointLightHelper = new THREE.PointLightHelper(fanLight3, 0.03);
// scene.add(pointLightHelper);

// ADD GUI
// const gui = new dat.GUI();
// const options = {
//   lightX: 0,
//   lightY: 0.08,
//   lightZ: 0,
// };
// gui.add(options, 'lightX').onChange((e) => {
//   mobileLight.position.setX(e);
// });
// gui.add(options, 'lightY').onChange((e) => {
//   mobileLight.position.setY(e);
// });
// gui.add(options, 'lightZ').onChange((e) => {
//   mobileLight.position.setZ(e);
// });

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  // controls.update();
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  renderer.render(scene, camera);
  // stats.update();
}

function loadIntroText() {
  const loader = new FontLoader();
  loader.load("/fonts/unione.json", function (font) {
    const textMaterials = [
      new THREE.MeshPhongMaterial({ color: 0x171f27, flatShading: true }),
      new THREE.MeshPhongMaterial({ color: 0xffffff }),
    ];
    const titleGeo = new TextGeometry("ADITYA SHIRSATRAO", {
      font: font,
      size: 0.08,
      height: 0.01,
    });
    titleText = new THREE.Mesh(titleGeo, textMaterials);
    titleText.rotation.y = Math.PI * 0.5;
    titleText.position.set(-0.27, 0.55, 0.5);
    scene.add(titleText);
  });

  loader.load("/fonts/helvatica.json", function (font) {
    const textMaterials = [
      new THREE.MeshPhongMaterial({ color: 0x171f27, flatShading: true }),
      new THREE.MeshPhongMaterial({ color: 0xffffff }),
    ];
    const subTitleGeo = new TextGeometry("MERN Stack Developer", {
      font: font,
      size: 0.018,
      height: 0,
    });
    subtitleText = new THREE.Mesh(subTitleGeo, textMaterials);
    subtitleText.rotation.y = Math.PI * 0.5;
    subtitleText.position.set(-0.255, 0.5, 0.5);
    scene.add(subtitleText);
  });
}

function switchTheme(themeType) {
  if (themeType === "dark") {
    lightSwitch.rotation.z = Math.PI / 7;
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");

    // main lights
    gsap.to(roomLight.color, {
      r: 0.27254901960784313,
      g: 0.23137254901960785,
      b: 0.6862745098039216,
    });
    gsap.to(ambientLight.color, {
      r: 0.17254901960784313,
      g: 0.23137254901960785,
      b: 0.6862745098039216,
    });
    gsap.to(roomLight, {
      intensity: 1.5,
    });
    gsap.to(ambientLight, {
      intensity: 0.3,
    });

    // fan lights
    gsap.to(fanLight5, {
      distance: 0.07,
    });

    // text color
    gsap.to(titleText.material[0].color, {
      r: 8,
      g: 8,
      b: 8,
      duration: 0,
    });
    gsap.to(titleText.material[1].color, {
      r: 5,
      g: 5,
      b: 5,
      duration: 0,
    });
    gsap.to(subtitleText.material[0].color, {
      r: 8,
      g: 8,
      b: 8,
      duration: 0,
    });
    gsap.to(subtitleText.material[1].color, {
      r: 5,
      g: 5,
      b: 5,
      duration: 0,
    });

    // text light
    gsap.to(pointLight1, {
      intensity: 0.6,
    });
    gsap.to(pointLight2, {
      intensity: 0.6,
    });
    gsap.to(pointLight3, {
      intensity: 0.6,
    });
    gsap.to(pointLight4, {
      intensity: 0.6,
    });
  } else {
    lightSwitch.rotation.z = 0;
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");

    // main light
    gsap.to(roomLight.color, {
      r: 1,
      g: 1,
      b: 1,
    });
    gsap.to(ambientLight.color, {
      r: 1,
      g: 1,
      b: 1,
    });
    gsap.to(roomLight, {
      intensity: 2.5,
    });
    gsap.to(ambientLight, {
      intensity: 0.6,
    });

    // fan light
    gsap.to(fanLight5, {
      distance: 0.05,
    });

    // text color
    gsap.to(titleText.material[0].color, {
      r: 0.09019607843137255,
      g: 0.12156862745098039,
      b: 0.15294117647058825,
      duration: 0,
    });
    gsap.to(titleText.material[1].color, {
      r: 1,
      g: 1,
      b: 1,
      duration: 0,
    });
    gsap.to(subtitleText.material[0].color, {
      r: 0.09019607843137255,
      g: 0.12156862745098039,
      b: 0.15294117647058825,
      duration: 0,
    });
    gsap.to(subtitleText.material[1].color, {
      r: 1,
      g: 1,
      b: 1,
      duration: 0,
    });

    // text light
    gsap.to(pointLight1, {
      intensity: 0,
    });
    gsap.to(pointLight2, {
      intensity: 0,
    });
    gsap.to(pointLight3, {
      intensity: 0,
    });
    gsap.to(pointLight4, {
      intensity: 0,
    });
  }
}

function enableOrbitControls() {
  controls.enabled = true;
}

function disableOrbitControls() {
  controls.enabled = false;
}

function enableCloseBtn() {
  document.getElementById("close-btn").classList.add("show");
}

function disableCloseBtn() {
  document.getElementById("close-btn").classList.remove("show");
}

function resetBookCover() {
  if (!bookCover) return;

  // Kill any ongoing animations on the book cover
  gsap.killTweensOf(bookCover.rotation);

  // Ensure book closes properly
  gsap.to(bookCover.rotation, {
    x: 0,
    duration: 1.5,
    ease: "power2.inOut",
    onComplete: () => {
      // Force exact value to prevent floating point errors
      bookCover.rotation.x = 0;
    },
  });
}

function resetProjects() {
  if (projects.length === 0) return;

  projects.forEach((project, i) => {
    gsap.to(project.mesh.material, {
      opacity: 0,
      duration: 1,
    });
    gsap.to(project.mesh.position, {
      y: project.y,
      duration: 1,
    });
    gsap.to(project.mesh.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0,
      delay: 1,
    });
  });
}

function resetCamera() {
  resetBookCover();
  resetProjects();
  closeAboutPanel();
  disableCloseBtn();

  // Stop Rubik's cube animation if it was playing
  if (isViewingRubiks) {
    isViewingRubiks = false;
    // Kill all ongoing GSAP animations on Rubik's cube
    gsap.killTweensOf(
      scene.children.filter(
        (child) =>
          child.name?.includes("Cube") ||
          child.name?.includes("Rubik") ||
          child.name?.includes("Rubix")
      )
    );
  }

  gsap.to(camera.position, {
    ...defaultCameraPos,
    duration: 1.5,
  });
  gsap.to(camera.rotation, {
    ...defaultCamerRot,
    duration: 1.5,
  });
  gsap.delayedCall(1.5, enableOrbitControls);

  // reset dimmed light for about display
  if (theme !== "dark") {
    gsap.to(roomLight, {
      intensity: 2.5,
      duration: 1.5,
    });
  }
}

function logoListener() {
  document.getElementById("logo").addEventListener("click", function (e) {
    e.preventDefault();
    resetCamera();
  });
}

function cameraToAbout() {
  if (!bookCover) return;

  gsap.to(camera.position, {
    ...aboutCameraPos,
    duration: 1.5,
  });
  gsap.to(camera.rotation, {
    ...aboutCameraRot,
    duration: 1.5,
  });
  gsap.to(bookCover.rotation, {
    x: Math.PI,
    duration: 1.5,
    delay: 1.5,
    ease: "power2.inOut",
  });

  // prevent about text clutter due to bright light
  if (theme !== "dark") {
    gsap.to(roomLight, {
      intensity: 1,
      duration: 1.5,
    });
  }
}

function aboutMenuListener() {
  document.getElementById("about-menu").addEventListener("click", function (e) {
    e.preventDefault();
    disableOrbitControls();
    resetProjects();
    openAboutPanel();
    cameraToAbout();
    gsap.delayedCall(1.5, enableCloseBtn);
  });
}

function projectsMenuListener() {
  // create project planes with textures
  projects.forEach((project, i) => {
    const colIndex = i % 3 === 0 ? 0 : 1;
    const rowIndex = Math.floor(i / 3);
    const geometry = new THREE.PlaneGeometry(0.71, 0.4);

    // Create project container to hold more information
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: new THREE.TextureLoader().load(
        "/" + project.image.replace(/^\/+/, "")
      ),
      transparent: true,
      opacity: 0.0,
    });

    const projectPlane = new THREE.Mesh(geometry, material);
    projectPlane.name = "project";
    projectPlane.userData = {
      url: project.url,
      title: project.title,
      description: project.description,
      techStack: project.techStack,
    };

    // Position with slight offset for hover effect
    projectPlane.position.set(
      0.3 + i * 0.8 * colIndex,
      1 - rowIndex * 0.5,
      -1.15
    );
    projectPlane.scale.set(0, 0, 0);

    // Add hover effect with shader
    projectPlane.onBeforeRender = function () {
      if (this.isHovered) {
        this.position.z = -1.13; // Bring forward slightly on hover
      }
    };

    // mesh & y vars needed for animation
    projects[i].mesh = projectPlane;
    projects[i].y = 1 - rowIndex * 0.5;
    scene.add(projectPlane);
  });

  document
    .getElementById("projects-menu")
    .addEventListener("click", function (e) {
      e.preventDefault();
      disableOrbitControls();
      resetBookCover();
      closeAboutPanel();
      gsap.to(camera.position, {
        ...projectsCameraPos,
        duration: 1.5,
      });
      gsap.to(camera.rotation, {
        ...projectsCameraRot,
        duration: 1.5,
      });
      gsap.delayedCall(1.5, enableCloseBtn);

      // animate & show project items
      projects.forEach((project, i) => {
        project.mesh.scale.set(1, 1, 1);
        gsap.to(project.mesh.material, {
          opacity: 1,
          duration: 1.5,
          delay: 1.5 + i * 0.1,
        });
        gsap.to(project.mesh.position, {
          y: project.y + 0.05,
          duration: 1,
          delay: 1.5 + i * 0.1,
        });
      });
    });
}

function init3DWorldClickListeners() {
  const mousePosition = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  let intersects;
  let hoveredProject = null;

  // Handle hover effects
  window.addEventListener("mousemove", function (e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mousePosition, camera);
    intersects = raycaster.intersectObjects(scene.children);

    // Reset all hover states
    projects.forEach((project) => {
      if (project.mesh) {
        project.mesh.isHovered = false;
        gsap.to(project.mesh.position, {
          z: -1.15,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(project.mesh.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });

    // Apply hover effect to hovered project
    let foundHoveredProject = false;
    intersects.forEach((intersect) => {
      if (intersect.object.name === "project") {
        foundHoveredProject = true;
        intersect.object.isHovered = true;
        hoveredProject = intersect.object;

        // Apply hover animation
        gsap.to(intersect.object.position, {
          z: -1.13,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(intersect.object.scale, {
          x: 1.05,
          y: 1.05,
          z: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  });

  window.addEventListener("click", function (e) {
    // store value set to prevent multi time update in foreach loop
    const newTheme = theme === "light" ? "dark" : "light";

    // prevent about focus on button click which are positioned above book in mobile view
    const closeBtn = document.getElementById("close-btn");
    const projectsBtn = document.getElementById("projects-menu");
    if (
      e.target === closeBtn ||
      closeBtn.contains(e.target) ||
      e.target === projectsBtn ||
      projectsBtn.contains(e.target)
    ) {
      return false;
    }

    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mousePosition, camera);
    intersects = raycaster.intersectObjects(scene.children, true); // Add recursive search

    if (intersects.length > 0) {
      console.log(
        "Clicked object:",
        intersects[0].object.name,
        "Parent:",
        intersects[0].object.parent?.name
      );
    }

    intersects.forEach((intersect) => {
      if (intersect.object.name === "project") {
        // Add click animation
        gsap.to(intersect.object.scale, {
          x: 0.95,
          y: 0.95,
          z: 0.95,
          duration: 0.1,
          ease: "power2.in",
          onComplete: () => {
            gsap.to(intersect.object.scale, {
              x: 1.05,
              y: 1.05,
              z: 1.05,
              duration: 0.2,
              ease: "power2.out",
              onComplete: () => {
                // Open URL after animation completes
                if (intersect.object.userData.url) {
                  window.open(intersect.object.userData.url);
                }
              },
            });
          },
        });
      }

      if (
        intersect.object.name === "Book" ||
        intersect.object.name === "Book001"
      ) {
        disableOrbitControls();
        cameraToAbout();
        openAboutPanel();
        gsap.delayedCall(1.5, enableCloseBtn);
      }

      // Handle TV screen click for fullscreen video
      if (
        intersect.object.name === "Stand" ||
        intersect.object.name === "TV" ||
        intersect.object.name === "Screen" ||
        (intersect.object.parent &&
          (intersect.object.parent.name === "Stand" ||
            intersect.object.parent.name === "TV" ||
            intersect.object.parent.name === "Screen"))
      ) {
        console.log("TV clicked! Opening video modal...");
        openVideoModal();
      }

      // Phone interaction - animate or show details
      const isPhoneObject =
        intersect.object.name.includes("Phone") ||
        (intersect.object.parent &&
          intersect.object.parent.name.includes("Phone")) ||
        intersect.object.name.includes("Mobile") ||
        (intersect.object.parent &&
          intersect.object.parent.name.includes("Mobile"));

      if (isPhoneObject) {
        // Get the actual phone object (either this one or the parent)
        const phoneObject =
          intersect.object.name.includes("Phone") ||
          intersect.object.name.includes("Mobile")
            ? intersect.object
            : intersect.object.parent;

        // Animate the phone with a spin and bounce
        gsap.to(phoneObject.rotation, {
          y: phoneObject.rotation.y + Math.PI * 2, // 360-degree spin
          duration: 1,
          ease: "power1.inOut",
        });

        gsap.to(phoneObject.position, {
          y: phoneObject.position.y + 0.1, // Bounce up
          duration: 0.5,
          yoyo: true, // Come back down
          repeat: 1,
          ease: "power1.inOut",
        });
      }

      // Rubik's cube interaction - zoom in to view it
      const isCubeObject =
        intersect.object.name.includes("Cube") ||
        intersect.object.name.includes("Rubik") ||
        intersect.object.name.includes("Rubix") ||
        (intersect.object.parent &&
          (intersect.object.parent.name.includes("Cube") ||
            intersect.object.parent.name.includes("Rubik") ||
            intersect.object.parent.name.includes("Rubix")));

      if (isCubeObject) {
        triggerPageTransition(() => {
          // Get the actual cube object (either this one or the parent)
          const cubeObject =
            intersect.object.name.includes("Cube") ||
            intersect.object.name.includes("Rubik") ||
            intersect.object.name.includes("Rubix")
              ? intersect.object
              : intersect.object.parent;

          // Zoom camera to Rubik's cube
          disableOrbitControls();
          isViewingRubiks = true;

          gsap.to(camera.position, {
            ...rubiksCameraPos,
            duration: 1.5,
            ease: "power2.inOut",
          });
          gsap.to(camera.rotation, {
            ...rubiksCameraRot,
            duration: 1.5,
            ease: "power2.inOut",
          });

          // Animate the cube rotation in all axes
          gsap.to(cubeObject.rotation, {
            x: cubeObject.rotation.x + Math.PI / 2, // 90 degrees X
            y: cubeObject.rotation.y + Math.PI, // 180 degrees Y
            z: cubeObject.rotation.z + Math.PI / 4, // 45 degrees Z
            duration: 1.5,
            ease: "power2.inOut",
            repeat: -1, // Infinite rotation while viewing
            yoyo: true,
          });

          // Enable close button after animation
          gsap.delayedCall(1.5, enableCloseBtn);
        });
      }

      if (
        intersect.object.name === "SwitchBoard" ||
        intersect.object.name === "Switch"
      ) {
        theme = newTheme;
        switchTheme(theme);
      }
    });
  });
}

// RESPONSIVE
function initResponsive(roomScene) {
  if (isMobile) {
    roomScene.scale.set(0.95, 0.95, 0.95);
    aboutCameraPos = {
      x: 0.09,
      y: 0.23,
      z: 0.51,
    };
    aboutCameraRot = {
      x: -1.57,
      y: 0,
      z: 1.57,
    };

    // rect light
    // rectLight.width = 0.406;
    // rectLight.height = 0.3;
    // rectLight.position.z = -0.34;

    // project
    projectsCameraPos = {
      x: 1.1,
      y: 0.82,
      z: 0.5,
    };
    projectsCameraRot = {
      x: 0,
      y: 0,
      z: 1.55,
    };
    projects.forEach((project, i) => {
      project.mesh.position.z = -1.13;
    });

    controls.maxDistance = 1.5;
    controls.maxAzimuthAngle = Math.PI * 0.75;
  }
}

// close button
document.getElementById("close-btn").addEventListener("click", (e) => {
  e.preventDefault();
  resetCamera();
});

// contact menu
document.getElementById("contact-btn").addEventListener("click", (e) => {
  e.preventDefault();
  document
    .querySelector(".contact-menu__dropdown")
    .classList.toggle("contact-menu__dropdown--open");
});

document.addEventListener("mouseup", (e) => {
  const container = document.querySelector(".contact-menu");
  if (!container.contains(e.target)) {
    container
      .querySelector(".contact-menu__dropdown")
      .classList.remove("contact-menu__dropdown--open");
  }
});

// update camera, renderer on resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Handle fullscreen exit - re-mute video
document.addEventListener("fullscreenchange", () => {
  const videoElement = document.getElementById("tv-video");
  if (videoElement && !document.fullscreenElement) {
    videoElement.muted = true;
    videoElement.volume = 0;
  }
});

// Safari fullscreen change
document.addEventListener("webkitfullscreenchange", () => {
  const videoElement = document.getElementById("tv-video");
  if (videoElement && !document.webkitFullscreenElement) {
    videoElement.muted = true;
    videoElement.volume = 0;
  }
});

// About panel helpers
function openAboutPanel() {
  if (aboutSection) aboutSection.classList.add("open");
  // Hide navbar when about section opens
  const header = document.querySelector("header");
  if (header) header.classList.add("hidden");
}

function closeAboutPanel() {
  if (aboutSection) aboutSection.classList.remove("open");
  // Show navbar when about section closes
  const header = document.querySelector("header");
  if (header) header.classList.remove("hidden");
}

// Video Modal Functions
function openVideoModal() {
  const modal = document.getElementById("video-modal");
  const video = document.getElementById("modal-tv-video");

  if (modal && video) {
    modal.style.display = "flex"; // Show the modal
    modal.classList.add("active");
    video.muted = false; // Unmute for modal playback
    video.volume = 0.7; // Set volume to 70%
    video.currentTime = 0;
    video.play();
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }
}

function closeVideoModal() {
  const modal = document.getElementById("video-modal");
  const video = document.getElementById("modal-tv-video");

  if (modal && video) {
    modal.classList.remove("active");
    modal.style.display = "none"; // Hide the modal
    video.pause();
    video.muted = true; // Mute again when closed
    video.currentTime = 0;
    document.body.style.overflow = ""; // Restore scrolling
  }
}

// Initialize modal as closed on page load
function initializeModal() {
  const modal = document.getElementById("video-modal");
  const video = document.getElementById("modal-tv-video");

  if (modal) {
    modal.classList.remove("active");
    modal.style.display = "none";
  }

  if (video) {
    video.pause();
    video.muted = true;
    video.currentTime = 0;
  }

  document.body.style.overflow = "";
}

// Call initialization immediately
initializeModal();

// Video modal event listeners
document
  .getElementById("close-video-modal")
  ?.addEventListener("click", closeVideoModal);
document.getElementById("video-modal")?.addEventListener("click", function (e) {
  if (
    e.target === this ||
    e.target.classList.contains("video-modal__overlay")
  ) {
    closeVideoModal();
  }
});

// Close video modal with Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeVideoModal();
  }
});
