import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';


interface ExampleCardProps {
    header: string;
    body: string;
    image: string;
}

const ExampleCard: React.FC<ExampleCardProps> = ({ header, body, image }) => (
    <Card
        sx={{
            width: 420,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}
    >
        <CardActionArea sx={{ height: '560px' }}>
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
                <Typography gutterBottom variant="h5" component="div">
                    {header}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {body}
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card>
);

export default ExampleCard;