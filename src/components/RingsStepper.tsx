import * as React from 'react';
import { useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RingCard } from './RingCard.tsx';

import ringCards from '../content/ringCards.json';
import { ConformationCard } from './ConformationCard.tsx';
import { StepContent, Typography } from '@mui/material';

const steps = ['Select a ring type', 'Select a conformation'];

export default function RingsStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedRing, setSelectedRing] = useState({ name: null, index: null });
  const [selectedConf, setSelectedConf] = useState(null);

  const handleRingSelect = (ring) => {
    setSelectedRing(ring);
    handleNext();
  };

  const handleConfSelect = (conf) => {
    setSelectedConf(conf);
    handleNext();
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, steps.length - 1));
  };

  const handleStepClick = (step) => {
    if (step < activeStep) {
      setActiveStep(step);
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ margin: '32px' }}>
        {/*first step*/}
        <Step
          key={steps[0]}
          onClick={() => {
            handleStepClick(0);
          }}
          style={{ cursor: 'pointer' }}
          expanded
        >
          <StepLabel>
            <Typography variant="h6">{steps[0]}</Typography>
          </StepLabel>
          <StepContent>
            <Stack
              direction="row"
              gap="24px"
              sx={{
                justifyContent: 'center',
                alignItems: 'stretch',
                margin: '16px 0',
              }}
            >
              {ringCards.rings.map((ring, index) => (
                <RingCard
                  key={index}
                  {...ring}
                  handleCardSelect={() => handleRingSelect({ name: ring.name, index: index })}
                  isSelected={selectedRing?.index === index}
                />
              ))}
            </Stack>
          </StepContent>
        </Step>

        {/*second step*/}
        <Step key={steps[1]} onClick={() => handleStepClick(1)} style={{ cursor: 'pointer' }}>
          <StepLabel>
            <Typography variant="h6">{steps[1]}</Typography>
          </StepLabel>
          <StepContent>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                margin: '16px 0',
                gap: '16px',
              }}
            >
              {ringCards.rings[selectedRing.index]?.confs.map((conf, index) => (
                <ConformationCard
                  key={index}
                  {...conf}
                  handleCardSelect={() => handleConfSelect(conf.name)}
                />
              ))}
            </Box>
          </StepContent>
        </Step>
      </Stepper>
    </Box>
  );
}
