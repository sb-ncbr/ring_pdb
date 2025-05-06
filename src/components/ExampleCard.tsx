import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate } from 'react-router-dom';

interface ExampleCardProps {
  header: string;
  body: string;
  image: string;
  url: string;
}

const ExampleCard: React.FC<ExampleCardProps> = ({ header, body, image, url }) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        width: 420,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <CardActionArea onClick={() => navigate(url)} sx={{ height: '560px' }}>
        <CardMedia
          component="img"
          image={image}
          alt={header}
          sx={{
            height: '240px',
            width: '100%',
          }}
        />
        <CardContent sx={{ height: '100%' }}>
          <Typography gutterBottom variant="subtitle1" component="div">
            {header}
          </Typography>
          <Typography variant="body1">{body}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ExampleCard;
