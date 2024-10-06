import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';

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
}: {
  filterBy: string;
  minVal: number;
  maxVal: number;
  step: number;
}) {
  const [value, setValue] = React.useState<number[]>([minVal, maxVal]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  const handleMaxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(event.target.value) || maxVal;

    if (newMax >= value[0]) {
      setValue([value[0], newMax]);
    } else {
      setValue([value[0], value[0]]);
    }
  };

  const handleMinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(event.target.value) || minVal;

    if (newMin <= value[1]) {
      setValue([newMin, value[1]]);
    } else {
      setValue([value[1], value[1]]);
    }
  };

  const handleBlurMin = () => {
    if (value[0] < minVal) {
      setValue([minVal, value[1]]);
    } else if (value[0] > maxVal) {
      setValue([maxVal, value[1]]);
    }
  };

  const handleBlurMax = () => {
    if (value[1] < minVal) {
      setValue([value[0], minVal]);
    } else if (value[1] > maxVal) {
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
            inputProps={{
              step: step,
              min: minVal,
              max: maxVal,
              type: 'number',
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
            inputProps={{
              step: step,
              min: minVal,
              max: maxVal,
              type: 'number',
              inputMode: 'decimal',
              label: 'Max',
              'aria-labelledby': 'input-slider',
            }}
            // sx={{ width: 'auto' }}
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
          />
        </Grid>
      </Grid>
      <Typography variant="caption" id="input-slider" sx={{ fontSize: '0.9rem' }}>
        Filter by {filterBy}
      </Typography>
    </Box>
  );
}
