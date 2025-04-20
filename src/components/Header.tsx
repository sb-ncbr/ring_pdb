import React from 'react';
import { AppBar, Button, Grid2 } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import logo from '/Logo.svg';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Grid2 container spacing={3} alignItems="center">
        <Grid2 size={{ xs: 9 }}>
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </Grid2>
        <Grid2 size={{ xs: 3 }}>
          <Button component={Link} to="/">
            <Typography variant="subtitle2">Home</Typography>
          </Button>
          <Button component={Link} to="/data-description">
            <Typography variant="subtitle2">Data description</Typography>
          </Button>
          <Button component={Link} to="/user-guide">
            <Typography variant="subtitle2">User guide</Typography>
          </Button>
        </Grid2>
      </Grid2>
    </AppBar>
  );
};

export default Header;
