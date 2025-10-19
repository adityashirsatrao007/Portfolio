import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export class ModelLoader {
  constructor() {
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath("/draco/");

    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    this.textureLoader = new THREE.TextureLoader();
  }

  async loadModel(path) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        path,
        (gltf) => resolve(gltf),
        (progress) => {
          const percentComplete = (progress.loaded / progress.total) * 100;
          console.log(`Loading model: ${percentComplete.toFixed(2)}%`);
        },
        (error) => reject(error)
      );
    });
  }

  loadTexture(path) {
    return this.textureLoader.load(path);
  }

  setupModelMaterials(model) {
    model.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material.needsUpdate = true;
        }
      }
    });
  }

  dispose() {
    this.dracoLoader.dispose();
  }
}
