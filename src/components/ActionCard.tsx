import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import CardActionArea from '@mui/material/CardActionArea';


interface ActionCardProps {
  header: string;
  body: string;
  action: string;
  inputValue?: string;
  color: string;
  url?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ header, body, action, inputValue, color, url }) => {
  const navigate = useNavigate()
  return (
    <Card
      sx={{
        minWidth: 300,
        width: 300,
        minHeight: 350,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: color,
      }}
    >
      <CardActionArea sx={{ height: '100%' }} onClick={action === "button" ? () => navigate(url) : undefined}>
        <CardContent
          sx={{
            flex: '1 0 auto',
            padding: '48px',
          }}
        >
          <Typography variant="h6" component="div">
            {header}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {body}
          </Typography>
          {action === "input" ? <Box
              component="form"
            >
              <TextField
                id="search-by"
                variant="outlined"
                placeholder={inputValue}
                sx={{
                  height: '40px',
                  '& .MuiInputBase-root': {
                    height: '100%',
                    padding: '0 10px',
                  },
                }}
              />
            </Box> : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ActionCard;