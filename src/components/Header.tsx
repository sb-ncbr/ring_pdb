import React from "react";
import {
  AppBar,
  Button,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import logo from '../Logo.svg';


const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={9}>
          <img src={logo} alt="Logo" />
        </Grid>
        <Grid item xs={3}>
          <Button component={Link} to="/">
            Home
          </Button>
          <Button component={Link} to="/data-description">
            Data description
          </Button>
          <Button component={Link} to="/user-guide">
            User guide
          </Button>
        </Grid>
      </Grid>
    </AppBar>
  )
}

export default Header;