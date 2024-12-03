import { useEffect, useMemo } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useMolstar } from '../../context/MolstarContext';
import { useBehavior } from '../../lib/hooks/use-behavior';
import { parseStructureString } from '../../lib/utils';
import { ViewerLayout } from './ViewerLayout';
import 'molstar/lib/mol-plugin-ui/skin/light.scss';

interface MolstarViewerProps {
  ringId: string;
}

const MolstarViewer: React.FC<MolstarViewerProps> = ({ ringId }) => {
  const { viewer } = useMolstar();

  const [isLoading] = useBehavior(viewer.state.isLoading);
  const [isInitialized] = useBehavior(viewer.state.isInitialized);

  const { pdbId, chainId, compId, residueId, atomIds } = useMemo(
    () => parseStructureString(ringId),
    [ringId],
  );

  // handle subs
  useEffect(() => {
    viewer.sub();
    return () => viewer.unsub();
  }, [viewer]);

  // handle load
  useEffect(() => {
    viewer.load(pdbId, {
      chainId,
      compId,
      residueId,
      atomIds,
    });
  }, [atomIds, chainId, compId, pdbId, residueId, viewer]);

  return (
    <Box
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
            zIndex: 10,
          }}
        >
          <CircularProgress thickness={7} />
        </Box>
      )}
      {isInitialized && <ViewerLayout viewer={viewer} />}
    </Box>
  );
};

export default MolstarViewer;
