import React from 'react';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import { labels } from '../constants';
import data from '../content/ringDetails.json';
import { Typography } from '@mui/material';

const RingDetails: React.FC = () => {
  const { ringId } = useParams<{ ringId: string }>();
  console.log(ringId);
  const result = data.data[ringId];

  if (!result) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', margin: '24px auto', padding: '0 16px' }}>
        <Typography>No data available</Typography>
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
        <Typography variant="body2">{result.pdb_id}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
          {labels.ccdID}:{' '}
        </Typography>
        <Typography variant="body2">{result.ccd_id}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
          Residue ID:
        </Typography>
        <Typography variant="body2">{result.residue_id}</Typography>
      </Box>

      <Typography variant="body2" component="div">
        Ring type: {result.ring_type}
      </Typography>
    </Box>
  );
};

export default RingDetails;
