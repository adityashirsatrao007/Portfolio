import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.isMobile = window.matchMedia("(max-width: 992px)").matches;

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    this.setupLights();
    this.setupEventListeners();
  }

  initScene() {
    this.scene = new THREE.Scene();
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );

    const defaultCameraPos = {
      x: 1.009028643133046,
      y: 0.5463638814987481,
      z: 0.4983449671971262,
    };

    this.camera.position.set(
      defaultCameraPos.x,
      defaultCameraPos.y,
      defaultCameraPos.z
    );
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.minDistance = 0.9;
    this.controls.maxDistance = 1.6;
    this.controls.minAzimuthAngle = 0.2;
    this.controls.maxAzimuthAngle = Math.PI * 0.78;
    this.controls.minPolarAngle = 0.3;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.update();
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const roomLight = new THREE.PointLight(0xffffff, 2.5, 10);
    roomLight.position.set(0.3, 2, 0.5);
    roomLight.castShadow = true;
    roomLight.shadow.radius = 5;
    roomLight.shadow.mapSize.width = 2048;
    roomLight.shadow.mapSize.height = 2048;
    roomLight.shadow.camera.far = 2.5;
    roomLight.shadow.bias = -0.002;
    this.scene.add(roomLight);

    this.lights = {
      ambient: ambientLight,
      room: roomLight,
    };
  }

  setupEventListeners() {
    window.addEventListener("resize", () => this.onWindowResize());
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  getRenderer() {
    return this.renderer;
  }

  getControls() {
    return this.controls;
  }

  getLights() {
    return this.lights;
  }
}
