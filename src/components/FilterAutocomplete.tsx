import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { Checkbox, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';

export default function FilterAutocomplete() {
  const [inputValue, setInputValue] = useState('');

  const [columns, setColumns] = useState<Option[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Function to filter options based on the input value
  const filterOptions = (options: Option[], input: string) => {
    return options.filter((option) => option.toLowerCase().includes(input.toLowerCase()));
  };

  const handleToggleSelectAll = (visibleOptions: Option[]) => {
    setColumns((prevColumns) => {
      const newColumns = selectAll
        ? prevColumns.filter((column) => !visibleOptions.includes(column))
        : [...new Set([...prevColumns, ...visibleOptions])]; // Append visible options

      return newColumns;
    });
    setSelectAll((prev) => !prev); // Toggle selectAll state
  };

  const handleChange = (_: any, value: Option[], reason: string) => {
    if (reason === 'clear' || reason === 'removeOption') {
      setSelectAll(false);
    }

    const filteredOptions = filterOptions(allOptions, inputValue);
    if (reason === 'selectOption') {
      setSelectAll(value.length === filteredOptions.length);
    }
    setColumns(value);
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Autocomplete
        multiple
        size="small"
        limitTags={2}
        filterSelectedOptions
        value={columns}
        onChange={handleChange}
        PaperComponent={(paperProps) => {
          const { children, ...restPaperProps } = paperProps;
          const visibleOptions = filterOptions(allOptions, inputValue);

          return (
            <Paper {...restPaperProps}>
              <Box
                onMouseDown={(e) => e.preventDefault()} // prevent blur
                pl={1.5}
                py={0.5}
              >
                {visibleOptions.length > 0 && ( // Only render if there are visible options
                  <FormControlLabel
                    onClick={(e) => {
                      e.preventDefault(); // prevent blur
                      handleToggleSelectAll(visibleOptions);
                    }}
                    label="Select current matches"
                    control={<Checkbox id="select-all-checkbox" checked={selectAll} />}
                  />
                )}
              </Box>
              <Divider />
              {children}
            </Paper>
          );
        }}
        options={allOptions}
        getOptionLabel={(option) => option}
        open={inputValue.length >= 2}
        onInputChange={(_e, value) => {
          setInputValue(value);
          setSelectAll(false); // Unselect "Select All" when input changes
        }}
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
                        maxHeight: '112px',
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
          flexGrow: 1,
          minWidth: '290px',
          maxWidth: '100%',
        }}
      />
    </Box>
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
  const characters = 'abcdef12345';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const allOptions: string[] = generateUniquePdbIds(100);
type Option = (typeof allOptions)[number];
