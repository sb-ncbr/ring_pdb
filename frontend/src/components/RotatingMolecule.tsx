import { Environment, useGLTF, View } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import * as THREE from 'three';
import { GLTFErrorBoundary } from './GLTFErrorBoundary';
import stats from '../content/stats.json';

interface RotatingMoleculeProps {
  modelPath: string;
  onError: () => void;
}

const models = stats.rings.flatMap((ring) =>
  ring.confs.map((conf) => `assets/geometry/${ring.name}/${ring.name}-${conf.name}.glb`),
);

models.forEach((path) => {
  useGLTF.preload(path);
});

const Molecule: React.FC<{ modelPath: string }> = ({ modelPath }) => {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta;
    }
  });

  return (
    <group ref={ref} dispose={null}>
      <primitive ref={ref} object={scene} />
    </group>
  );
};

export const RotatingMolecule: React.FC<RotatingMoleculeProps> = ({ modelPath, onError }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <View style={{ height: '100%', width: '100%', background: 'transparent' }}>
        <GLTFErrorBoundary onError={onError}>
          <Common />
          <Molecule modelPath={modelPath} />
        </GLTFErrorBoundary>
      </View>
    </div>
  );
};

function Common() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} />
      <pointLight position={[20, 30, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="blue" />
      <Environment preset="sunset" />
    </>
  );
}
