import React from 'react';
import { AppBar, Button, Grid2 } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../Logo.svg';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Grid2 container spacing={3} alignItems="center">
        <Grid2 size={{ xs: 9 }}>
          <img src={logo} alt="Logo" />
        </Grid2>
        <Grid2 size={{ xs: 3 }}>
          <Button component={Link} to="/">
            Home
          </Button>
          <Button component={Link} to="/data-description">
            Data description
          </Button>
          <Button component={Link} to="/user-guide">
            User guide
          </Button>
        </Grid2>
      </Grid2>
    </AppBar>
  );
};

export default Header;
