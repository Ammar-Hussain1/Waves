import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeScene = () => {
  useEffect(() => {
    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create an array to store promises for loading models
    const loadModels = [
      new Promise((resolve, reject) => {
        new GLTFLoader().load(
          '/sydney.glb',  // Replace with the correct model path
          (gltf) => resolve(gltf.scene),
          undefined,
          (error) => reject(error)
        );
      }),
      
      new Promise((resolve, reject) => {
        new GLTFLoader().load(
          '/snow.glb',  // Replace with the correct model path
          (gltf) => resolve(gltf.scene),
          undefined,
          (error) => reject(error)
        );
      })
    ];

    // Load models using Promise.all
    Promise.all(loadModels)
      .then((loadedModels) => {
        console.log('Models loaded:', loadedModels);

        // Add models to the scene
        scene.add(loadedModels[0]);
        scene.add(loadedModels[1]);

        // Set camera position
        camera.position.z = 5;

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        };
        animate();
      })
      .catch((error) => {
        console.error('Error loading models:', error);
      });

    // Cleanup on component unmount
    return () => {
      // Remove the renderer from the DOM
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return <div />;
};

export default ThreeScene;
