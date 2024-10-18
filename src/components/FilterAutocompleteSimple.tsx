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
}: {
  options: string[];
  filterByLabel: string;
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
        // size="small"
        disableCloseOnSelect
        options={options}
        getOptionLabel={(option) => option}
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
                      key={key}
                      label={option}
                      // size="small"
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
