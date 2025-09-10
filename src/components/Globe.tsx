'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Props {
  onSelect: (coords: { lat: number; lon: number }) => void;
}

export default function Globe({ onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dartRef = useRef<THREE.Mesh>();

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const texture = new THREE.TextureLoader().load(
      'https://cdn.jsdelivr.net/gh/hustcc/earth-map@master/world.jpg'
    );
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onClick(event: MouseEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(globe);
      if (intersects.length > 0) {
        const p = intersects[0].point.clone();
        const radius = 1;
        const phi = Math.acos(p.y / radius);
        const theta = Math.atan2(p.x, p.z);
        const lat = 90 - (phi * 180) / Math.PI;
        const lon = ((theta * 180) / Math.PI + 180) % 360 - 180;
        if (dartRef.current) scene.remove(dartRef.current);
        const dartGeom = new THREE.ConeGeometry(0.02, 0.1, 8);
        const dartMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const dart = new THREE.Mesh(dartGeom, dartMat);
        dart.position.copy(p);
        dart.lookAt(p.clone().multiplyScalar(2));
        scene.add(dart);
        dartRef.current = dart;
        onSelect({ lat, lon });
      }
    }

    renderer.domElement.addEventListener('click', onClick);

    function onResize() {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', onResize);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [onSelect]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
