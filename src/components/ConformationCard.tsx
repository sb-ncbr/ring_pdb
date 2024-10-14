import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { formatNumber } from '../helperFunctions/helpers.ts';
import { SelectableCard } from './RingCard.tsx';

interface RingCardProps {
  name: string;
  count: number;
  handleCardSelect: () => void;
  isSelected: boolean;
  disabled: boolean;
}

export const ConformationCard: React.FC<RingCardProps> = ({
  name,
  count,
  handleCardSelect,
  isSelected,
  disabled,
}) => {
  return (
    <SelectableCard selected={isSelected} sx={{ maxWidth: 325 }}>
      <CardActionArea onClick={handleCardSelect} disabled={disabled}>
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
            {formatNumber(count)} rings
          </Typography>
        </CardContent>
      </CardActionArea>
    </SelectableCard>
  );
};
