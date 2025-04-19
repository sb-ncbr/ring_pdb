import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { formatNumber } from '../helperFunctions/helpers.ts';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { RotatingMolecule } from './RotatingMolecule.tsx';

interface RingCardProps {
  name: 'Cyclohexane' | 'Cyclopentane' | 'Benzene';
  ccd: number;
  pdb: number;
  total: number;
  confs?: { name: string; count: number }[];
  handleCardSelect: () => void;
  isSelected: boolean;
  disabled: boolean;
}

interface SelectableCardProps {
  selected?: boolean;
}

export const SelectableCard = styled(Card)<SelectableCardProps>(({ theme, selected }) => ({
  transform: selected ? 'translateY(-10px)' : 'none',
  boxShadow: selected ? theme.shadows[24] : theme.shadows[1],
  border: selected ? `1px solid ${theme.palette.primary.main}` : '0',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  backgroundColor: '#fff',
  '&.MuiPaper-root': {
    backgroundColor: '#fff',
  },
  '&:hover': {
    boxShadow: selected ? theme.shadows[24] : theme.shadows[6],
    backgroundColor: '#fff',
  },
  maxWidth: 345,
  width: 345,
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
          <Box sx={{ height: 300 }}>
            <RotatingMolecule modelPath={`/geometry/${name}.glb`} />
          </Box>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {formatNumber(ccd)} ligands in the CCD
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {formatNumber(pdb)} ligand instances in the PDB
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {formatNumber(total)} analyzed rings
          </Typography>
        </CardContent>
      </CardActionArea>
    </SelectableCard>
  );
};
