import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Checkbox, Chip, Paper, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import { OtherSelectedFiltersType } from '../data/dataTypes';

const getPdbSearchPrefix = (value: string): string | null => {
  let input = value.trim().toLowerCase();

  if (/^pdb?_?$/.test(input)) {
    return null;
  }

  if (input.startsWith('pdb_')) {
    input = input.slice(4);
  }

  input = input.replace(/^0+/, '');

  // start showing options only after second char
  if (input.length < 2) {
    return null;
  }

  return input;
};

const toLegacyPdbId = (id: string): string => {
  const normalized = id.trim().toLowerCase();

  if (!normalized.startsWith('pdb_')) {
    return normalized;
  }

  return normalized.slice(-4);
};

export default function FilterPDBAutocomplete({
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

  const filterPdbOptions = (options: string[], input: string) => {
    const query = input.trim().toLowerCase();

    return options.filter((option) => {
      const extendedId = option.toLowerCase();
      const legacyId = toLegacyPdbId(option).toLowerCase();

      return (
        extendedId.startsWith(query) ||
        legacyId.startsWith(query)
      );
    });
  };



  const filterOptionsMUI = (options: string[], { inputValue }: { inputValue: string }) => {
    const query = inputValue.trim().toLowerCase();

    return options.filter((option) => {
      const extendedId = option.toLowerCase();
      const legacyId = toLegacyPdbId(option);

      return extendedId.startsWith(query) || legacyId.startsWith(query);
    });
  };

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

    const filteredOptions = filterPdbOptions(allOptions, inputValue);
    if (reason === 'selectOption') {
      setSelectAll(stringValue.length === filteredOptions.length);
    }
    setSelectedOptions(stringValue);
    onChange(stringValue);
  };

  const url = `${import.meta.env.VITE_API_URL}/api/get_pdb_ids`;

  useEffect(() => {
    const searchPrefix = getPdbSearchPrefix(inputValue);

    if (!searchPrefix) {
      setAllOptions([]);
      return;
    }
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
        console.error('Error fetching PDB IDs:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [inputValue, otherSelectedFilters, url]);

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
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              {toLegacyPdbId(option)}
              <Typography
                component="span"
                sx={{
                  ml: 1,
                  fontSize: '0.75rem',
                  opacity: 0.6,
                }}
              >
                ({option})
              </Typography>
            </li>
          );
        }}
        renderValue={(value, getItemProps) =>
          value.map((option, index) => (
            <Chip
              {...getItemProps({ index })}
              key={option}
              label={toLegacyPdbId(option)}
              size="small"
            />
          ))
        }
        slots={{
          paper: (paperProps) => {
            const { children, ...restPaperProps } = paperProps;
            const visibleOptions = filterPdbOptions(allOptions, inputValue);

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
              label={`Filter by PDB ID`}
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
