import { styled } from '@mui/material/styles';
import { Box, Grid, Typography, Slider } from '@mui/material';
import MuiInput from '@mui/material/Input';
import React, { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { useTheme } from '@mui/material/styles';

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
  sliderResetCounter,
}: {
  filterBy: string;
  minVal: ValueType;
  maxVal: ValueType;
  step: number;
  disabled: boolean;
  value: [number, number];
  onChange: (newValue: any) => void;
  sliderResetCounter: number;
}) {
  const [isTouched, setIsTouched] = useState(false);
  const theme = useTheme();

  if (minVal === undefined) {
    minVal = 'N/A';
    maxVal = 'N/A';
  }
  const currentValue =
    value && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number'
      ? value
      : [minVal, maxVal];

  const [internalValue, setInternalValue] = useState<[number, number]>(
    currentValue as [number, number],
  );

  useEffect(() => {
    if (sliderResetCounter) {
      setIsTouched(false);
    }
  }, [sliderResetCounter]);

  useEffect(() => {
    const newCurrentValue =
      value && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number'
        ? value
        : [minVal, maxVal];
    // sync internal value when parent changes
    setInternalValue(newCurrentValue as [number, number]);
  }, [value]);

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
    setInternalValue(newValue);
    debouncedChange(newValue);
    if (!isTouched) setIsTouched(true);
  };
  const handleMinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.replace(',', '.');
    const isValidInput = /^-?\d*\.?\d*$/.test(inputValue);
    if (isValidInput) {
      const inputValueNumber = parseFloat(inputValue);
      if (value) {
        setInternalValue([inputValueNumber, value[1] || (maxVal as number)]);
        debouncedChange([inputValueNumber, value[1] || (maxVal as number)]);
      }
    }
  };

  const handleMaxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.replace(',', '.');
    const isValidInput = /^-?\d*\.?\d*$/.test(inputValue);
    if (isValidInput) {
      const inputValueNumber = parseFloat(inputValue);
      if (value) {
        setInternalValue([value[0] || (minVal as number), inputValueNumber]);
        debouncedChange([value[0] || (minVal as number), inputValueNumber]);
      }
    }
  };

  const handleBlurMin = () => {
    const parsedValue =
      typeof value[0] === 'number'
        ? value[0]
        : value[0] === 'N/A' || value[0] === undefined
          ? undefined
          : parseFloat(value[0] as any);

    if (
      parsedValue !== undefined &&
      typeof minVal === 'number' &&
      typeof value[1] === 'number' &&
      parsedValue >= minVal &&
      parsedValue <= value[1]
    ) {
      const val: [number, number] = [parsedValue, value[1]];
      debouncedChange(val);
    } else {
      const val: [number, number] = [
        typeof minVal === 'number' ? minVal : -999,
        typeof value[1] === 'number' ? value[1] : typeof maxVal === 'number' ? maxVal : 999,
      ];
      debouncedChange(val);
    }
  };

  const handleBlurMax = () => {
    const parsedValue =
      typeof value[1] === 'number'
        ? value[1]
        : value[1] === 'N/A' || value[1] === undefined
          ? undefined
          : parseFloat(value[1] as any);

    if (
      parsedValue !== undefined &&
      typeof maxVal === 'number' &&
      typeof value[0] === 'number' &&
      parsedValue >= value[0] &&
      parsedValue <= maxVal
    ) {
      const val: [number, number] = [value[0], parsedValue];
      debouncedChange(val);
    } else {
      const val: [number, number] = [
        typeof value[0] === 'number' ? value[0] : typeof minVal === 'number' ? minVal : -999,
        typeof maxVal === 'number' ? maxVal : 999,
      ];
      debouncedChange(val);
    }
  };
  const disabledBackground = theme.palette.action.disabledBackground;

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
            value={internalValue[0] || minVal}
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
            value={internalValue[1] || maxVal}
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
            value={internalValue as [number, number]}
            min={minVal as number}
            max={maxVal as number}
            step={step}
            color="primary"
            valueLabelDisplay="off"
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            disableSwap
            disabled={disabled}
            sx={{
              '& .MuiSlider-thumb': {
                color: isTouched && !disabled ? 'primary.main' : 'rgb(189, 189, 189)',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: `0px 0px 0px 8px ${theme.palette.action.disabledBackground}`,
                },
              },
              '& .MuiSlider-track': {
                color: isTouched && !disabled ? 'primary.main' : disabledBackground,
                border: isTouched && !disabled ? '1px solid' : 'none',
              },
              '& .MuiSlider-rail': {
                color: isTouched && !disabled ? 'primary.main' : disabledBackground,
              },
            }}
          />
        </Grid>
      </Grid>
      <Typography variant="caption" id="input-slider" sx={{ fontSize: '0.9rem' }}>
        Filter by {filterBy}
      </Typography>
    </Box>
  );
}
