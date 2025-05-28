import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import DatasetOutlinedIcon from '@mui/icons-material/DatasetOutlined';
import StorageIcon from '@mui/icons-material/Storage';
import UpdateIcon from '@mui/icons-material/Update';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

export const DataDescription: React.FC = () => {
  return (
    <Box sx={{ padding: 4, maxWidth: '900px', margin: '0 auto' }}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <DatasetOutlinedIcon fontSize="large" />
        <Typography variant="h3">Data Description</Typography>
      </Box>

      <Typography variant="body1">
        This web application provides access to a dataset of molecular ring conformations extracted
        from macromolecular structures deposited in the Protein Data Bank (PDB). The data focuses on
        three common ring types: <strong>cyclohexane</strong>, <strong>cyclopentane</strong>, and{' '}
        <strong>benzene</strong>.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle2" gutterBottom>
        Data Sources
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText primary="Protein Data Bank (PDB)" secondary="www.rcsb.org" />
        </ListItem>
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle2" gutterBottom>
        Notes & Limitations
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <WarningAmberOutlinedIcon color="warning" />
          </ListItemIcon>
          <ListItemText primary="Only ligands containing cyclohexane, cyclopentane, or benzene rings are included." />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <UpdateIcon color="action" />
          </ListItemIcon>
          <ListItemText primary="Dataset last updated: April 2024" />
        </ListItem>
      </List>

      <Divider sx={{ my: 3 }} />

      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2">Current Dataset Overview:</Typography>
          <Typography variant="body2">
            <br />• Total ring instances: <strong>138,302</strong>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
