// js/about.js

import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', () => {
    // --- Hero Subtitle Animation ---
    const subtitle = document.getElementById('animated-subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.innerHTML = '';
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.classList.add('letter');
            span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
            span.style.animationDelay = `${1.2 + i * 0.05}s`;
            subtitle.appendChild(span);
        }
    }

    // --- Core Values Interaction ---
    const valueItems = document.querySelectorAll('.value-item');

    valueItems.forEach(item => {
        item.addEventListener('click', () => {
            // Toggle 'active' class on the clicked item
            item.classList.toggle('active');

            // Optional: Close other open descriptions if you want only one open at a time
            valueItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });

    // --- Expertise Tabs Interaction ---
    const expertiseTabs = document.querySelectorAll('.expertise-tab');
    const expertiseDetails = document.querySelectorAll('.expertise-details');

    // Set initial active tab
    if (expertiseTabs.length > 0 && expertiseDetails.length > 0) {
        expertiseTabs[0].classList.add('active');
        expertiseDetails[0].classList.remove('hidden');
    }

    expertiseTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            expertiseTabs.forEach(t => t.classList.remove('active'));
            // Add active class to the clicked tab
            tab.classList.add('active');

            // Hide all expertise content
            expertiseDetails.forEach(detail => detail.classList.add('hidden'));

            // Show the relevant expertise content
            const targetTech = tab.dataset.tech;
            document.getElementById(`${targetTech}-content`).classList.remove('hidden');
        });
    });

    // --- Background Canvas Animation (Simplified for About Page) ---
    const aboutCanvas = document.getElementById('about-canvas');
    if (aboutCanvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: aboutCanvas,
            antialias: true,
            alpha: true
        });

        const setSize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        setSize(); // Call once initially

        // Particle system for a subtle background effect
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 500;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 200; // Spread particles
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.1,
            color: 0x6bfffe, // Primary color
            transparent: true,
            opacity: 0.6
        });

        const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleMesh);

        camera.position.z = 50;

        const animate = () => {
            requestAnimationFrame(animate);

            particleMesh.rotation.x += 0.0005;
            particleMesh.rotation.y += 0.001;

            renderer.render(scene, camera);
        };

        window.addEventListener('resize', setSize); // Add resize listener
        animate();
    }
});