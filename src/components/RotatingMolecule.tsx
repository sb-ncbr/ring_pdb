import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface RotatingMoleculeProps {
  modelPath: string;
}

const Molecule: React.FC<{ modelPath: string }> = ({ modelPath }) => {
  const gltf = useLoader(GLTFLoader, modelPath);
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  return <primitive object={gltf.scene} ref={modelRef} />;
};

export const RotatingMolecule: React.FC<RotatingMoleculeProps> = ({ modelPath }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} />
        <Molecule modelPath={modelPath} />
      </Canvas>
    </div>
  );
};
