import { Box, Typography } from '@mui/material';
import React from 'react';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#1e1e1e', color: 'white', py: 6, mt: 6 }}>
      {/* Main footer container */}
      <Box
        sx={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      ></Box>

      {/* Footer Text */}
      <Box sx={{ textAlign: 'center', my: 4, color: 'gray' }}>
        <Typography variant="body2">© 2025 RingWeb. All Rights Reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Footer;
