import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { Chip, Typography } from '@mui/material';

export default function FilterAutocomplete() {
  const [inputValue, setInputValue] = useState('');

  return (
    <Autocomplete
      multiple
      size="small"
      limitTags={2}
      options={pdbIds}
      getOptionLabel={(option) => option}
      open={inputValue.length >= 2}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      defaultValue={pdbIds}
      renderInput={(params) => {
        const { InputProps, ...restParams } = params;
        const { startAdornment, ...restInputProps } = InputProps;
        return (
          <TextField
            {...restParams}
            label="Filter by PDB ID"
            slotProps={{
              input: {
                ...restInputProps,
                startAdornment: (
                  <div
                    style={{
                      maxHeight: '56px',
                      overflowY: 'auto',
                    }}
                  >
                    {startAdornment}
                  </div>
                ),
              },
            }}
          />
        );
      }}
      sx={{
        width: '290px',
      }}
    />
  );
}

function generateUniquePdbIds(count: number): string[] {
  const pdbIds: Set<string> = new Set();

  while (pdbIds.size < count) {
    const pdbId = generatePdbId();
    pdbIds.add(pdbId);
  }

  return Array.from(pdbIds);
}

function generatePdbId(): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const pdbIds: string[] = generateUniquePdbIds(100);
