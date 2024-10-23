import React, { useRef } from 'react';
import RingsStepper from '../components/RingsStepper.tsx';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';

export const RingsStepperPage: React.FC = () => {
  return (
    <>
      <RingsStepper />
      <Canvas
        style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden' }}
        eventSource={document.getElementById('root')!}
      >
        <View.Port />
      </Canvas>
    </>
  );
};
