"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import { useCallback } from "react";

function Earth({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  const texture = useLoader(
    TextureLoader,
    "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
  );

  const handleClick = useCallback(
    (e: any) => {
      e.stopPropagation();
      const { point } = e;
      const lat = 90 - (Math.acos(point.y / point.length()) * 180) / Math.PI;
      const lng = ((Math.atan2(point.x, point.z) * 180) / Math.PI + 180) % 360 - 180;
      onSelect(lat, lng);
    },
    [onSelect]
  );

  return (
    <mesh onClick={handleClick}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function Globe({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  return (
    <Canvas style={{ height: "400px", width: "400px" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} />
      <Earth onSelect={onSelect} />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
