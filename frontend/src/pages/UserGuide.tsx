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
import { Callout } from '../components/Callout.tsx';

export const UserGuide: React.FC = () => {
  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 4 }}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <AutoStoriesOutlinedIcon fontSize="large" />
        <Typography variant="h3">User Guide</Typography>
      </Box>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Explore and analyse ring conformations from macromolecular structures in the{' '}
        <Link href="https://www.ebi.ac.uk/pdbe/" target="_blank" rel="noopener">
          Protein Data Bank
        </Link>
        . Use our web application to search, filter, and visualise individual rings within their
        real molecular environment.
      </Typography>

      {/* Section: Main Page */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Main Page</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" sx={{ mb: 3 }}>
            The <strong>Main Page</strong> serves as the starting point of the application. From
            here, you can choose among four primary modes of exploration. Each option will lead you
            to the <strong>Table Page</strong>, where you can browse ring data and access
            visualisations. Only in case of <strong>Browsing Rings and Conformations</strong> you
            will reach <strong>Table Page</strong> by proceeding through interactive stepper first.
            However, your choice here, on the <strong>Main Page</strong>, does not limit your
            ability to explore the full dataset later. The available options are:{' '}
          </Typography>
          <Typography component="div" variant="body1">
            <ul style={{ paddingLeft: '1.2em', marginTop: 0, marginBottom: 0 }}>
              <li>
                <strong>Search by PDB ID</strong>:<br />
                Enter one or more Protein Data Bank (PDB) structure IDs to search for rings within
                those structures. Multiple IDs can be separated by commas, semicolons, or spaces.
                Both lowercase and uppercase formats are accepted.
              </li>
              <li>
                <strong>Search by CCD ID</strong>:<br />
                Enter one or more Chemical Component Dictionary (CCD) IDs to find rings in specific
                ligands and other non-standard residues. Use the same format and separators as for
                PDB IDs.
              </li>
              <li>
                <strong>Browse Rings and Conformations</strong>:<br />
                Use a two-step interface to explore available ring types and their conformations.
                You can preview conformations visually before browsing detailed data for selected
                combinations.
              </li>
              <li>
                <strong>Browse Full Dataset</strong>:<br />
                Jump directly to the <strong>Table Page</strong>, where the full dataset is
                displayed and where you can apply advanced filters and access individual ring
                visualisations.
              </li>
            </ul>
          </Typography>

          <Typography variant="body1" sx={{ mt: 3 }}>
            From the <strong>Main page</strong> you can also directly access the{' '}
            <strong>Visualisation page</strong> of <strong>example rings</strong>.
          </Typography>
          <img
            src="assets/images/docs_scheme.svg"
            alt="Diagram of the RingPDB application flow"
            style={{ width: '50%', margin: 16, borderRadius: 4 }}
          />
        </AccordionDetails>
      </Accordion>

      {/* Section: Browse Rings and Conformations */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Browse Rings and Conformations Page</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="div" variant="body1" sx={{ mb: 3 }}>
            Using this two-step interface you can browse available rings and their conformations.
            The selectable cards provide some basic counts for rings/conformations.
            <ol style={{ paddingLeft: '1.2em', marginTop: 0, marginBottom: 0 }}>
              <li>Start with selecting a ring.</li>
              <li>Then you can select multiple conformations of your interest for that ring.</li>
              <li>
                Click "Browse the data" button appeared at the bottom to continue to the Table page,
                where you can browse individual ring entries for your selected combination.
              </li>
            </ol>
          </Typography>
          <img
            src="assets/images/browse_screenshot.png"
            alt="Screenshot of Browse Rings and Conformations Page"
            style={{ width: '100%', height: 'auto', display: 'block' }}
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
            <Typography variant="subtitle2" gutterBottom>
              Overview
            </Typography>
            <Typography>
              The <strong>Table Page</strong> presents ring data in a structured, interactive
              format. Key features include:
            </Typography>
            <ul style={{ paddingLeft: '1.2em' }}>
              <li>Advanced filtering options</li>
              <img
                src="assets/images/table_left_toolbar_screenshot.png"
                alt="Screenshot of Visualisation Page (Ring Details)"
                style={{ width: '70%', height: 'auto', display: 'block' }}
              />
              <li>Column sorting</li>
              <li>CSV data export</li>
              <li>Navigation to detailed visualisation pages</li>
            </ul>

            <Typography variant="subtitle2" gutterBottom sx={{ marginTop: 2 }}>
              Usage Instructions
            </Typography>
            <ul style={{ paddingLeft: '1.2em' }}>
              <li>
                Begin by selecting a <strong>ring type</strong> and/or <strong>conformation</strong>{' '}
                to filter the dataset. This can also be done through the interactive stepper on the
                Main Page.
              </li>
              <li>
                In the <strong>top-right toolbar</strong>, you can:
                <ul style={{ paddingLeft: '1.2em', marginTop: 4 }}>
                  <li>
                    Enable <strong>Advanced Filters</strong> to access two additional filtering
                    levels.
                  </li>
                  <li>
                    Download the currently selected data in <strong>CSV</strong> format.
                  </li>
                </ul>
              </li>
              <li>
                The <strong>bottom toolbar</strong> shows the total number of matching entries and
                allows you to adjust the number of rows displayed per page.
              </li>
              <li>
                When <strong>Advanced Filters</strong> are enabled, you can further narrow your
                results by:
                <ul style={{ paddingLeft: '1.2em', marginTop: 4 }}>
                  <li>
                    <strong>PDB ID</strong> or <strong>CCD ID</strong>: These fields support
                    autocomplete after entering at least two characters.
                  </li>
                  <li>
                    <strong>Experimental Method</strong>
                  </li>
                </ul>
              </li>
              <Callout type="info">
                In the Table Page filters,{' '}
                <strong>
                  PDB and CCD fields support only one entry at a time via autocomplete
                </strong>
                .<br />
                To search using <strong>multiple PDB or CCD IDs simultaneously</strong>, please use
                the <strong>direct input field on the Main Page</strong>, where you can enter
                several IDs separated by commas, semicolons, or spaces. Both uppercase and lowercase
                formats are accepted.
              </Callout>

              <Callout type="warning">
                Changing filters at higher levels (e.g., Ring Type or Conformation) will reset all
                lower-level filters.
              </Callout>
              <li>
                The <strong>third filter level</strong> allows you to define{' '}
                <strong>minimum and maximum</strong> values for numerical fields using sliders.
              </li>
              <Callout type="reset">
                Use the <strong>reset button</strong> next to sliders to clear <strong>all</strong>{' '}
                numerical filter settings at once.
              </Callout>
              <li>
                <strong>Click on a table row</strong> to navigate to the{' '}
                <strong>Visualisation Page</strong> for the selected ring.
              </li>
              <li>
                <strong>Click on the image</strong> in the "Details" column to preview the 2D
                structure of the residue.
              </li>
            </ul>
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Section: Ring Details Page */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Visualisation Page (Ring Details)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" sx={{ mb: 3 }}>
            On the left side of the page you can find information about the current ring, including
            atom names.
          </Typography>
          <img
            src="assets/images/ring_details_screenshot.png"
            alt="Screenshot of Visualisation Page (Ring Details)"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          <Typography component="div" variant="body1">
            <ul style={{ paddingLeft: '1.2em', marginTop: 0, marginBottom: 0 }}>
              <li>
                Access the page via the <strong>Table Page</strong> or via{' '}
                <strong>example cards</strong> on the Main Page.
              </li>
              <li>
                Interact with the ring structure using the <strong>Mol* 3D viewer</strong>.
              </li>
              <li>
                Toggle <strong>electron density maps</strong> to evaluate model fit.
              </li>
              <li>
                Download the 3D structure in <strong>CIF format</strong>.
              </li>
            </ul>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
