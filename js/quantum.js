// js/quantum.js

import * as THREE from 'three';

export function initSpacetimeVisualization() {
    const canvas = document.getElementById('spacetime-canvas');
    if (!canvas) {
        console.warn("Spacetime canvas not found. Quantum Gravity visualization will not initialize.");
        return; 
    }

    let scene, camera, renderer; // Declare these variables outside init()
    let stars = [];
    const STAR_COUNT = 1000; 

    function init() {
        // Initialize these only once
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50;

        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const starGeometry = new THREE.SphereGeometry(0.1, 24, 24);
        const starMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

        for (let i = 0; i < STAR_COUNT; i++) {
            const star = new THREE.Mesh(starGeometry, starMaterial);
            star.position.x = (Math.random() - 0.5) * 200;
            star.position.y = (Math.random() - 0.5) * 200;
            star.position.z = (Math.random() - 0.5) * 200;
            star.velocity = new THREE.Vector3(0, 0, -0.1 - Math.random() * 0.5); 
            stars.push(star);
            scene.add(star);
        }

        animate();
        // Crucial change: Add the resize listener *after* camera and renderer are initialized
        window.addEventListener('resize', onWindowResize); 
        // Call it once immediately to set initial size
        onWindowResize();
    }

    function animate() {
        requestAnimationFrame(animate);

        stars.forEach(star => {
            star.position.add(star.velocity);

            if (star.position.z > camera.position.z) {
                star.position.z = (Math.random() - 0.5) * 200 - 100;
                star.position.x = (Math.random() - 0.5) * 200;
                star.position.y = (Math.random() - 0.5) * 200;
            }
        });

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        // Add a check to ensure camera and renderer are defined before accessing them
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    // Call init only when the DOM is fully loaded for this specific canvas
    // This is crucial for external modules to ensure the canvas element exists
    // when `init` tries to access it.
    document.addEventListener('DOMContentLoaded', init);
}