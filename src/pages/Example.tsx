import React from 'react';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import { labels } from '../constants';
import data from '../content/examples.json';
import { Typography } from '@mui/material';

const Example: React.FC<{ example: string }> = ({ example }) => {
  // const { id } = useParams<{ id: string }>();
  const result = data.results.find((item) => item.example === example);

  if (!result) {
    return <div>Result not found</div>;
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
          {labels.pdbID}:{' '}
        </Typography>
        <Typography variant="body2">{result.pdbID}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
          {labels.ccdID}:{' '}
        </Typography>
        <Typography variant="body2">{result.ccdID}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
          {labels.atoms}:{' '}
        </Typography>
        <Typography variant="body2">{result.atoms}</Typography>
      </Box>

      <Typography variant="body2" component="div">
        {result.body}
      </Typography>
    </Box>
  );
};

export default Example;
