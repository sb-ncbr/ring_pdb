import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

interface RingCardProps {
  header: 'Cyclohexane' | 'Cyclopentane' | 'Benzene';
  ccd: number;
  pdb: number;
  total: number;
  confs?: { name: string; count: number }[];
  handleClick: () => void;
  handleCardSelect: any;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export const RingCard: React.FC<RingCardProps> = ({
  header,
  ccd,
  pdb,
  total,
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
            {header}
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
    </Card>
  );
};
