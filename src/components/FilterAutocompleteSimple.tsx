import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Checkbox, Chip } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useTheme } from '@mui/material/styles';
import { getChipStyles } from '../data/columnData.tsx';

export const FilterAutocompleteSimple = ({
  options,
  filterByLabel,
  selectedValues,
  onChange,
}: {
  options: string[];
  filterByLabel: string;
  selectedValues: string[];
  onChange: (newValue) => void;
}) => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const theme = useTheme();
  return (
    <Box
      sx={{
        flexGrow: 1,
        minWidth: '290px',
      }}
    >
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={options}
        value={selectedValues}
        getOptionLabel={(option) => option}
        onChange={(event, newValue) => {
          onChange(newValue);
        }}
        renderInput={(params) => <TextField {...params} label={`Filter by ${filterByLabel}`} />}
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
            : null
        }
      />
    </Box>
  );
};
