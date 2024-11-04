import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import { labels } from '../constants';
import { Chip, Typography } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import Loader from '../components/Spinner.tsx';
import { getChipStyles, isFavorable } from '../helperFunctions/helpers.ts';
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

const getRingCoverageCounts = (rowValue) => {
  if (rowValue == 'N/A') {
    return;
  }
  const [covered, total] = rowValue.split(';');
  return covered + '/' + total + ' rings';
};

const getChainID = (ringID) => {
  return ringID.split('_')[1];
};

const getAtoms = (ringID) => {
  const atoms = ringID.split('_')[4];
  return atoms.replaceAll('-', ' ');
};

const RingDetails: React.FC = () => {
  const { ringID } = useParams<{ ringID: string }>();
  const [ringData, setRingData] = useState(null);
  const [error, setError] = useState(null);
  const [showElectronDensity, setShowElectronDensity] = useState(false);
  const theme = useTheme();
  const linkColor = 'info.main';

  useEffect(() => {
    const fetchRingData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/get_row_data?ringID=${ringID}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRingData(data);
        // console.log(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchRingData();
  }, [ringID]);

  if (!ringData) {
    return <Loader />;
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', margin: '24px auto', padding: '0 16px' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  const conf = ringData.conformation;
  const ring = ringData.ring_type;
  const favorable = isFavorable(ring, conf);
  const mainColor = favorable ? '#2587E2' : '#CD4139';

  return (
    <>
      <Typography
        variant="h4"
        sx={{
          padding: '0 16px',
          margin: '24px',
          textAlign: 'center',
        }}
      >
        Ring details
        <Chip
          label={ringData.ring_type}
          sx={{
            ...getChipStyles(ringData.ring_type, theme),
            color: '#000',
            width: 123,
            marginLeft: '8px',
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
            // alignItems: 'left',
            padding: '0 16px',
            // margin: '0 auto',
            color: 'text.primary',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
              PDB ID:
            </Typography>
            <Typography variant="body2">
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
            <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
              {labels.ccdID}:{' '}
            </Typography>
            <Typography variant="body2">
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
            <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
              Chain ID:
            </Typography>
            <Typography variant="body2">{getChainID(ringID)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
              Residue ID:
            </Typography>
            <Typography variant="body2">{ringData.residue_id}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
              Ring coverage:
            </Typography>
            <Typography variant="body2">
              {ringData.ring_coverage != 'N/A'
                ? getRingCoverageCounts(ringData.ring_coverage_counts) +
                  ' (' +
                  ringData.ring_coverage +
                  ')'
                : ringData.ring_coverage}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
              RMSD with template:
            </Typography>
            <Typography variant="body2">{ringData.rmsd} [Å]</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
              Experimental method:
            </Typography>
            <Typography variant="body2">{ringData.experimental_method}</Typography>
          </Box>
          {ringData.resolution == 'N/A' ? null : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
                Resolution:
              </Typography>
              <Typography variant="body2">{ringData.resolution}</Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
              RSR:
            </Typography>
            <Typography variant="body2">{ringData.rsr}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
              RSCC:
            </Typography>
            <Typography variant="body2">{ringData.rscc}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
              Atoms:
            </Typography>
            <Typography variant="body2">{getAtoms(ringID)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
              Assigned conformation:
            </Typography>
            <Typography variant="body2">{ringData.conformation}</Typography>
            <Chip
              label={favorable ? 'favorable' : 'unfavorable'}
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
            // margin: '0 auto',
          }}
        >
          <Box
            sx={{
              minWidth: '420px',
              width: '800px',
              minHeight: '420px',
              height: '460px',
              border: 1,
              borderRadius: 1,
            }}
          ></Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              margin: '12px 0',
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={showElectronDensity}
                  onChange={() => setShowElectronDensity(!showElectronDensity)}
                />
              }
              label="Show electron density"
              sx={{
                '& .MuiTypography-root': {
                  fontSize: '1rem',
                  whiteSpace: 'nowrap',
                },
              }}
            />
            <Button
              onClick={() => {}}
              startIcon={<FileDownloadIcon sx={{ color: '#7C7C7C' }} />}
              sx={{ fontSize: '1rem', whiteSpace: 'nowrap', color: '#3A3A3A' }}
            >
              Download Structure
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RingDetails;
