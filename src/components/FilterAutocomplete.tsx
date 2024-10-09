import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { Checkbox, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';

export default function FilterAutocomplete({
  allOptions,
  filterByLabel,
}: {
  allOptions: string[];
  filterByLabel: string;
}) {
  type Option = (typeof allOptions)[number];
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
    <Box
      sx={{
        flexGrow: 1, // Allows the filter to grow and take available space
        minWidth: '290px', // Ensure it has a minimum width
      }}
    >
      <Autocomplete
        multiple
        size="small"
        // limitTags={10}
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
              label={`Filter by ${filterByLabel}`}
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
          flexGrow: 1,
          minWidth: '290px',
          maxWidth: '100%',
        }}
      />
    </Box>
  );
}
