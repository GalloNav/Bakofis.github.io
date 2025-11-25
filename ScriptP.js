// Configuración
const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";
const ITSON_ID = "252626"; // Esto porque no leia los proyectos de mi backoffice 
const USER_ID = "temp-id"; // Provicional por si no jalaba el id xd

// Inicializacion
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    setupNavbar();
    createParticles();
    loadProjects();
});

// Navbar
function setupNavbar() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Particles animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Load Projects from API
async function loadProjects() {
    const container = document.getElementById('projects-container');

    try {
        console.log(`Cargando proyectos para ITSON ID: ${ITSON_ID}`);

        const response = await fetch(`${API_BASE}/publicProjects/${ITSON_ID}`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const projects = await response.json();
        console.log('Proyectos cargados:', projects);

        displayProjects(projects);

    } catch (error) {
        console.error('Error al cargar proyectos:', error);
        container.innerHTML = `
                    <div class="empty-state" data-aos="fade-up">
                        <div class="empty-icon"></div>
                        <h3>Error al cargar proyectos</h3>
                        <p style="color: var(--text-dim); margin-top: 1rem;">
                            ${error.message}
                        </p>
                        <button class="btn btn-primary" onclick="loadProjects()" style="margin-top: 2rem;">
                            <i class="fas fa-redo"></i> Reintentar
                        </button>
                    </div>
                `;
    }
}

function displayProjects(projects) {
    const container = document.getElementById('projects-container');

    if (!projects || projects.length === 0) {
        container.innerHTML = `
                    <div class="empty-state" data-aos="fade-up">
                        <div class="empty-icon"></div>
                        <h3>No hay proyectos disponibles</h3>
                        <p style="color: var(--text-dim); margin-top: 1rem;">
                            Los proyectos aparecerán aquí una vez que los agregues en el backoffice.
                        </p>
                    </div>
                `;
        return;
    }

    const projectsHTML = projects.map((project, index) => {
        const hasImage = project.images && project.images.length > 0 && project.images[0];
        const imageHTML = hasImage
            ? `<img src="${escapeHtml(project.images[0])}" alt="${escapeHtml(project.title)}">`
            : `<i class="fas fa-code"></i>`;

        return `
                    <div class="project-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                        <div class="project-image">
                            ${imageHTML}
                        </div>
                        <div class="project-content">
                            <h3 class="project-title">${escapeHtml(project.title)}</h3>
                            <p class="project-description">${escapeHtml(project.description)}</p>
                            ${project.technologies && project.technologies.length > 0 ? `
                                <div class="project-tech">
                                    ${project.technologies.map(tech =>
            `<span class="tech-tag">${escapeHtml(tech)}</span>`
        ).join('')}
                                </div>
                            ` : ''}
                            ${project.repository ? `
                                <div class="project-links">
                                    <a href="${escapeHtml(project.repository)}" target="_blank" class="project-link">
                                        <i class="fab fa-github"></i> Ver Código
                                    </a>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
    }).join('');

    container.innerHTML = `<div class="projects-grid">${projectsHTML}</div>`;

    // Reinicializar AOS para las nuevas tarjetas
    AOS.refresh();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});