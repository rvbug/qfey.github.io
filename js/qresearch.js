// js/qresearch.js

import * as THREE from 'three'; // Import Three.js here for the tesseract animation

// --- Shared Navigation and Utility Functions (copied for consistency) ---

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const menuIcon = document.querySelector('.menu-icon');
const navItems = document.querySelector('.nav-items');

menuIcon.addEventListener('click', function() {
    navItems.classList.toggle('show');
});

// Secret modal toggle
const secretTeaser = document.querySelector('.secret-teaser');
const secretModal = document.querySelector('.secret-modal');
const secretClose = document.querySelector('.secret-close');

secretTeaser.addEventListener('click', function() {
    secretModal.classList.add('show');
});

secretClose.addEventListener('click', function() {
    secretModal.classList.remove('show');
});

// Scroll to top button functionality
const scrollToTopBtn = document.querySelector('.scrollToTop-btn');

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// --- Research Domain Interaction and Counter Animations ---

const researchButtons = document.querySelectorAll('.research-btn');
const researchContents = document.querySelectorAll('.computational-insights');
const researchDomainsSection = document.querySelector('.research-domains');
let countersAnimated = false; // Flag to ensure counters animate only once on scroll


function animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    const start = 0;
    const duration = 1500; // milliseconds
    const isFloat = target % 1 !== 0;

    let startTime = null;

    function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / duration;

        if (progress < 1) {
            let current = start + (target - start) * progress;
            if (isFloat) {
                element.textContent = current.toFixed(2);
            } else {
                element.textContent = Math.floor(current);
            }
            requestAnimationFrame(step);
        } else {
            element.textContent = target;
        }
    }
    requestAnimationFrame(step);
}

researchButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        researchButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to the clicked button
        button.classList.add('active');

        // Hide all content sections
        researchContents.forEach(content => content.classList.add('hidden'));

        // Show the relevant content section
        const targetArea = button.dataset.area;
        const targetContentId = `${targetArea.toLowerCase()}-insights`;
        document.getElementById(targetContentId).classList.remove('hidden');

        // Animate counters in the visible section (re-animate on button click)
        document.querySelectorAll(`#${targetContentId} .counter`).forEach(counter => {
            animateCounter(counter);
        });
    });
});

// Intersection Observer for Research Domains to trigger counters
const researchDomainsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            // Only animate if the section is intersecting AND counters haven't been animated yet
            // Trigger animation for the currently active tab (default: Quantum)
            document.querySelectorAll('.research-buttons .active').forEach(activeButton => {
                const targetArea = activeButton.dataset.area;
                const targetContentId = `${targetArea.toLowerCase()}-insights`;
                document.querySelectorAll(`#${targetContentId} .counter`).forEach(counter => {
                    animateCounter(counter);
                });
            });

            countersAnimated = true; // Set flag to true after animation
            researchDomainsObserver.disconnect(); // Stop observing after animation
        }
    });
}, { threshold: 0.2 }); // Trigger when 20% of the section is visible

// Start observing the research domains section
// Added DOMContentLoaded to ensure elements are loaded before observing
document.addEventListener('DOMContentLoaded', () => {
    if (researchDomainsSection) {
        researchDomainsObserver.observe(researchDomainsSection);
    }
});


// --- Three.js Tesseract Animation ---

