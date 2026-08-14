import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Checkbox, Chip } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useTheme } from '@mui/material/styles';
import { getChipStyles } from '../helperFunctions/helpers.tsx';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useApiErrorHandler } from '../lib/hooks/use-api-error-handler.ts';
import { OtherSelectedFiltersType, RingType } from '../data/dataTypes.ts';

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
          handleApiError(error);
          console.log('Error fetching data:', error);
          return;
        });
    }
  }, [otherSelectedFilters]);

  return (
    <Box
      sx={{
        minWidth: filterByLabel === 'experimental method' ? 290 : 250,
      }}
    >
      <Autocomplete<string, true, false, false>
        multiple
        disableCloseOnSelect
        options={filterByLabel === 'experimental method' ? allOptions : options}
        value={selectedValues}
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
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
              {option}
            </li>
          );
        }}
        renderValue={
          filterByLabel === 'ring type'
            ? (value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={`${option}-${selectedValues.length}`}
                    label={option}
                    {...tagProps}
                    sx={{ ...getChipStyles(option as RingType, theme) }}
                  />
                );
              })
            : undefined
        }
      />
    </Box>
  );
};
