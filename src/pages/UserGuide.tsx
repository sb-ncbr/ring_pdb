import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const UserGuide: React.FC = () => {
  return (
    <Box sx={{ maxWidth: '900px', mx: 'auto', p: 4 }}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <AutoStoriesOutlinedIcon fontSize="large" />
        <Typography variant="h3">User Guide</Typography>
      </Box>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Explore and analyze ring conformations from macromolecular structures. Use our dataset to
        search, filter, and visualize individual rings within their real molecular environment.
      </Typography>

      {/* Section 1 */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Overview of Main Options</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            • <strong>Search by PDB ID(s)</strong>: Find ring data by structure IDs.
            <br />• <strong>Search by CCD ID(s)</strong>: Find ring data by chemical component IDs.
            <br />• <strong>Browse by Ring Type</strong>: Explore conformations of cyclohexane,
            cyclopentane, or benzene.
            <br />• <strong>Browse All Data</strong>: Explore the full dataset with powerful
            filters.
            <br />• <strong>Direct Example Links</strong>: Go straight into ring details
            visualization.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Section 2 */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Data Table Features</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            • Each row represents a ring conformation with PDB ID, CCD ID, ring type, resolution,
            experimental method, and more.
            <br />• Click the <strong>Details</strong> button to access the interactive 3D viewer.
            <br />• Right-click the <strong>Details</strong> button to display a 2D visualization of
            the ligand along with its ring.
            <br />• Download filtered data as CSV.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Section 3 */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Filters Explained</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            • <strong>Ring type</strong>: Cyclohexane, cyclopentane, and benzene.
            <br />• <strong>Conformation (Favorable/Unfavorable)</strong>: Ring conformation with
            its energetic status.
            <br />• <strong>Experimental Method</strong>: Structure determination technique.
            <br />• <strong>Resolution</strong>: Numeric value for structure resolution.
            <br />• <strong>Ring Coverage</strong>: % coverage by electron density.
            <br />• <strong>RSR / RSCC</strong>: Real-space refinement and correlation scores.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Section 4 */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">️Ring Details & 3D Visualization</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            • Access the <strong>Ring Details Page</strong> via the table or via example cards from
            the homepage.
            <br />• Interact with the ring using the <strong>Mol*</strong> 3D Viewer.
            <br />• Toggle <strong>electron density maps</strong> to evaluate model fit.
            <br />• View key metrics alongside the visualization.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Section 5 */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">FAQ / Troubleshooting</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            • Missing filters? → Toggle showing advanced filters.
            <br />• Reset all <strong>slider</strong> filters using the <strong>Reset icon</strong>{' '}
            button in the toolbar.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
