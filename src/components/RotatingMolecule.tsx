import { Environment, useGLTF, View } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import { Group } from 'three';

interface RotatingMoleculeProps {
  modelPath: string;
}

const Molecule: React.FC<{ modelPath: string }> = ({ modelPath }) => {
  const ref = useRef<Group>(null);
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

export const RotatingMolecule: React.FC<RotatingMoleculeProps> = ({ modelPath }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <View style={{ height: '100%', width: '100%' }}>
        <Common color="white" />
        <Molecule modelPath={modelPath} />
      </View>
    </div>
  );
};

function Common({ color }: { color: string }) {
  return (
    <>
      {color && <color attach="background" args={[color]} />}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} />
      <pointLight position={[20, 30, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="blue" />
      <Environment preset="sunset" />
    </>
  );
}
