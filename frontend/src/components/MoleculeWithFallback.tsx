import { useState } from 'react';
import { RotatingMolecule } from './RotatingMolecule';

export function MoleculeWithFallback({
  modelPath,
  imageFallback = '/assets/images/no_image_available.png',
}: {
  modelPath: string;
  imageFallback?: string;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div style={{ width: '100%', height: 220, position: 'relative' }}>
      {hasError ? (
        <img
          src={imageFallback}
          alt="Molecule unavailable"
          style={{
            width: '50%',
            height: '50%',
            objectFit: 'contain',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ) : (
        <RotatingMolecule modelPath={modelPath} onError={() => setHasError(true)} />
      )}
    </div>
  );
}
