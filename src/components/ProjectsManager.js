import gsap from "gsap";
import * as THREE from "three";
import { projects as projectsData, categories } from "../data/projects.js";

export class ProjectsManager {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.projects = [];
    this.projectMeshes = [];
    this.currentFilter = "All";
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.initProjects();
    this.createFilterUI();
    this.createModal();
    this.setupEventListeners();
  }

  initProjects() {
    const loader = new THREE.TextureLoader();

    projectsData.forEach((project, index) => {
      const colIndex = index % 3 === 0 ? 0 : 1;
      const rowIndex = Math.floor(index / 3);
      const geometry = new THREE.PlaneGeometry(0.71, 0.4);

      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: loader.load(project.image.startsWith("http") ? project.image : `/${project.image}`),
        transparent: true,
        opacity: 0.0,
      });

      const projectPlane = new THREE.Mesh(geometry, material);
      projectPlane.name = "project";
      projectPlane.userData = { ...project, index };

      projectPlane.position.set(
        0.3 + (index % 2) * 0.8,
        1 - rowIndex * 0.5,
        -1.15
      );
      projectPlane.scale.set(0, 0, 0);

      this.projectMeshes.push({
        mesh: projectPlane,
        data: project,
        initialY: 1 - rowIndex * 0.5,
      });

      this.scene.add(projectPlane);
    });

    this.projects = projectsData;
  }

  createFilterUI() {
    const filterContainer = document.createElement("div");
    filterContainer.className = "projects-filter";
    filterContainer.innerHTML = `
      <h2>My Projects</h2>
      <div class="filter-tabs">
        ${categories.map(cat => `
          <button class="filter-tab ${cat === 'All' ? 'active' : ''}" data-category="${cat}">
            ${cat}
          </button>
        `).join('')}
      </div>
      <div class="projects-search">
        <input type="text" placeholder="Search projects..." id="project-search" />
      </div>
    `;

    const existingFilter = document.querySelector(".projects-filter");
    if (existingFilter) {
      existingFilter.remove();
    }

    document.body.appendChild(filterContainer);
    this.filterContainer = filterContainer;
    this.filterContainer.style.display = "none";
  }

  createModal() {
    const modal = document.createElement("div");
    modal.className = "project-modal";
    modal.innerHTML = `
      <div class="project-modal__overlay"></div>
      <div class="project-modal__content">
        <button class="project-modal__close" aria-label="Close modal">&times;</button>
        <div class="project-modal__body">
          <img src="" alt="" class="project-modal__image" />
          <div class="project-modal__info">
            <h2 class="project-modal__title"></h2>
            <p class="project-modal__description"></p>
            <div class="project-modal__tech"></div>
            <div class="project-modal__links">
              <a href="#" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                View Live
              </a>
              <a href="#" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                View Code
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;
  }

  setupEventListeners() {
    document.querySelectorAll(".filter-tab").forEach(tab => {
      tab.addEventListener("click", (e) => {
        this.filterProjects(e.target.dataset.category);
        document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
        e.target.classList.add("active");
      });
    });

    const searchInput = document.getElementById("project-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchProjects(e.target.value);
      });
    }

    this.modal.querySelector(".project-modal__close").addEventListener("click", () => {
      this.closeModal();
    });

    this.modal.querySelector(".project-modal__overlay").addEventListener("click", () => {
      this.closeModal();
    });
  }

  filterProjects(category) {
    this.currentFilter = category;

    this.projectMeshes.forEach(({ mesh, data }) => {
      const shouldShow = category === "All" || data.category === category;

      if (shouldShow) {
        gsap.to(mesh.material, { opacity: 1, duration: 0.5 });
        gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
      } else {
        gsap.to(mesh.material, { opacity: 0, duration: 0.3 });
        gsap.to(mesh.scale, { x: 0, y: 0, z: 0, duration: 0.3, delay: 0.3 });
      }
    });
  }

  searchProjects(query) {
    const searchTerm = query.toLowerCase();

    this.projectMeshes.forEach(({ mesh, data }) => {
      const matchesSearch = data.title.toLowerCase().includes(searchTerm) ||
                           data.description.toLowerCase().includes(searchTerm) ||
                           data.techStack.some(tech => tech.toLowerCase().includes(searchTerm));

      if (matchesSearch) {
        gsap.to(mesh.material, { opacity: 1, duration: 0.5 });
        gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
      } else {
        gsap.to(mesh.material, { opacity: 0, duration: 0.3 });
        gsap.to(mesh.scale, { x: 0, y: 0, z: 0, duration: 0.3, delay: 0.3 });
      }
    });
  }

  showProjects() {
    if (this.filterContainer) {
      this.filterContainer.style.display = "block";
      gsap.fromTo(
        this.filterContainer,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }

    this.projectMeshes.forEach(({ mesh, initialY }, index) => {
      mesh.scale.set(1, 1, 1);
      gsap.to(mesh.material, {
        opacity: 1,
        duration: 1.5,
        delay: 1.5 + index * 0.05,
      });
      gsap.to(mesh.position, {
        y: initialY + 0.05,
        duration: 1,
        delay: 1.5 + index * 0.05,
      });
    });
  }

  hideProjects() {
    if (this.filterContainer) {
      gsap.to(this.filterContainer, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => {
          this.filterContainer.style.display = "none";
        },
      });
    }

    this.projectMeshes.forEach(({ mesh, initialY }) => {
      gsap.to(mesh.material, { opacity: 0, duration: 1 });
      gsap.to(mesh.position, { y: initialY, duration: 1 });
      gsap.to(mesh.scale, { x: 0, y: 0, z: 0, duration: 0, delay: 1 });
    });
  }

  openModal(projectData) {
    const modal = this.modal;
    modal.querySelector(".project-modal__image").src = projectData.image.startsWith("http")
      ? projectData.image
      : `/${projectData.image}`;
    modal.querySelector(".project-modal__title").textContent = projectData.title;
    modal.querySelector(".project-modal__description").textContent = projectData.description;

    const techContainer = modal.querySelector(".project-modal__tech");
    techContainer.innerHTML = projectData.techStack
      .map(tech => `<span class="tech-tag">${tech}</span>`)
      .join("");

    const links = modal.querySelectorAll(".project-modal__links a");
    links[0].href = projectData.url;
    links[1].href = projectData.github;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    this.modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  handleClick(mouseX, mouseY) {
    this.mouse.x = (mouseX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(mouseY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.projectMeshes.map(p => p.mesh)
    );

    if (intersects.length > 0) {
      const clickedProject = intersects[0].object;
      if (clickedProject.userData) {
        this.openModal(clickedProject.userData);
        return true;
      }
    }

    return false;
  }
}
