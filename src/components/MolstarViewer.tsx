import { useEffect, useMemo, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useMolstar } from '../context/MolstarContext';
import { useBehavior } from '../lib/hooks/use-behavior';
import 'molstar/lib/mol-plugin-ui/skin/colors/light.scss';
import { parseStructureString } from '../lib/utils';

interface MolstarViewerProps {
  ringId: string;
}

const MolstarViewer: React.FC<MolstarViewerProps> = ({ ringId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { viewer } = useMolstar();
  const [isLoading] = useBehavior(viewer.state.isLoading);

  const { pdbId, chainId, compId, residueId, atomIds } = useMemo(
    () => parseStructureString(ringId),
    [ringId],
  );

  // handle mount
  useEffect(() => {
    if (!containerRef.current) return;

    viewer.mount(containerRef.current);

    viewer.load(pdbId, {
      chainId,
      compId,
      residueId,
      atomIds,
    });

    return () => viewer.unmount();
  }, [atomIds, chainId, compId, pdbId, residueId, viewer]);

  // handle subs
  useEffect(() => {
    viewer.sub();

    return () => viewer.unsub();
  }, [viewer]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default MolstarViewer;
