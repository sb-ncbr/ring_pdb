import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Checkbox, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import { OtherSelectedFiltersType } from '../data/dataTypes';


export default function FilterCCDAutocomplete({
  onChange,
  selectedValues,
  otherSelectedFilters,
}: {
  onChange: (newValue: any) => void;
  selectedValues: string[];
  otherSelectedFilters: OtherSelectedFiltersType;
}) {
  const [allOptions, setAllOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(selectedValues || []);
  const [selectAll, setSelectAll] = useState<boolean>(false);

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

  const url = `${import.meta.env.VITE_API_URL}/api/get_ccd_ids`;

  useEffect(() => {
    setAllOptions([]);
    setLoading(true);

    axios
      .post(url, {
        otherFilters: otherSelectedFilters
      })
      .then((response) => {
        setAllOptions(response.data.payload);
      })
      .catch((error) => {
        console.error('Error fetching CCD IDs:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [inputValue, otherSelectedFilters]);

  return (
    <Box
      sx={{
        minWidth: '190px',
      }}
    >
      <Autocomplete
        multiple
        filterOptions={filterOptionsMUI}
        value={selectedValues}
        onChange={handleChange}
        options={allOptions}
        loading={loading}
        loadingText="Loading..."
        open={inputValue.length >= 2}
        slots={{
          paper: (paperProps) => {
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
          },
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
              label={`Filter by CCD ID`}
              placeholder={!selectedOptions.length ? 'Start typing...' : ''}
              sx={{
                '& .MuiOutlinedInput-input': {
                  fontFamily: 'Lora, sans-serif',
                  fontSize: '14px',
                  '&::placeholder': {
                    opacity: 0,
                    transition: 'opacity 0.5s ease',
                  },
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input::placeholder': {
                  opacity: 1,
                },
                '& .MuiOutlinedInput-root:not(.Mui-focused) .MuiOutlinedInput-input::placeholder': {
                  opacity: 0,
                  transition: 'opacity 0s',
                },
              }}
              slotProps={{
                input: {
                  ...restInputProps,
                  startAdornment: startAdornment ? (
                    <div
                      style={{
                        maxHeight: '75px',
                        overflowY: 'auto',
                      }}
                    >
                      {startAdornment}
                    </div>
                  ) : null,
                },
              }}
            />
          );
        }}
        sx={{
          minWidth: '190px',
        }}
      />
    </Box>
  );
}
