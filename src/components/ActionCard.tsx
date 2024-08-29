import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';


interface ActionCardProps {
  header: string;
  body: string;
  action: string;
  inputValue?: string;
  buttonText?: string;
  color: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ header, body, action, inputValue, buttonText, color }) => (
  <Card
    sx={{
      minWidth: 300,
      width: 300,
      minHeight: 280,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: color,
      padding: '0 8px'
    }}
  >
    <CardContent
      sx={{
        flex: '1 0 auto',
        padding: '24px 16px',
      }}>
      <Typography variant="h6" component="div">
        {header}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {body}
      </Typography>
    </CardContent>
    <CardActions
      sx={{
        flexShrink: 0,
        justifyContent: 'center',
        padding: '16px',
        height: '72px'
      }}
    >
      {action === "button"
        ?
        <Button
          size="small"
          variant='outlined'
          sx={{ height: '40px' }}
        >
          {buttonText}
        </Button>
        :
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
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
            }} />
        </Box>
      }
    </CardActions>
  </Card>
);

export default ActionCard;