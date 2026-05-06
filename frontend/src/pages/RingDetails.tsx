import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import { Chip, Typography } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import Loader from '../components/Spinner.tsx';
import { formatConformation, getChipStyles, isFavorable } from '../helperFunctions/helpers.tsx';
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { parseStructureString } from '../lib/utils.ts';
import { MolstarProvider, useMolstar } from '../context/MolstarContext.tsx';
import { useBehavior } from '../lib/hooks/use-behavior.ts';
import MolstarViewer from '../components/molstar/MolstarViewer.tsx';
import MolstarViewerModel from '../models/MolstarViewerModel.tsx';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { RingType } from '../data/dataTypes.ts';

const getRingCoverageCounts = (rowValue: string | null) => {
  if (!rowValue) return;
  const [covered, total] = rowValue.split(';');
  return covered + '/' + total + ' atoms';
};

const getChainID = (ringId: string) => {
  const { chainId } = parseStructureString(ringId);
  return chainId;
};

export const getAtoms = (ringId: string) => {
  const { atomIds } = parseStructureString(ringId);
  return atomIds.join(' ');
};

interface RingData {
  ccd_id: string;
  conformation: string;
  conf_main_type: string;
  experimental_method: string;
  pdb_id: string;
  residue_id: number;
  ring_id: string;
  ring_type: string;
  resolution: number | null;
  ring_coverage: string | null;
  ring_coverage_counts: string | null;
  ring_coverage_float: number | null;
  rscc: number | null;
  rsr: number | null;
}

const RingDetailsWrapper: React.FC = () => {
  const { ringID } = useParams<{ ringID: string }>();

  const [ringData, setRingData] = useState<RingData | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRingData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/get_row_data?ringID=${ringID}`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server did not return JSON data');
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok (${response.status}): ${errorText}`);
        }

        const jsonPromise = response.json();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('JSON parsing timed out')), 5000),
        );

        const data = await Promise.race([jsonPromise, timeoutPromise]);
        setRingData(data as RingData);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            setError('Request timed out. Please try again.');
          } else {
            setError(error.message || 'An error occurred while fetching data');
          }
        }
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (ringID) {
      fetchRingData();
    }
  }, [ringID]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', margin: '24px auto', padding: '0 16px' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!ringData) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', margin: '24px auto', padding: '0 16px' }}>
        <Typography>No data found for this ring ID.</Typography>
      </Box>
    );
  }

  return (
    <MolstarProvider>
      <RingDetails ringData={ringData} />
    </MolstarProvider>
  );
};

interface RingDetailsProps {
  ringData: RingData;
}

const RingDetails: React.FC<RingDetailsProps> = ({ ringData }) => {
  const theme = useTheme();
  const { viewer } = useMolstar();

  const linkColor = 'info.main';
  const conf = ringData.conformation;
  const ring = ringData.ring_type as RingType;
  const favorable = isFavorable(ring, conf);
  const mainColor = favorable ? '#2587E2' : '#CD4139';

  return (
    <>
      <Typography
        variant="h1"
        sx={{
          padding: '0 16px',
          margin: '24px',
          textAlign: 'center',
        }}
      >
        Ring details
        <Chip
          label={<Typography variant="body2">{ring}</Typography>}
          sx={{
            ...getChipStyles(ring, theme),
            color: '#000',
            width: 123,
            marginLeft: '24px',
          }}
        />
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: '48px',
          padding: '0 16px',
          margin: '24px auto',
          color: 'text.primary',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            maxWidth: '1000px',
            flexDirection: 'column',
            padding: '0 16px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ marginRight: '8px' }}>
              PDB ID:
            </Typography>
            <Typography variant="caption">
              <Link
                href={`https://www.ebi.ac.uk/pdbe/entry/pdb/${ringData.pdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: 'none',
                  color: linkColor,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LinkIcon
                  fontSize="small"
                  sx={{ marginRight: '4px', marginLeft: '1px', color: linkColor }}
                />
                {ringData.pdb_id}{' '}
              </Link>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ marginRight: '8px' }}>
              CCD ID:
            </Typography>
            <Typography variant="caption">
              <Link
                href={`https://www.ebi.ac.uk/pdbe-srv/pdbechem/chemicalCompound/show/${ringData.ccd_id}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: 'none',
                  color: linkColor,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LinkIcon fontSize="small" sx={{ marginRight: '4px', color: linkColor }} />
                {ringData.ccd_id}{' '}
              </Link>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ marginRight: '8px' }}>
              Chain ID:
            </Typography>
            <Typography variant="caption">{getChainID(ringData.ring_id)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ marginRight: '8px' }}>
              Residue ID:
            </Typography>
            <Typography variant="caption">{ringData.residue_id}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ marginRight: '8px' }}>
              Ring coverage:
            </Typography>
            <Typography variant="caption">
              {ringData.ring_coverage
                ? getRingCoverageCounts(ringData.ring_coverage_counts) +
                  ' (' +
                  ringData.ring_coverage +
                  ')'
                : 'N/A'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ marginRight: '8px' }}>
              Experimental method:
            </Typography>
            <Typography variant="caption">{ringData.experimental_method}</Typography>
          </Box>
          {ringData.resolution && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ marginRight: '8px' }}>
                Resolution:
              </Typography>
              <Typography variant="caption">{ringData.resolution} Å</Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ marginRight: '8px' }}>
              RSR:
            </Typography>
            <Typography variant="caption">{ringData.rsr ?? 'N/A'}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ marginRight: '8px' }}>
              RSCC:
            </Typography>
            <Typography variant="caption">{ringData.rscc ?? 'N/A'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ marginRight: '8px' }}>
              Atoms:
            </Typography>
            <Typography variant="caption">{getAtoms(ringData.ring_id)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ marginRight: '8px' }}>
              Assigned conformation:
            </Typography>
            <Typography variant="caption">{ringData.conf_main_type}</Typography>
            {['Oxane', 'Oxolane'].includes(ringData.ring_type) && ringData.conformation !== 'Flat' ? <Typography variant="caption">&nbsp;({formatConformation(ringData.conformation)})</Typography> : null}
            <Chip
              label={
                <Typography variant="caption">{favorable ? 'favorable' : 'unfavorable'}</Typography>
              }
              size="small"
              variant="outlined"
              sx={{ borderColor: mainColor, color: mainColor, marginLeft: '8px' }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            minWidth: '420px',
            width: '800px',
            minHeight: '420px',
            padding: '0 16px',
          }}
        >
          <Box
            sx={{
              width: '800px',
              height: '460px',
              border: 1,
              borderWidth: '3px',
              borderColor: '#e0ddd4',
              borderRadius: 1,
            }}
          >
            <MolstarViewer ringId={ringData.ring_id} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              margin: '12px 0',
            }}
          >
            <ResetFocusButton viewer={viewer} ringId={ringData.ring_id} />
            <ToggleBallAndStickButton viewer={viewer} />{' '}
            <ToggleElectronDensityButton viewer={viewer} />{' '}
            <DownloadStructureButton pdbId={ringData.pdb_id} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