export function initTesseractVisualization() { // Renamed from initSpacetimeVisualization to be specific
    const initScene = () => {
        const canvas = document.getElementById('spacetime-canvas'); // Correct ID
        if (!canvas) {
            console.error('Canvas element not found for Tesseract visualization.');
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });

        const setSize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        setSize();

        // Create tesseract
        const createTesseract = () => {
            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            const size = 2;

            // Inner cube
            vertices.push(
                -size, -size, -size, // 0
                size, -size, -size,  // 1
                size, size, -size,   // 2
                -size, size, -size,  // 3
                -size, -size, size,  // 4
                size, -size, size,   // 5
                size, size, size,    // 6
                -size, size, size    // 7
            );

            // Outer cube (scaled)
            const scale = 1.5;
            vertices.push(
                -size * scale, -size * scale, -size * scale, // 8
                size * scale, -size * scale, -size * scale,  // 9
                size * scale, size * scale, -size * scale,   // 10
                -size * scale, size * scale, -size * scale,  // 11
                -size * scale, -size * scale, size * scale,  // 12
                size * scale, -size * scale, size * scale,   // 13
                size * scale, size * scale, size * scale,    // 14
                -size * scale, size * scale, size * scale    // 15
            );

            const indices = [];
            // Inner cube edges
            indices.push(
                0, 1, 1, 2, 2, 3, 3, 0,
                4, 5, 5, 6, 6, 7, 7, 4,
                0, 4, 1, 5, 2, 6, 3, 7
            );

            // Outer cube edges
            indices.push(
                8, 9, 9, 10, 10, 11, 11, 8,
                12, 13, 13, 14, 14, 15, 15, 12,
                8, 12, 9, 13, 10, 14, 11, 15
            );

            // Connections between cubes
            indices.push(
                0, 8, 1, 9, 2, 10, 3, 11,
                4, 12, 5, 13, 6, 14, 7, 15
            );

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.setIndex(new THREE.Uint16BufferAttribute(indices, 1)); // Use Uint16BufferAttribute for indices

            const material = new THREE.LineBasicMaterial({
                color: 0x4a90e2,
                transparent: true,
                opacity: 0.6
            });

            return new THREE.LineSegments(geometry, material);
        };

        // Create black hole
        const createBlackHole = () => {
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    varying vec2 vUv;
                    void main() {
                        vec2 center = vec2(0.5, 0.5);
                        float dist = length(vUv - center);
                        float intensity = 1.0 - dist;
                        intensity = pow(intensity, 3.0);
                        vec3 color = vec3(0.29, 0.56, 0.89) * intensity; // #4a90e2
                        color += vec3(0.61, 0.35, 0.71) * sin(time + dist * 10.0); // #9b59b6
                        gl_FragColor = vec4(color, intensity);
                    }
                `,
                transparent: true
            });

            return new THREE.Mesh(geometry, material);
        };

        // Create grid from your existing code
        const createGrid = () => {
            const gridSize = 50;
            const gridDivisions = 30;
            const grid = new THREE.Group();

            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            const colors = [];

            for (let i = 0; i <= gridDivisions; i++) {
                for (let j = 0; j <= gridDivisions; j++) {
                    const x = (i - gridDivisions / 2) * (gridSize / gridDivisions);
                    const z = (j - gridDivisions / 2) * (gridSize / gridDivisions);
                    vertices.push(x, 0, z);

                    const color = new THREE.Color(0x4a90e2);
                    colors.push(color.r, color.g, color.b);
                }
            }

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

            // Create indices for grid lines
            const indices = [];
            for (let i = 0; i <= gridDivisions; i++) {
                for (let j = 0; j < gridDivisions; j++) {
                    const a = i * (gridDivisions + 1) + j;
                    const b = a + 1;
                    indices.push(a, b);
                }
            }
            for (let i = 0; i < gridDivisions; i++) {
                for (let j = 0; j <= gridDivisions; j++) {
                    const a = i * (gridDivisions + 1) + j;
                    const b = a + gridDivisions + 1;
                    indices.push(a, b);
                }
            }

            geometry.setIndex(new THREE.Uint16BufferAttribute(indices, 1)); // Use Uint16BufferAttribute for indices

            const material = new THREE.LineBasicMaterial({
                vertexColors: true,
                opacity: 0.3,
                transparent: true
            });

            const gridMesh = new THREE.LineSegments(geometry, material);
            grid.add(gridMesh);
            return { grid, geometry };
        };

        // Initialize objects
        const tesseract = createTesseract();
        const blackHole = createBlackHole();
        const { grid, geometry } = createGrid(); // geometry from grid for updates

        // Position objects
        tesseract.position.set(0, 5, 0);
        blackHole.position.set(0, 2, 0); // Position black hole slightly higher

        // Add to scene
        scene.add(tesseract);
        scene.add(blackHole);
        scene.add(grid);

        // Camera setup
        camera.position.set(0, 30, 50);
        camera.lookAt(0, 0, 0);

        // Animation
        let time = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            time += 0.005;

            // Rotate tesseract
            tesseract.rotation.x += 0.001;
            tesseract.rotation.y += 0.002;

            // Update black hole
            blackHole.material.uniforms.time.value = time;

            // Update grid for gravitational well
            const positions = geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const z = positions[i + 2];
                const dist = Math.sqrt(x * x + z * z);
                // Adjust gravity well depth and spread. Ensure it doesn't cause issues for the tesseract/black hole.
                positions[i + 1] = -10 / (1 + dist * 0.3) * Math.exp(-dist * 0.1); 
            }
            geometry.attributes.position.needsUpdate = true; // Crucial for updating vertex positions

            grid.rotation.y += 0.001;

            renderer.render(scene, camera);
        };

        window.addEventListener('resize', setSize);
        animate();
        // canvas.classList.add('loaded'); // This line is not defined in your CSS
    };

    // Call initScene when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initScene);
}

// Initial call to start the visualization setup
initTesseractVisualization(); // Call the exported function