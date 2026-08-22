import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { formatNumber } from '../helperFunctions/helpers.tsx';
import { SelectableCard } from '../helperFunctions/stylers.ts';
import { RingType } from '../data/dataTypes.ts';
import { CardActionArea } from '@mui/material';
import { MoleculeWithFallback } from './MoleculeWithFallback.tsx';

interface RingCardProps {
  name: RingType;
  ccd: number;
  pdb: number;
  total: number;
  confs?: { name: string; count: number }[];
  handleCardSelect: () => void;
  isSelected: boolean;
  disabled: boolean;
}

export const RingCard: React.FC<RingCardProps> = ({
  name,
  ccd,
  pdb,
  total,
  handleCardSelect,
  isSelected,
  disabled,
}) => {
  return (
    <SelectableCard selected={isSelected}>
      <CardActionArea onClick={handleCardSelect} disabled={disabled || isSelected}>
        <CardContent>
          <Box sx={{ height: 220 }}>
            <MoleculeWithFallback modelPath={`assets/geometry/${name}.glb`} />
          </Box>
          <Typography gutterBottom variant="subtitle1" component="div">
            {name}
          </Typography>
          <Typography variant="body1">{formatNumber(ccd)} residues in the CCD</Typography>
          <Typography variant="body1">{formatNumber(pdb)} residue instances in the PDB</Typography>
          <Typography variant="body1">{formatNumber(total)} analysed rings</Typography>
        </CardContent>
      </CardActionArea>
    </SelectableCard>
  );
};
