import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export default function FilterAutocomplete() {
  const [inputValue, setInputValue] = useState('');

  return (
    <Autocomplete
      multiple
      size="small"
      limitTags={3}
      id="multiple-limit-tags"
      options={pdbIds}
      getOptionLabel={(option) => option}
      noOptionsText={inputValue.length < 2 ? 'Start typing PDB ID' : 'No matching options'}
      filterOptions={(options, state) =>
        state.inputValue.length >= 2
          ? options.filter((option) => option.includes(state.inputValue))
          : []
      }
      open={inputValue.length >= 2}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      defaultValue={[pdbIds[1], pdbIds[2], pdbIds[3], pdbIds[4], pdbIds[5]]}
      renderInput={(params) => {
        const { InputProps, ...restParams } = params;
        const { startAdornment, ...restInputProps } = InputProps;
        return (
          <TextField
            {...restParams}
            label="Filter by PDB ID"
            InputProps={{
              ...restInputProps,
              startAdornment: (
                <div
                  style={{
                    maxHeight: '50px',
                    overflowY: 'auto',
                  }}
                >
                  {startAdornment}
                </div>
              ),
              endAdornment: null,
            }}
          />
        );
      }}
      sx={{ width: '265px' }}
    />
  );
}

const pdbIds = [
  '3vfa',
  '1ndb',
  '5cdi',
  '2abk',
  '3bsk',
  '3vfb',
  '4cdd',
  '1abc',
  '2xyz',
  '3rst',
  '3vfc',
];
