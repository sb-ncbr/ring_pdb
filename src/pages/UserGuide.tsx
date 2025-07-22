import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from '@mui/material';
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
        Explore and analyze ring conformations from macromolecular structures in the{' '}
        <Link href="https://www.ebi.ac.uk/pdbe/" target="_blank" rel="noopener">
          Protein Data Bank
        </Link>
        . Use our web application to search, filter, and visualize individual rings within their
        real molecular environment.
      </Typography>

      {/* Section: Main Page */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Main Page</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="div" variant="body1">
            <ul style={{ paddingLeft: '1.2em', marginTop: 0, marginBottom: 0 }}>
              <li>
                <strong>Search by PDB ID(s)</strong> or <strong>CCD ID(s)</strong>: Search for rings in selected PDB structures OR in ligands.
                Multiple IDs can be separated by comma, semicolon, or space. Case-insensitive.
              </li>
              <li>
                <strong>Browse by Ring Type</strong>: Explore available rings and their
                conformations through a guided stepper, then browse data for selected combinations.
              </li>
              <li>
                <strong>Browse All Data</strong>: Open the full dataset directly with advanced
                filtering and visualization access.
              </li>
              <li>
                <strong>Example Ring Links</strong>: Jump straight into visualization pages of
                example rings.
              </li>
            </ul>
          </Typography>


          <Typography variant="body1" sx={{ mt: 3 }}>
            From the Main page you can also directly access the Visualization page of example rings.
          </Typography>
          <img
            src="/images/ringweb_flow.svg"
            alt="Flow of the RingWeb application"
            style={{ width: '100%', marginTop: 16, borderRadius: 4 }}
          />
        </AccordionDetails>
      </Accordion>

      {/* Section: Table Page */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Table Page</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="div" variant="body1">
            <ul style={{ paddingLeft: '1.2em', marginTop: 0, marginBottom: 0 }}>
              <li>
                <strong>Interactive Data Table</strong>: Apply basic and advanced filters, sort
                columns, download data as CSV, and access visualization tools.
              </li>
              <li>
                <strong>Filtering by Ring Type & Conformation</strong>: Use dropdowns or start from
                the interactive stepper on the main page.
              </li>
              <li>
                <strong>Top Toolbar Options</strong>:
                <ul style={{ paddingLeft: '1.2em', marginTop: 4 }}>
                  <li>Enable advanced filters for more precise control.</li>
                  <li>Toggle compact table view to hide less relevant columns.</li>
                  <li>Download filtered results as CSV.</li>
                </ul>
              </li>
              <li>
                <strong>Bottom Toolbar</strong>: Displays total selected rings and lets you set rows
                per page.
              </li>
              <li>
                <strong>Advanced Filtering</strong>: Filter by PDB IDs, CCD IDs (autocomplete starts
                after 2 characters), or experimental method.
              </li>
              <li>
                <strong>Input Shortcuts</strong>: You can enter multiple PDB/CCD IDs directly from
                the Main Page.
              </li>
              <li>
                <strong>Filter Dependencies</strong>: Changing higher-level filters (ring type,
                conformation) resets filters below.
              </li>
              <li>
                <strong>Sliders for Numeric Filtering</strong>: Set min/max values and reset them
                independently.
              </li>
              <li>
                <strong>Row Interaction</strong>: Click any row for detailed info.
              </li>
              <li>
                <strong>Details Button</strong>: Left-click to go to the Visualization page.
                Right-click to preview the ligand’s 2D structure.
              </li>
            </ul>
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Section: Ring Details Page */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">️Visualization Page</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="div" variant="body1">
            <ul style={{ paddingLeft: '1.2em', marginTop: 0, marginBottom: 0 }}>
              <li>
                Access the Ring Details Page via the table or via example cards
                from the homepage.
              </li>
              <li>
                Interact with the ring using the <strong>Mol*</strong> 3D Viewer.
              </li>
              <li>
                Toggle <strong>electron density maps</strong> to evaluate model fit.
              </li>
              <li>Download the structure in CIF format.</li>
            </ul>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
