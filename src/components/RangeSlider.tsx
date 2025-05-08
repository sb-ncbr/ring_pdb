import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import React, { useEffect, useMemo } from 'react';
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

export type ValueType = number | 'N/A' | undefined;

export default function RangeSlider({
  filterBy,
  minVal,
  maxVal,
  step,
  disabled,
  value,
  onChange,
}: {
  filterBy: string;
  minVal: ValueType;
  maxVal: ValueType;
  step: number;
  disabled: boolean;
  value: [number, number];
  onChange: (newValue: any) => void;
}) {
  if (minVal === undefined) {
    minVal = 'N/A';
    maxVal = 'N/A';
  }

  const currentValue =
    value && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number'
      ? value
      : [minVal, maxVal];

  const debouncedChange = useMemo(
    () => debounce((newValue: [number, number]) => onChange(newValue), 500),
    [onChange],
  );

  useEffect(() => {
    return () => {
      debouncedChange.cancel();
    };
  }, [debouncedChange]);

  const handleSliderChange = (_e: Event, newValue: any) => {
    debouncedChange(newValue);
  };
  const handleMinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.replace(',', '.');
    const isValidInput = /^-?\d*\.?\d*$/.test(inputValue);
    if (isValidInput) {
      const inputValueNumber = parseFloat(inputValue);
      if (value) debouncedChange([inputValueNumber, value[1] || (maxVal as number)]);
    }
  };

  const handleMaxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.replace(',', '.');
    const isValidInput = /^-?\d*\.?\d*$/.test(inputValue);
    if (isValidInput) {
      const inputValueNumber = parseFloat(inputValue);
      if (value) debouncedChange([value[0] || (minVal as number), inputValueNumber]);
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
      const val: [number, number] = [parsedValue, value[1]];
      debouncedChange(val);
    } else {
      const val: any = [minVal, value[1]];
      debouncedChange(val);
    }
  };

  const handleBlurMax = () => {
    const parsedValue = parseFloat(String(value[1]));
    if (
      !isNaN(parsedValue) &&
      typeof maxVal === 'number' &&
      typeof value[0] === 'number' &&
      parsedValue <= maxVal &&
      parsedValue >= value[0]
    ) {
      const val: [number, number] = [value[0], parsedValue];
      debouncedChange(val);
    } else {
      const val: any = [value[0], maxVal];
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
            value={value[0] || minVal}
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
            value={value[1] || maxVal}
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
            value={currentValue as [number, number]}
            min={minVal as number}
            max={maxVal as number}
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
