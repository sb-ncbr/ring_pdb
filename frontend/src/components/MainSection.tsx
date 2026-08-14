import { Link, List, ListItem, Typography } from '@mui/material';
import Heading from './Heading.tsx';

export const MainSection = () => {
  return (
    <>
      <Heading text="Welcome" />

      <Typography
        variant="body1"
        component="div"
        sx={{
          width: "100%",
          margin: "16px 0",
          textAlign: "left",
        }}
      >
        Discover, analyse, and explore molecular ring structures like never
        before. RingPDB is a powerful web-based platform designed to help
        researchers efficiently navigate the vast dataset of rings in ligands and non-standard residues in the{" "}
        <Link
          href="https://www.ebi.ac.uk/pdbe/"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
        >
          Protein Data Bank (PDB)
        </Link>
        . Start your journey today and uncover new perspectives in rings conformation
        research with ease and precision!
      </Typography>

      <Typography
        variant="body1"
        component="div"
        sx={{
          width: "100%",
          margin: "16px 0",
          textAlign: "left",
        }}
      >
        Whether you’re investigating structural irregularities, validating
        ring conformations, or gaining insights into molecular interactions,
        RingPDB provides the tools you need:
      </Typography>

      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item", p: 0 }}>
          <Typography variant="body1">
            Instantly identify unfavorable conformations.
          </Typography>
        </ListItem>
        <ListItem sx={{ display: "list-item", p: 0 }}>
          <Typography variant="body1">
            Filter and search by ring type or conformation.
          </Typography>
        </ListItem>
        <ListItem sx={{ display: "list-item", p: 0 }}>
          <Typography variant="body1">
            Dive deep into 3D visualizations powered by Mol*.
          </Typography>
        </ListItem>
      </List>
    </>
  );
};
