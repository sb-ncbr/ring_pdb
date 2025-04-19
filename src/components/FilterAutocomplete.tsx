import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Checkbox, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import axios from 'axios';

export default function FilterAutocomplete({
  filterByLabel,
  onChange,
  selectedValues,
}: {
  filterByLabel: string;
  onChange: (newValue: any) => void;
  selectedValues: string[];
}) {
  const [allOptions, setAllOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [selectedOptions, setSelectedOptions] = useState<string[]>(selectedValues || []);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Function to filter options based on the input value
  const filterOptions = (options: string[], input: string) => {
    return options.filter((option) => {
      return input.toLowerCase().trim() === option.slice(0, input.length).toLowerCase().trim();
    });
  };

  const filterOptionsMUI = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => String(option),
  });

  const handleToggleSelectAll = (visibleOptions: string[]) => {
    setSelectedOptions((prevSelectedOptions) => {
      const newSelectedOptions = selectAll
        ? prevSelectedOptions.filter((option) => !visibleOptions.includes(option))
        : [...new Set([...prevSelectedOptions, ...visibleOptions])]; // Append visible options

      onChange(newSelectedOptions);
      return newSelectedOptions;
    });
    setSelectAll((prev) => !prev); // Toggle selectAll state
  };

  const handleChange = (_: any, value: unknown[], reason: string) => {
    const stringValue = value as string[];
    if (reason === 'clear' || reason === 'removeOption') {
      setSelectAll(false);
    }

    const filteredOptions = filterOptions(allOptions, inputValue);
    if (reason === 'selectOption') {
      setSelectAll(stringValue.length === filteredOptions.length);
    }
    setSelectedOptions(stringValue);
    onChange(stringValue);
  };

  const url = filterByLabel === 'PDB ID' ? '/api/get_pdb_ids' : '/api/get_ccd_ids';

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setAllOptions(response.data);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
        return;
      });
  }, []);

  return (
    <Box
      sx={{
        flexGrow: 1, // Allows the filter to grow and take available space
        minWidth: '290px', // Ensure it has a minimum width
      }}
    >
      <Autocomplete
        multiple
        // size="small"
        // limitTags={10}
        filterSelectedOptions
        filterOptions={filterOptionsMUI}
        value={selectedOptions}
        onChange={handleChange}
        options={allOptions}
        // getOptionLabel={(option) => option}
        open={inputValue.length >= 2}
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
                    label="Select all current matches"
                    control={<Checkbox id="select-all-checkbox" checked={selectAll} />}
                  />
                )}
              </Box>
              <Divider />
              {children}
            </Paper>
          );
        }}
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
              placeholder={!selectedOptions.length ? 'Start typing for autocomplete...' : ''}
              sx={{
                '& .MuiOutlinedInput-input': {
                  fontSize: '0.9rem',
                },
              }}
              slotProps={{
                input: {
                  ...restInputProps,
                  startAdornment: (
                    <div
                      style={{
                        maxHeight: '75px',
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
