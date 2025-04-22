import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import React, { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';

const Input = styled(MuiInput)`
  font-size: 0.9rem;
  //width: 42px;
`;

const CustomSlider = styled(Slider)(() => ({
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
  onChange,
}: {
  filterBy: string;
  minVal: number | 'N/A' | undefined;
  maxVal: number | 'N/A' | undefined;
  step: number;
  disabled: boolean;
  onChange: (newValue: any) => void;
}) {
  if (minVal === undefined) {
    minVal = 'N/A';
    maxVal = 'N/A';
  }

  const [value, setValue] = useState([minVal, maxVal]);

  useEffect(() => {
    setValue([minVal, maxVal]); // Reset to new min/max values
  }, [minVal, maxVal]);

  const handleSliderChange = (_e: Event, newValue: any) => {
    setValue(newValue);
    debouncedChange(newValue);
  };

  const debouncedChange = useMemo(
    () => debounce((newValue: (number | 'N/A' | undefined)[]) => onChange(newValue), 500),
    [onChange],
  );

  useEffect(() => {
    return () => {
      debouncedChange.cancel();
    };
  }, [debouncedChange]);

  const handleMinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.replace(',', '.');
    const isValidInput = /^-?\d*\.?\d*$/.test(inputValue);
    if (isValidInput) {
      const inputValueNumber = parseFloat(inputValue);
      setValue([inputValueNumber, value[1]]);
      debouncedChange([inputValueNumber, value[1]]);
    }
  };

  const handleMaxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.replace(',', '.');
    const isValidInput = /^-?\d*\.?\d*$/.test(inputValue);
    if (isValidInput) {
      const inputValueNumber = parseFloat(inputValue);
      setValue([value[0], inputValueNumber]);
      debouncedChange([value[0], inputValueNumber]);
    }
  };

  const handleBlurMin = () => {
    const parsedValue =
      typeof value[0] === 'number'
        ? value[0]
        : value[0] === 'N/A' || value[0] === undefined
          ? undefined
          : parseFloat(value[0]);
    if (
      parsedValue &&
      typeof minVal === 'number' &&
      typeof value[1] === 'number' &&
      parsedValue >= minVal &&
      parsedValue <= value[1]
    ) {
      const val = [parsedValue, value[1]];
      setValue(val);
      debouncedChange(val);
    } else {
      const val = [minVal, value[1]];
      setValue(val);
      debouncedChange(val);
    }
  };

  const handleBlurMax = () => {
    const parsedValue = parseFloat(value[1] as string);
    if (
      !isNaN(parsedValue) &&
      typeof maxVal === 'number' &&
      typeof value[0] === 'number' &&
      parsedValue <= maxVal &&
      parsedValue >= value[0]
    ) {
      const val = [value[0], parsedValue];
      setValue(val);
      debouncedChange(val);
    } else {
      const val = [value[0], maxVal];
      setValue(val);
      debouncedChange(val);
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
            value={value as number[]}
            min={Number(minVal)}
            max={Number(maxVal)}
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
