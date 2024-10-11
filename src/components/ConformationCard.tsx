import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { formatNumber } from '../helperFunctions/helpers.ts';

interface RingCardProps {
  name: string;
  count: number;
  handleClick: () => void;
  handleCardSelect: () => void;
}

export const ConformationCard: React.FC<RingCardProps> = ({
  name,
  count,
  handleClick,
  handleCardSelect,
}) => {
  return (
    <Card sx={{ maxWidth: 345 }} onClick={handleCardSelect}>
      <CardActionArea onClick={handleClick}>
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
    </Card>
  );
};
