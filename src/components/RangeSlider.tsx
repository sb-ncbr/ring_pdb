import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';

const Input = styled(MuiInput)`
  width: 48px;
`;

export default function RangeSlider() {
  const [value, setValue] = React.useState<number[]>([0.5, 0.7]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  const handleMaxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === '' ? [value[0], 0] : [value[0], Number(event.target.value)]);
  };

  const handleMinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === '' ? [0, value[1]] : [Number(event.target.value), value[1]]);
  };

  // const handleBlur = () => {
  //   if (value[0] < 0) {
  //     setValue(0);
  //   } else if (value > 100) {
  //     setValue(100);
  //   }
  // };

  return (
    <Box sx={{ width: 200 }}>
      <Typography id="input-slider" gutterBottom>
        Filter by resolution
      </Typography>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        <Grid item xs>
          <Input
            value={value[1]}
            size="small"
            onChange={handleMinInputChange}
            // onBlur={handleBlur}
            inputProps={{
              step: 0.01,
              min: 0,
              max: 1,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
          <Slider
            value={value}
            min={0}
            max={1}
            step={0.01}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            aria-labelledby="input-slider"
            disableSwap
          />
        </Grid>
        <Grid item>
          <Input
            value={value[1]}
            size="small"
            onChange={handleMaxInputChange}
            // onBlur={handleBlur}
            inputProps={{
              step: 0.01,
              min: 0,
              max: 1,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
