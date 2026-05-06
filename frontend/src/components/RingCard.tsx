import * as React from 'react';
import Card, { CardProps } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { formatNumber } from '../helperFunctions/helpers.tsx';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { RingType } from '../data/dataTypes.ts';
import MoleculeWithFallback from './MoleculeWithFallback.tsx';

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

interface SelectableCardProps extends CardProps {
  selected?: boolean;
}

export const SelectableCard: React.ComponentType<SelectableCardProps> = styled(
  Card,
)<SelectableCardProps>(({ theme, selected }) => ({
  transform: selected ? 'translateY(-10px)' : 'none',
  boxShadow: selected ? theme.shadows[24] : theme.shadows[1],
  border: selected ? `1px solid ${theme.palette.primary.main}` : '0',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: selected ? theme.shadows[24] : theme.shadows[6],
  },
  width: 280,
}));

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
          <Typography variant="body1">{formatNumber(ccd)} ligands in the CCD</Typography>
          <Typography variant="body1">{formatNumber(pdb)} ligand instances in the PDB</Typography>
          <Typography variant="body1">{formatNumber(total)} analyzed rings</Typography>
        </CardContent>
      </CardActionArea>
    </SelectableCard>
  );
};
