import React from 'react';
import { AppBar, Button, Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import logo from '/Logo.svg';
import Box from '@mui/material/Box';

const Header: React.FC = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar
        sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 2, sm: 4 }, py: 2 }}
      >
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', marginLeft: '-16px' }}
        >
          <img src={logo} alt="Logo" style={{ height: 60 }} />
        </Box>

        {/* Navigation Buttons */}
        <Box>
          <Button component={Link} to="/" color="inherit">
            <Typography variant="subtitle2">Home</Typography>
          </Button>
          <Button component={Link} to="/data-description" color="inherit">
            <Typography variant="subtitle2">Data description</Typography>
          </Button>
          <Button component={Link} to="/user-guide" color="inherit">
            <Typography variant="subtitle2">User guide</Typography>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