function ResetFocusButton({ viewer, ringId }: { viewer: MolstarViewerModel; ringId: string }) {
  const [isLoading] = useBehavior(viewer.state.isLoading);

  const { chainId, compId, residueId, atomIds } = useMemo(
    () => parseStructureString(ringId),
    [ringId],
  );

  function handleReset() {
    viewer.focusRing({
      chainId,
      compId,
      residueId,
      atomIds,
    });
  }

  return (
    <Button
      onClick={handleReset}
      startIcon={<RestartAltIcon sx={{ color: '#7C7C7C' }} />}
      sx={{ fontSize: '1rem', whiteSpace: 'nowrap', color: '#3A3A3A' }}
      disabled={isLoading}
    >
      <Typography>Reset View</Typography>
    </Button>
  );
}

function ToggleBallAndStickButton({ viewer }: { viewer: MolstarViewerModel }) {
  const [isLoading] = useBehavior(viewer.state.isLoading);
  const [showBallAndStick, setShowBallAndStick] = useBehavior(viewer.state.showBallAndStick);

  return (
    <FormControlLabel
      control={
        <Switch
          checked={showBallAndStick}
          onChange={() => setShowBallAndStick(!showBallAndStick)}
          disabled={isLoading}
        />
      }
      label={<Typography>Show residues as ball and stick</Typography>}
      sx={{
        '& .MuiTypography-root': {
          whiteSpace: 'nowrap',
        },
      }}
    />
  );
}

function ToggleElectronDensityButton({ viewer }: { viewer: MolstarViewerModel }) {
  const [isLoading] = useBehavior(viewer.state.isLoading);
  const [disableElectronDensity] = useBehavior(viewer.state.disableElectronDensity);
  const [showElectronDensity, setShowElectronDensity] = useBehavior(
    viewer.state.showElectronDensity,
  );

  return (
    <FormControlLabel
      control={
        <Switch
          checked={showElectronDensity}
          onChange={() => setShowElectronDensity(!showElectronDensity)}
          disabled={isLoading || disableElectronDensity}
        />
      }
      label="Show electron density"
      sx={{
        '& .MuiTypography-root': {
          whiteSpace: 'nowrap',
        },
      }}
    />
  );
}

function DownloadStructureButton({ pdbId }: { pdbId: string }) {
  async function handleDownload() {
    try {
      const response = await fetch(`https://www.ebi.ac.uk/pdbe/entry-files/download/${pdbId}.cif`);
      const data = await response.text();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([data]));

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${pdbId.toLowerCase()}.cif`);

      // Append link to body, click it, and remove it
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      // You might want to add error handling UI here
    }
  }

  return (
    <Button
      onClick={handleDownload}
      startIcon={<FileDownloadIcon sx={{ color: '#7C7C7C' }} />}
      sx={{ whiteSpace: 'nowrap', color: '#3A3A3A' }}
    >
      <Typography>Download Structure</Typography>
    </Button>
  );
}

export default RingDetailsWrapper;
