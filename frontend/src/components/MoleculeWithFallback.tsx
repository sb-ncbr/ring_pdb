import { useEffect, useState } from 'react';
import { RotatingMolecule } from './RotatingMolecule';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function MoleculeWithFallback({
  modelPath,
  imageFallback = '/assets/images/no_image_available.png',
}: {
  modelPath: string;
  imageFallback?: string;
}) {
  const [modelOk, setModelOk] = useState<boolean | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();

    loader.load(
      modelPath,
      () => {
        setModelOk(true);
      },
      undefined,
      (error: any) => {
        console.error('Failed to load GLB:', modelPath, error);
        setModelOk(false);
      },
    );
  }, [modelPath]);

  if (modelOk === null) return null;

  return (
    <div style={{ width: '100%', height: 220, position: 'relative' }}>
      {modelOk ? (
        <RotatingMolecule modelPath={modelPath} />
      ) : (
        <img
          src={imageFallback}
          alt="Fallback"
          style={{
            width: '50%',
            height: '50%',
            objectFit: 'contain', // keeps aspect ratio
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </div>
  );
}

export default MoleculeWithFallback;
