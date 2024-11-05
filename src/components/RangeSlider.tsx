import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { useEffect, useState } from 'react';

const Input = styled(MuiInput)`
  font-size: 0.9rem;
  //width: 42px;
`;

const CustomSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-thumb': {
    width: 16,
    height: 16,
  },
}));

export default function RangeSlider({
  filterBy,
  minVal,
  maxVal,
  step,
  disabled,
}: {
  filterBy: string;
  minVal: number | 'N/A' | undefined;
  maxVal: number | 'N/A' | undefined;
  step: number;
  disabled: boolean;
}) {
  if (minVal === undefined) {
    minVal = 'N/A';
    maxVal = 'N/A';
  }

  const [value, setValue] = useState([minVal, maxVal]);

  useEffect(() => {
    setValue([minVal, maxVal]); // Reset to new min/max values
  }, [minVal, maxVal]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  const handleMinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.replace(',', '.');
    const isValidInput = /^-?\d*\.?\d*$/.test(inputValue);
    if (isValidInput) {
      setValue([inputValue, value[1]]);
    }
  };

  const handleMaxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.replace(',', '.');
    const isValidInput = /^-?\d*\.?\d*$/.test(inputValue);
    if (isValidInput) {
      setValue([value[0], inputValue]);
    }
  };

  const handleBlurMin = () => {
    const parsedValue = parseFloat(value[0]);
    if (!isNaN(parsedValue) && parsedValue >= minVal && parsedValue <= value[1]) {
      setValue([parsedValue, value[1]]);
    } else {
      setValue([minVal, value[1]]);
    }
  };

  const handleBlurMax = () => {
    const parsedValue = parseFloat(value[1]);
    if (!isNaN(parsedValue) && parsedValue <= maxVal && parsedValue >= value[0]) {
      setValue([value[0], parsedValue]);
    } else {
      setValue([value[0], maxVal]);
    }
  };

  return (
    <Box sx={{ width: 'auto' }}>
      <Grid
        container
        columnSpacing={2}
        rowSpacing={0}
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Grid size={6}>
          <Input
            value={value[0]}
            size="small"
            onChange={handleMinInputChange}
            onBlur={handleBlurMin}
            disabled={disabled}
            inputProps={{
              type: 'text',
              label: 'Min',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
        <Grid size={6}>
          <Input
            value={value[1]}
            size="small"
            onChange={handleMaxInputChange}
            onBlur={handleBlurMax}
            disabled={disabled}
            inputProps={{
              type: 'text',
              label: 'Max',
              'aria-labelledby': 'input-slider',
              sx: { textAlign: 'right' },
            }}
          />
        </Grid>
        <Grid size={12}>
          <CustomSlider
            value={value}
            min={minVal}
            max={maxVal}
            step={step}
            color="primary"
            valueLabelDisplay="off"
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            disableSwap
            disabled={disabled}
          />
        </Grid>
      </Grid>
      <Typography variant="caption" id="input-slider" sx={{ fontSize: '0.9rem' }}>
        Filter by {filterBy}
      </Typography>
    </Box>
  );
}
