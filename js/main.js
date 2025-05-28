// js/main.js

// Import the Three.js visualization function
import { initSpacetimeVisualization } from "./quantum.js";

// Navbar scroll effect
window.addEventListener('scroll', function () {
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

menuIcon.addEventListener('click', function () {
    navItems.classList.toggle('show');
});

// Secret modal toggle
const secretTeaser = document.querySelector('.secret-teaser');
const secretModal = document.querySelector('.secret-modal');
const secretClose = document.querySelector('.secret-close');

secretTeaser.addEventListener('click', function () {
    secretModal.classList.add('show');
});

secretClose.addEventListener('click', function () {
    secretModal.classList.remove('show');
});

// Quantum canvas background (for the general hero section)
const quantumCanvas = document.querySelector('.quantum-canvas'); // Renamed to avoid conflict
const ctx = quantumCanvas.getContext('2d');

let width = quantumCanvas.width = window.innerWidth;
let height = quantumCanvas.height = window.innerHeight;

// Array of quantum particles
const particles = [];

// Create particles
function createParticles() {
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            entangled: i % 2 === 0 ? i + 1 : i - 1
        });
    }
}

// Draw particles
function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        if (i % 2 === 0 && particles[particle.entangled]) { // Add check for existing entangled particle
            const entangled = particles[particle.entangled];

            // Draw line between entangled particles
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(entangled.x, entangled.y);

            // Gradient line
            const gradient = ctx.createLinearGradient(
                particle.x, particle.y, entangled.x, entangled.y
            );
            gradient.addColorStop(0, 'rgba(14, 255, 255, 0.1)');
            gradient.addColorStop(1, 'rgba(127, 0, 255, 0.1)');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }

    // Draw particles
    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

        // Color based on entanglement
        if (i % 2 === 0) {
            ctx.fillStyle = 'rgba(14, 255, 255, 0.6)';
        } else {
            ctx.fillStyle = 'rgba(127, 0, 255, 0.6)';
        }

        ctx.fill();

        // Update particle position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Boundary check
        if (particle.x < 0 || particle.x > width) {
            particle.speedX = -particle.speedX;
        }

        if (particle.y < 0 || particle.y > height) {
            particle.speedY = -particle.speedY;
        }
    }

    requestAnimationFrame(drawParticles);
}

// Handle window resize for general canvas
window.addEventListener('resize', function () {
    width = quantumCanvas.width = window.innerWidth;
    height = quantumCanvas.height = window.innerHeight;

    // Recreate particles on resize
    particles.length = 0;
    createParticles();
});

// Initialize quantum animation
createParticles();
drawParticles();

// Letter-by-letter animation for subtitle
function animateSubtitle() {
    const subtitle = document.getElementById('animated-subtitle');
    if (!subtitle) return; // Add null check
    const text = subtitle.textContent;
    subtitle.innerHTML = '';

    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.classList.add('letter');
        span.textContent = text[i] === ' ' ? '\u00A0' : text[i]; // Non-breaking space for spaces
        span.style.animationDelay = `${1.2 + i * 0.05}s`; // Start after the title animation
        subtitle.appendChild(span);
    }
}

// Call the animation function on DOMContentLoaded
document.addEventListener('DOMContentLoaded', animateSubtitle);

// Scroll to top button functionality
const scrollToTopBtn = document.querySelector('.scrollToTop-btn');

window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Intersection Observer for fade-in animations (general sections)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

// Observe elements
document.querySelectorAll('.enigma-section .enigma-title').forEach(element => element.classList.add('observed'));
document.querySelectorAll('.enigma-section .enigma-description').forEach(element => element.classList.add('observed'));
document.querySelectorAll('.enigma-section .enigma-card').forEach(card => card.classList.add('observed'));

// Start observing elements
document.querySelectorAll('.observed').forEach(element => {
    observer.observe(element);
});

// Create floating particles
function createFloatingParticles() {
    const particlesContainer = document.querySelector('.hero');
    if (!particlesContainer) return; // Add null check

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random size
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;

        // Random animation duration and delay
        const duration = Math.random() * 10 + 5; // 5-15 seconds
        const delay = Math.random() * 5; // 0-5 seconds
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        particlesContainer.appendChild(particle);
    }
}

document.addEventListener('DOMContentLoaded', createFloatingParticles); // Call on DOMContentLoaded

// Research Domain Interaction and Counter Animations
const researchButtons = document.querySelectorAll('.research-btn');
const researchContents = document.querySelectorAll('.computational-insights');
const researchDomainsSection = document.querySelector('.research-domains');
let countersAnimated = false;

function animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    const start = 0;
    const duration = 1500;
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
        researchButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        researchContents.forEach(content => content.classList.add('hidden'));

        const targetArea = button.dataset.area;
        const targetContentId = `${targetArea.toLowerCase()}-insights`;
        document.getElementById(targetContentId).classList.remove('hidden');

        document.querySelectorAll(`#${targetContentId} .counter`).forEach(counter => {
            animateCounter(counter);
        });
    });
});

// Intersection Observer for Research Domains to trigger counters
const researchDomainsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            document.querySelectorAll('#quantum-insights .counter').forEach(counter => {
                animateCounter(counter);
            });
            countersAnimated = true;
            researchDomainsObserver.disconnect();
        }
    });
}, { threshold: 0.2 });

// Start observing the research domains section
if (researchDomainsSection) { // Check if element exists
    researchDomainsObserver.observe(researchDomainsSection);
}


// Initialize the Spacetime Visualization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initSpacetimeVisualization);