import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Filter1 from '@mui/icons-material/Filter1';
import Filter2 from '@mui/icons-material/Filter2';
import Filter3 from '@mui/icons-material/Filter3';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RingCard } from './RingCard.tsx';
import Button from '@mui/material/Button';

import ringCards from '../content/ringCards.json';
import { ConformationCard } from './ConformationCard.tsx';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          'linear-gradient(136deg, rgb(242, 163, 123) 0%, rgb(233, 124, 137) 50%, rgb(168, 95, 165) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          'linear-gradient(136deg, rgb(242, 163, 123) 0%, rgb(233, 124, 137) 50%, rgb(168, 95, 165) 100%)',
      },
    },
  ],
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement<unknown> } = {
    1: <Filter1 />,
    2: <Filter2 />,
    3: <Filter3 />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = ['Select a ring type', 'Select a conformation', 'Browse the data'];

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

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
  };

  const handleStepClick = (step) => {
    if (step < activeStep) {
      setActiveStep(step);
    }
  };

  return (
    <Box>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
        sx={{ marginTop: '32px' }}
      >
        {steps.map((label, index) => (
          <Step key={label} onClick={() => handleStepClick(index)} style={{ cursor: 'pointer' }}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 && (
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
            />
          ))}
        </Stack>
      )}
      {activeStep === 1 && (
        <>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              margin: '16px 0',
              gap: '16px',
            }}
          >
            {ringCards.rings[selectedRing.index].confs.map((conf, index) => (
              <ConformationCard
                key={index}
                {...conf}
                handleCardSelect={() => handleConfSelect(conf.name)}
              />
            ))}
          </Box>
          <Button onClick={handleBack} color="primary">
            Go Back
          </Button>
        </>
      )}
      {activeStep === 2 && (
        <>
          <div>
            You have selected ring: {selectedRing.name} and conformation: {selectedConf}
          </div>
          <Button onClick={handleBack} color="primary">
            Go Back
          </Button>
        </>
      )}
    </Box>
  );
}
