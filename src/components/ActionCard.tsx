import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import CardActionArea from '@mui/material/CardActionArea';
import { useRef, useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface ActionCardProps {
  header: string;
  body: string;
  action: string;
  color: string;
  url?: string;
  idType?: 'pdb' | 'ccd' | undefined;
}

const ActionCard: React.FC<ActionCardProps> = ({ header, body, action, color, url, idType }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState<string>('');
  const [validatedIds, setValidatedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef(null);

  const handleCardClick = () => {
    inputRef.current?.focus();
  };
  const handleInputChange = (event: React.FormEvent) => {
    const inputTarget = event.target as HTMLInputElement;
    const value = inputTarget.value;
    setInputValue(value);

    const ids = value.split(/[\s,;]+/).filter((id: string) => id);
    const regex = idType == 'pdb' ? /^[1-9][a-zA-Z0-9]{3}$/ : /^[a-zA-Z0-9]{1,5}$/;

    const invalidIds = ids.filter((id: string) => !regex.test(id));

    if (value.trim() === '' || invalidIds.length === 0) {
      setError(null);
      setValidatedIds(ids);
    } else {
      setError(`Invalid IDs: ${invalidIds.join(', ')}`);
    }
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputValue.length != 0 && !error) {
      navigate('/data', {
        state: {
          filters:
            idType == 'pdb'
              ? {
                  pdb_id: validatedIds.map((id) => id.toLowerCase()),
                }
              : {
                  ccd_id: validatedIds.map((id) => id.toUpperCase()),
                },
        },
      });
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={(theme) => ({
        width: 300,
        minHeight: 350,
        backgroundColor: color,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[6],
        },
      })}
    >
      <CardActionArea sx={{ height: '100%' }} onClick={url ? () => navigate(url) : undefined}>
        <CardContent
          sx={{
            flex: '1 0 auto',
            padding: '0 48px',
          }}
        >
          <Typography variant="subtitle1" component="div" sx={{ marginBottom: '48px' }}>
            {header}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, marginBottom: '24px' }}>
            {body}
          </Typography>
          {action === 'input' ? (
            <Box component="form" onSubmit={handleSubmit} sx={{ marginTop: '12px' }}>
              <TextField
                inputRef={inputRef}
                id={`search-by-${idType}`}
                variant="outlined"
                onChange={handleInputChange}
                error={!!error}
                label={error ? 'Error' : ''}
                helperText={error ? 'Incorrect entry' : ''}
                sx={{
                  height: '40px',
                  '& .MuiInputBase-root': {
                    height: '100%',
                    padding: '0 10px',
                    flex: 1,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSubmit}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ActionCard;
