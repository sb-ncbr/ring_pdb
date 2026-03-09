import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

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
        maxWidth: 420,
        maxHeight: 450
      }}
    >
      <CardActionArea onClick={() => navigate(url)} >
        <CardMedia
          component="img"
          src={image}
          alt={header}
          sx={{
            height: 200
          }}
        />
        <CardContent sx={{ height: '100%'}}>
          <Typography gutterBottom variant="subtitle2" component="div">
            {header}
          </Typography>
          <Box component="div" sx={{ overflow: 'auto', maxHeight: 160, paddingRight: 2 }}>
            <Typography variant="body2">{body}</Typography>
          </Box>
          
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ExampleCard;
