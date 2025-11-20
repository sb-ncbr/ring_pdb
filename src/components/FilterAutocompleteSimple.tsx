import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Checkbox, Chip } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useTheme } from '@mui/material/styles';
import { getChipStyles } from '../helperFunctions/helpers.ts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { OtherSelectedFiltersType } from './FilterAutocomplete.tsx';
import { useApiErrorHandler } from '../hooks/useApiErrorHandler.ts';

export const FilterAutocompleteSimple = ({
  options,
  filterByLabel,
  selectedValues,
  onChange,
  otherSelectedFilters,
}: {
  options: string[];
  filterByLabel: string;
  selectedValues: string[];
  onChange: (newValue: any) => void;
  otherSelectedFilters?: OtherSelectedFiltersType;
}) => {
  // only for experimental method
  const [allOptions, setAllOptions] = useState([]);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const theme = useTheme();
  const { handleApiError } = useApiErrorHandler();



  useEffect(() => {
    if (filterByLabel === 'experimental method') {
      axios
        .post(`${import.meta.env.VITE_API_URL}/api/get_methods`, {
          otherFilters: otherSelectedFilters,
        })
        .then((response) => {
          setAllOptions(response.data.payload);
        })
        .catch((error) => {
          handleApiError(error)
          console.log('Error fetching data:', error);
          return;
        });
    }
  }, [otherSelectedFilters]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        minWidth: '290px',
      }}
    >
      <Autocomplete<string, true, false, false>
        multiple
        disableCloseOnSelect
        options={filterByLabel === 'experimental method' ? allOptions : options}
        value={selectedValues}
        // getOptionLabel={(option) => option as string}
        onChange={(_e, newValue) => {
          onChange(newValue);
        }}
        renderInput={(params) => {
          const { InputProps, ...restParams } = params;
          const { startAdornment, ...restInputProps } = InputProps;

          return (
            <TextField
              {...restParams}
              label={`Filter by ${filterByLabel}`}
              sx={{
                '& .MuiOutlinedInput-input': {
                  fontFamily: 'Lora, sans-serif',
                  fontSize: '14px',
                },
              }}
              InputProps={{
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
              }}
            />
          );
        }}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option}
            </li>
          );
        }}
        renderTags={
          filterByLabel === 'ring type'
            ? (tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={`${option}-${selectedValues.length}`}
                      label={option}
                      {...tagProps}
                      sx={{ ...getChipStyles(option, theme) }}
                    />
                  );
                })
            : undefined
        }
      />
    </Box>
  );
};
