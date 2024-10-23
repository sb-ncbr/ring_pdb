import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import { labels } from '../constants';
import { Typography } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import Loader from '../components/Spinner.tsx';

const RingDetails: React.FC = () => {
  const { ringID } = useParams<{ ringID: string }>();
  // console.log(ringID);
  const [ringData, setRingData] = useState(null);
  const [error, setError] = useState(null);

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

  return (
    <Box
      sx={{
        display: 'flex',
        maxWidth: '1000px',
        flexDirection: 'column',
        alignItems: 'left',
        padding: '0 16px',
        margin: '24px auto',
        color: 'text.primary',
      }}
    >
      <Typography
        variant="h4"
        component="div"
        sx={{
          width: '100%',
          margin: '16px 0',
          textAlign: 'left',
        }}
      >
        Ring details
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
          PDB ID:
        </Typography>
        <Typography variant="body2">
          <a
            href={`https://www.ebi.ac.uk/pdbe/entry/pdb/${ringData.pdb_id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {ringData.pdb_id} <LinkIcon fontSize="small" sx={{ marginLeft: '4px' }} />
          </a>
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
          {labels.ccdID}:{' '}
        </Typography>
        <Typography variant="body2">
          <a
            href={`https://www.ebi.ac.uk/pdbe-srv/pdbechem/chemicalCompound/show/${ringData.ccd_id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {ringData.ccd_id} <LinkIcon fontSize="small" sx={{ marginLeft: '4px' }} />
          </a>
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
          Residue ID:
        </Typography>
        <Typography variant="body2">{ringData.residue_id}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
          Ring type:
        </Typography>
        <Typography variant="body2">{ringData.ring_type}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
          Ring coverage:
        </Typography>
        <Typography variant="body2">{ringData.ring_coverage}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
          Assigned conformation:
        </Typography>
        <Typography variant="body2">{ringData.conformation}</Typography>
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
      {ringData.resolution == 'NaN' ? null : (
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
    </Box>
  );
};

export default RingDetails;
