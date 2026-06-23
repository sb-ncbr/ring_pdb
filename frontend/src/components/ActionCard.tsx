import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
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

  const inputRef = useRef<HTMLInputElement>(null);

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
        maxWidth: 300,
        minHeight: 350,
        backgroundColor: color,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[6],
        },
      })}
    >
      <Box
        sx={{ height: '100%', cursor: url ? 'pointer' : 'default' }}
        onClick={url ? () => navigate(url) : undefined}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            p: 6,
            gap: 4,
          }}
        >
          <Box sx={{ minHeight: 110 }}>
            <Typography variant="subtitle1" component="div">
              {header}
            </Typography>
          </Box>
          <Typography variant="body1">{body}</Typography>
          {action === 'input' ? (
            <Box component="form" onSubmit={handleSubmit}>
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
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleSubmit}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          ) : null}
        </CardContent>
      </Box>
    </Card>
  );
};

export default ActionCard;
