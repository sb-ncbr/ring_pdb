import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { formatNumber } from '../helperFunctions/helpers.ts';
import { styled } from '@mui/material/styles';

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

export const SelectableCard = styled(Card)(({ theme, selected }) => ({
  transform: selected ? 'translateY(-10px)' : 'none',
  boxShadow: selected ? theme.shadows[24] : theme.shadows[1],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: selected ? theme.shadows[24] : theme.shadows[6],
  },
  maxWidth: 345,
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
      <CardActionArea disabled={disabled || isSelected} onClick={handleCardSelect}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="300"
          image="https://fakeimg.pl/345x300/e46962/ffffff?text=No+image&font=bebas"
        />
        <CardContent>
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
