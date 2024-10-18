import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import { labels } from '../constants';
import { Typography } from '@mui/material';
import Loader from '../components/Spinner.tsx';

const RingDetails: React.FC = () => {
  const { ringID } = useParams<{ ringID: string }>();
  console.log(ringID);
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
        console.log(data);
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
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {ringData.pdb_id}
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
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {ringData.ccd_id}
          </a>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
          Residue ID:
        </Typography>
        <Typography variant="body2">{ringData.residue_id}</Typography>
      </Box>

      <Typography variant="body2" component="div">
        Ring type: {ringData.ring_type}
      </Typography>
    </Box>
  );
};

export default RingDetails;
